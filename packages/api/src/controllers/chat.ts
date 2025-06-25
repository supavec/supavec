import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { ValidatedChatRequest } from "../middleware/chat/validate-request";
import { google } from "@ai-sdk/google";
import { generateText, pipeDataStreamToResponse, streamText } from "ai";
import { AuthenticatedRequest } from "../middleware/auth";

export const chat = async (req: AuthenticatedRequest, res: Response) => {
  console.log("[CHAT] Request received");
  try {
    const { query, k, file_ids, stream: isStreaming, apiKeyData } = req.body
      .validatedData as ValidatedChatRequest;
    const topK = k && k > 0 ? Math.max(k, 8) : 8; // ensure at least 8 passages
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
      topK,
    );

    const context = similaritySearchResults
      .map((doc) => doc.pageContent)
      .join("\n\n");

    console.log("[CHAT] Generating response with AI");

    const prompt = `
You are a concise expert assistant.
Think step-by-step.

When a question asks for a numeric fact, follow these rules strictly  
1. Output exactly **one** value that answers the question.  
2. Retain the unit as shown in Context (e.g. “Bq/m³”, “mSv/y”).  
3. Do NOT include ranges, ± notation, quotes, or extra numbers.  
4. If the question says “total”, you may add numbers found in Context, then output only the sum with its unit.

Return the answer as a short declarative sentence mirroring the wording of the question.  
Example: *“Indoor radon activity concentration during the burning season was 63 Bq/m³.”*

Use only the information found in the Context.  
If the required information is absent, reply exactly:  
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
            temperature: 0.1,
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
      temperature: 0.1,
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
      userId: req.userId || "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
