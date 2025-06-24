import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { ValidatedChatRequest } from "../middleware/chat/validate-request";
import { google } from "@ai-sdk/google";
import { generateText, pipeDataStreamToResponse, streamText } from "ai";

console.log("[CHAT] Module loaded");

export interface AuthenticatedRequest extends Request {
  apiKey: string;
  userId: string;
}

export const chat = async (req: AuthenticatedRequest, res: Response) => {
  console.log("[CHAT] Request received");
  try {
    const { query, k, file_ids, stream: isStreaming, apiKeyData } = req.body
      .validatedData as ValidatedChatRequest;
    console.log("[CHAT] Processing chat request", {
      query,
      k,
      fileIdsCount: file_ids.length,
      stream: isStreaming,
    });

    console.log("[CHAT] Creating vector store");
    const vectorStore = new SupabaseVectorStore(
      new OpenAIEmbeddings({
        modelName: "text-embedding-3-small",
        model: "text-embedding-3-small",
      }),
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents",
        filter: { file_id: { in: file_ids } },
      },
    );

    console.log("[CHAT] Performing similarity search");
    const similaritySearchResults = await vectorStore.similaritySearch(
      query,
      k,
    );

    const context = similaritySearchResults
      .map((doc) => doc.pageContent)
      .join("\n\n");

    console.log("[CHAT] Generating response with AI");

    const prompt = `
You are a concise expert assistant.
Think step-by-step, but **do NOT reveal your reasoning**.
Use only the Context.
If the answer is missing, say:
"I don't know based on the provided documents."

### Context
${context}

### Question
${query}

### Final Answer
`;

    if (isStreaming) {
      pipeDataStreamToResponse(res, {
        execute: async (dataStream) => {
          dataStream.writeData({
            status: "initialized",
            timestamp: Date.now(),
          });

          const result = streamText({
            model: google("gemini-2.0-flash"),
            prompt,
            temperature: 0.2,
            maxTokens: 1024,
          });

          console.log("[CHAT] Starting stream response");
          dataStream.writeData({ status: "streaming", timestamp: Date.now() });

          result.mergeIntoDataStream(dataStream);

          await result.consumeStream();
          client.capture({
            distinctId: apiKeyData.profiles.email,
            event: "/chat API Call (streaming)",
          });

          logApiUsageAsync({
            endpoint: "/chat",
            userId: apiKeyData.user_id,
            success: true,
          });

          dataStream.writeData({ status: "completed", timestamp: Date.now() });
        },
        onError: (error) => {
          console.error("[CHAT] Streaming error:", error);
          logApiUsageAsync({
            endpoint: "/chat",
            userId: apiKeyData.user_id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return "An error occurred during streaming";
        },
      });

      return;
    }

    // Non-streaming response
    const { text: answer } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.2,
      maxTokens: 1024,
    });

    console.log("[CHAT] Capturing PostHog event");
    client.capture({
      distinctId: apiKeyData.profiles.email,
      event: "/chat API Call",
    });

    const apiResponse = {
      success: true,
      answer,
    };

    console.log("[CHAT] Logging API usage");
    logApiUsageAsync({
      endpoint: "/chat",
      userId: apiKeyData.user_id,
      success: true,
    });

    console.log("[CHAT] Sending successful response");
    return res.status(200).json(apiResponse);
  } catch (error) {
    console.error("[CHAT] Error in chat endpoint:", error);

    logApiUsageAsync({
      endpoint: "/chat",
      userId: req.userId,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
