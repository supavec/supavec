import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";

const embeddingsSchema = z.object({
  query: z.string().min(1, "Query is required"),
  k: z.number().int().positive().default(3),
  include_vectors: z.boolean().optional(),
  include_raw_file: z.boolean().optional(),
  file_ids: z.array(z.string().uuid()).min(
    1,
    "At least one file ID is required",
  ),
});

type EmbeddingsRequest = z.infer<typeof embeddingsSchema>;

async function validateRequest(req: Request): Promise<{
  success: boolean;
  data?: EmbeddingsRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiKeyData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  statusCode?: number;
}> {
  console.log("[EMBEDDINGS] Validating request");
  // Validate request body
  const validationResult = embeddingsSchema.safeParse(req.body);
  if (!validationResult.success) {
    console.log(
      "[EMBEDDINGS] Request validation failed",
      validationResult.error.issues,
    );
    return {
      success: false,
      error: validationResult.error.issues,
      statusCode: 400,
    };
  }
  console.log("[EMBEDDINGS] Request body validated", {
    query: validationResult.data.query,
    k: validationResult.data.k,
    fileIds: validationResult.data.file_ids.length,
  });

  // Validate API key and get team ID
  const apiKey = req.headers.authorization as string;
  console.log("[EMBEDDINGS] Verifying API key");
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from("api_keys")
    .select("team_id, user_id, profiles(email)")
    .match({ api_key: apiKey })
    .single();

  if (apiKeyError || !apiKeyData?.team_id) {
    console.log("[EMBEDDINGS] Invalid API key", { error: apiKeyError });
    return {
      success: false,
      error: "Invalid API key",
      statusCode: 401,
    };
  }
  console.log("[EMBEDDINGS] API key verified", { teamId: apiKeyData.team_id });

  // Verify file ownership
  console.log("[EMBEDDINGS] Verifying file ownership");
  const { data: files, error: filesError } = await supabase
    .from("files")
    .select("file_id")
    .in("file_id", validationResult.data.file_ids)
    .match({ team_id: apiKeyData.team_id });

  if (filesError) {
    console.log("[EMBEDDINGS] Error verifying file ownership", {
      error: filesError,
    });
    throw new Error(`Failed to verify file ownership: ${filesError.message}`);
  }

  if (!files || files.length !== validationResult.data.file_ids.length) {
    console.log("[EMBEDDINGS] File ownership verification failed", {
      requestedFiles: validationResult.data.file_ids.length,
      foundFiles: files?.length || 0,
    });
    return {
      success: false,
      error: "One or more files do not belong to your team",
      statusCode: 403,
    };
  }
  console.log("[EMBEDDINGS] File ownership verified", {
    fileCount: files.length,
  });

  return {
    success: true,
    data: validationResult.data,
    apiKeyData,
  };
}

export const getEmbeddings = async (req: Request, res: Response) => {
  console.log("[EMBEDDINGS] Request received");
  try {
    const validation = await validateRequest(req);
    if (!validation.success) {
      console.log("[EMBEDDINGS] Request validation failed", {
        statusCode: validation.statusCode,
        error: validation.error,
      });
      return res.status(validation.statusCode!).json({
        success: false,
        error: validation.error,
      });
    }

    const { query, k, file_ids } = validation.data!;
    console.log("[EMBEDDINGS] Processing embeddings request", {
      query,
      k,
      fileIdsCount: file_ids.length,
    });

    console.log("[EMBEDDINGS] Creating vector store");
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

    console.log("[EMBEDDINGS] Performing similarity search");
    const similaritySearchWithScoreResults = await vectorStore
      .similaritySearchWithScore(query, k);
    console.log("[EMBEDDINGS] Similarity search completed", {
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

    console.log("[EMBEDDINGS] Capturing PostHog event");
    client.capture({
      distinctId: validation.apiKeyData.profiles?.email as string,
      event: "/embeddings API Call",
    });

    const response = {
      success: true,
      documents: documentsResponse,
    };

    console.log("[EMBEDDINGS] Logging API usage");
    logApiUsageAsync({
      endpoint: "/embeddings",
      userId: validation.apiKeyData.user_id || "",
      success: true,
    });

    console.log("[EMBEDDINGS] Sending successful response");
    return res.status(200).json(response);
  } catch (error) {
    console.error("[EMBEDDINGS] Error in embeddings endpoint:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[EMBEDDINGS] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/embeddings",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[EMBEDDINGS] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    console.log("[EMBEDDINGS] Sending error response");
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
