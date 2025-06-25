import type { PostgrestError } from "@supabase/supabase-js";
import { Request, Response } from "express";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { storeDocumentsWithFileId } from "../utils/vector-store";

type ValidatedRequest = Request & {
  body: {
    validatedData: {
      file_id: string;
      contents: string;
      name: string;
      chunk_size: number;
      chunk_overlap: number;
      teamId: string;
      apiKeyData: {
        team_id: string;
        user_id: string | null;
        profiles: {
          email: string | null;
        } | null;
      };
    };
  };
};

export const overwriteText = async (req: ValidatedRequest, res: Response) => {
  console.log("[OVERWRITE-TEXT] Request received");
  try {
    const {
      file_id,
      contents,
      name,
      chunk_size,
      chunk_overlap,
      teamId,
      apiKeyData,
    } = req.body.validatedData;

    // check if file is a txt file
    const { data: file } = await supabase
      .from("files")
      .select("type, storage_path")
      .match({ file_id, team_id: teamId })
      .single();

    if (file?.type !== "text") {
      throw new Error("File is not a text file");
    }

    // Delete file from storage
    console.log("[OVERWRITE-TEXT] Deleting file from storage");
    if (file?.storage_path) {
      const { error: deleteError } = await supabase.storage
        .from("user-documents")
        .remove([file.storage_path]);

      if (deleteError) {
        console.log("[OVERWRITE-TEXT] Error deleting from storage", {
          error: deleteError,
        });
      }
    }

    // Soft delete existing documents
    console.log("[OVERWRITE-TEXT] Soft deleting existing documents");
    const now = new Date().toISOString();

    let documentsUpdateError: PostgrestError | Error | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(
          `[OVERWRITE-TEXT] Attempting to update documents (attempt ${
            retryCount + 1
          }/${maxRetries})`,
        );
        const { error } = await supabase
          .from("documents")
          .update({ deleted_at: now })
          .match({ file_id });

        if (!error) {
          console.log(
            "[OVERWRITE-TEXT] Existing embeddings marked as deleted successfully",
          );
          documentsUpdateError = null;
          break;
        } else {
          documentsUpdateError = error;
          console.log(
            `[OVERWRITE-TEXT] Error updating documents (attempt ${
              retryCount + 1
            }/${maxRetries})`,
            {
              error: documentsUpdateError,
            },
          );

          // Only retry if we haven't reached max retries yet
          if (retryCount < maxRetries - 1) {
            // Exponential backoff: 1s, 2s, 4s, etc.
            const backoffTime = Math.pow(2, retryCount) * 1000;
            console.log(`[OVERWRITE-TEXT] Retrying in ${backoffTime}ms...`);
            await new Promise((resolve) => setTimeout(resolve, backoffTime));
          }
        }
      } catch (err) {
        documentsUpdateError = err as Error;
        console.log(
          `[OVERWRITE-TEXT] Unexpected error updating documents (attempt ${
            retryCount + 1
          }/${maxRetries})`,
          {
            error: documentsUpdateError,
          },
        );

        if (retryCount < maxRetries - 1) {
          const backoffTime = Math.pow(2, retryCount) * 1000;
          console.log(`[OVERWRITE-TEXT] Retrying in ${backoffTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
        }
      }

      retryCount++;
    }

    if (documentsUpdateError) {
      console.log("[OVERWRITE-TEXT] All attempts to update documents failed", {
        error: documentsUpdateError,
      });
      throw new Error(
        `Failed to update documents after ${maxRetries} attempts: ${documentsUpdateError.message}`,
      );
    }

    // Upload new content to storage
    console.log("[OVERWRITE-TEXT] Uploading new content to storage");
    const fileName = `${file_id}_${Date.now()}.txt`;
    const { data: storageData, error: uploadError } = await supabase.storage
      .from("user-documents")
      .upload(`/${teamId}/${fileName}`, contents, {
        contentType: "text/plain",
        upsert: false,
      });

    if (uploadError) {
      console.log("[OVERWRITE-TEXT] Storage upload failed", {
        error: uploadError,
      });
      return res.status(500).json({
        success: false,
        error: "Failed to upload file to storage",
      });
    }

    // Create new embeddings
    console.log("[OVERWRITE-TEXT] Creating text splitter");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunk_size,
      chunkOverlap: chunk_overlap,
    });

    console.log("[OVERWRITE-TEXT] Splitting text into chunks");
    const docs = await splitter.createDocuments([contents], [{
      source: name,
      file_id: file_id,
    }]);
    console.log("[OVERWRITE-TEXT] Text split into chunks", {
      chunkCount: docs.length,
    });

    // Replace the existing embedding and storage logic with our utility function
    console.log("[OVERWRITE-TEXT] Storing documents in vector store");
    const { success, insertedCount } = await storeDocumentsWithFileId(
      docs,
      file_id,
      supabase,
    );

    if (!success) {
      throw new Error("Failed to store documents in vector store");
    }

    console.log(
      `[OVERWRITE-TEXT] All documents stored in vector store with file_id. Total inserted: ${insertedCount}`,
    );

    // Update file record
    console.log("[OVERWRITE-TEXT] Updating file record");
    await supabase
      .from("files")
      .update({
        file_name: `${name}.txt`,
        storage_path: storageData.path,
      })
      .match({ file_id });

    console.log("[OVERWRITE-TEXT] Capturing PostHog event");
    client.capture({
      distinctId: apiKeyData.profiles.email,
      event: "/overwrite_text API Call",
      properties: {
        file_name: name,
        file_type: "text",
        file_size: contents.length,
      },
    });

    console.log("[OVERWRITE-TEXT] Logging API usage");
    logApiUsageAsync({
      endpoint: "/overwrite_text",
      userId: apiKeyData.user_id || "",
      success: true,
    });

    console.log("[OVERWRITE-TEXT] Sending successful response");
    return res.json({
      success: true,
      message: "File overwritten successfully",
      file_id: file_id,
    });
  } catch (error) {
    console.error("[OVERWRITE-TEXT] Error overwriting file:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[OVERWRITE-TEXT] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/overwrite_text",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[OVERWRITE-TEXT] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
