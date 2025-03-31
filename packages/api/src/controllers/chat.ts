import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { ValidatedChatRequest } from "../middleware/chat/validate-request";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

console.log("[CHAT] Module loaded");

export const chat = async (req: Request, res: Response) => {
  console.log("[CHAT] Request received");
  try {
    const { query, k, file_ids, apiKeyData } = req.body
      .validatedData as ValidatedChatRequest;
    console.log("[CHAT] Processing chat request", {
      query,
      k,
      fileIdsCount: file_ids.length,
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

    console.log("[CHAT] Generating response with Gemini AI");
    const prompt =
      `Based on the following context, please answer the question. If the answer cannot be found in the context, please say so.

Context:
${context}

Question: ${query}`;
    const { text: answer } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
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

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[CHAT] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/chat",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
