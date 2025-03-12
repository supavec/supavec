import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";

console.log("[SEARCH] Module loaded");

const searchSchema = z.object({
  query: z.string().min(1, "Query is required"),
  k: z.number().int().positive().default(3),
  include_embeddings: z.boolean().optional().default(false),
  file_ids: z.array(z.string().uuid()).min(
    1,
    "At least one file ID is required",
  ),
});

type SearchRequest = z.infer<typeof searchSchema>;

async function validateRequest(req: Request): Promise<{
  success: boolean;
  data?: SearchRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiKeyData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  statusCode?: number;
}> {
  console.log("[SEARCH] Validating request");
  // Validate request body
  const validationResult = searchSchema.safeParse(req.body);
  if (!validationResult.success) {
    console.log(
      "[SEARCH] Request validation failed",
      validationResult.error.issues,
    );
    return {
      success: false,
      error: validationResult.error.issues,
      statusCode: 400,
    };
  }
  console.log("[SEARCH] Request body validated", {
    query: validationResult.data.query,
    k: validationResult.data.k,
    fileIds: validationResult.data.file_ids.length,
  });

  // Validate API key and get team ID
  const apiKey = req.headers.authorization as string;
  console.log("[SEARCH] Verifying API key");
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from("api_keys")
    .select("team_id, user_id, profiles(email)")
    .match({ api_key: apiKey })
    .single();

  if (apiKeyError || !apiKeyData?.team_id) {
    console.log("[SEARCH] Invalid API key", { error: apiKeyError });
    return {
      success: false,
      error: "Invalid API key",
      statusCode: 401,
    };
  }
  console.log("[SEARCH] API key verified", { teamId: apiKeyData.team_id });

  // Verify file ownership
  console.log("[SEARCH] Verifying file ownership");
  const { data: files, error: filesError } = await supabase
    .from("files")
    .select("file_id")
    .in("file_id", validationResult.data.file_ids)
    .match({ team_id: apiKeyData.team_id });

  if (filesError) {
    console.log("[SEARCH] Error verifying file ownership", {
      error: filesError,
    });
    throw new Error(`Failed to verify file ownership: ${filesError.message}`);
  }

  if (!files || files.length !== validationResult.data.file_ids.length) {
    console.log("[SEARCH] File ownership verification failed", {
      requestedFiles: validationResult.data.file_ids.length,
      foundFiles: files?.length || 0,
    });
    return {
      success: false,
      error: "One or more files do not belong to your team",
      statusCode: 403,
    };
  }
  console.log("[SEARCH] File ownership verified", {
    fileCount: files.length,
  });

  return {
    success: true,
    data: validationResult.data,
    apiKeyData,
  };
}

export const search = async (req: Request, res: Response) => {
  console.log("[SEARCH] Request received");
  try {
    const validation = await validateRequest(req);
    if (!validation.success) {
      console.log("[SEARCH] Request validation failed", {
        statusCode: validation.statusCode,
        error: validation.error,
      });
      return res.status(validation.statusCode!).json({
        success: false,
        error: validation.error,
      });
    }

    const { query, k, file_ids } = validation.data!;
    console.log("[SEARCH] Processing search request", {
      query,
      k,
      fileIdsCount: file_ids.length,
    });

    console.log("[SEARCH] Creating vector store");
    const vectorStore = new SupabaseVectorStore(
      new OpenAIEmbeddings({
        modelName: "text-embedding-3-small",
        model: "text-embedding-3-small",
      }),
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents",
        filter: file_ids ? { file_id: { in: file_ids } } : undefined,
      },
    );

    console.log("[SEARCH] Performing similarity search");
    const similaritySearchWithScoreResults = await vectorStore
      .similaritySearchWithScore(query, k);
    console.log("[SEARCH] Similarity search completed", {
      resultCount: similaritySearchWithScoreResults.length,
    });

    const documentsResponse = [];
    for (const [doc, score] of similaritySearchWithScoreResults) {
      documentsResponse.push({
        content: doc.pageContent,
        file_id: doc.metadata.file_id,
        score: score.toFixed(3),
      });
    }

    console.log("[SEARCH] Capturing PostHog event");
    client.capture({
      distinctId: validation.apiKeyData.profiles?.email as string,
      event: "/search API Call",
    });

    const response = {
      success: true,
      documents: documentsResponse,
    };

    console.log("[SEARCH] Logging API usage");
    logApiUsageAsync({
      endpoint: "/search",
      userId: validation.apiKeyData.user_id || "",
      success: true,
    });

    console.log("[SEARCH] Sending successful response");
    return res.status(200).json(response);
  } catch (error) {
    console.error("[SEARCH] Error in search endpoint:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[SEARCH] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/search",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[SEARCH] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    console.log("[SEARCH] Sending error response");
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
