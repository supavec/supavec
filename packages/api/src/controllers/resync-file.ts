import type { PostgrestError } from "@supabase/supabase-js";
import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { unlink, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";

console.log("[RESYNC-FILE] Module loaded");

type ValidatedRequest = Request & {
  body: {
    validatedData: {
      file_id: string;
      chunk_size?: number;
      chunk_overlap?: number;
      teamId: string;
      apiKeyData: {
        user_id?: string;
        profiles?: {
          email?: string;
        };
        [key: string]: unknown;
      };
    };
  };
};

async function getFileData(fileId: string, teamId: string) {
  console.log("[RESYNC-FILE] Fetching file data", { fileId, teamId });
  const { data: file, error: filesError } = await supabase
    .from("files")
    .select("file_id, storage_path, file_name, type")
    .match({ file_id: fileId, team_id: teamId })
    .is("deleted_at", null)
    .single();

  if (filesError) {
    console.log("[RESYNC-FILE] Error fetching file data", {
      error: filesError,
    });
    throw new Error(`Failed to fetch file: ${filesError.message}`);
  }

  if (!file) {
    console.log("[RESYNC-FILE] No file found");
    throw {
      status: 404,
      message: "No file found with the provided ID for this team",
    };
  }

  console.log("[RESYNC-FILE] File data retrieved", {
    fileId: file.file_id,
    fileName: file.file_name,
    fileType: file.type,
  });
  return file;
}

export const resyncFile = async (req: ValidatedRequest, res: Response) => {
  console.log("[RESYNC-FILE] Request received");
  try {
    const { file_id, chunk_size, chunk_overlap, teamId, apiKeyData } =
      req.body.validatedData;
    console.log("[RESYNC-FILE] Processing request with validated data", {
      file_id,
      chunk_size,
      chunk_overlap,
      teamId,
    });

    // Get file data from database
    const file = await getFileData(file_id, teamId);

    if (!file.storage_path) {
      console.log("[RESYNC-FILE] File has no storage path");
      throw new Error("File has no storage path");
    }

    // Download file from storage
    console.log("[RESYNC-FILE] Downloading file from storage", {
      path: file.storage_path,
    });
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("user-documents")
      .download(file.storage_path);

    if (downloadError) {
      console.log("[RESYNC-FILE] Error downloading file", {
        error: downloadError,
      });
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }
    console.log("[RESYNC-FILE] File downloaded successfully");

    // Save file to temp directory
    const isTextFile = file.type === "text";
    const fileExtension = isTextFile ? "txt" : "pdf";
    const tempFileName = `${file_id}.${fileExtension}`;
    const tempFilePath = join(tmpdir(), tempFileName);
    console.log("[RESYNC-FILE] Saving file to temp location", { tempFilePath });

    // Store the array buffer in a variable to avoid calling it multiple times
    const fileBuffer = Buffer.from(await fileData.arrayBuffer());
    await writeFile(tempFilePath, fileBuffer);

    // Process file content
    console.log("[RESYNC-FILE] Processing file content");
    let documents: Document[];
    if (isTextFile) {
      // For text files, create a single document from the content
      console.log("[RESYNC-FILE] Processing text file");
      const textContent = fileBuffer.toString("utf-8");
      documents = [
        new Document({
          pageContent: textContent,
          metadata: { source: tempFileName },
        }),
      ];
    } else {
      // For PDFs, use the PDFLoader
      console.log("[RESYNC-FILE] Processing PDF file with PDFLoader");
      const loader = new PDFLoader(tempFilePath);
      documents = await loader.load();
      console.log("[RESYNC-FILE] PDF loaded", { pageCount: documents.length });
    }

    // Clean up temp file
    console.log("[RESYNC-FILE] Cleaning up temp file");
    await unlink(tempFilePath);

    // Split text into chunks
    console.log("[RESYNC-FILE] Splitting content into chunks");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunk_size,
      chunkOverlap: chunk_overlap,
    });
    const chunks = await splitter.splitDocuments(documents);
    console.log("[RESYNC-FILE] Content split into chunks", {
      chunkCount: chunks.length,
    });

    // Add file_id metadata to each chunk
    console.log("[RESYNC-FILE] Adding metadata to chunks");
    chunks.forEach((chunk) => {
      chunk.metadata.file_id = file_id;
      chunk.metadata.team_id = teamId;
    });

    // Soft delete existing embeddings
    console.log("[RESYNC-FILE] Soft deleting existing embeddings");
    const now = new Date().toISOString();

    // Add retry logic for the document update operation
    let documentsUpdateError: PostgrestError | Error | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(
          `[RESYNC-FILE] Attempting to update documents (attempt ${
            retryCount + 1
          }/${maxRetries})`,
        );
        const { error } = await supabase
          .from("documents")
          .update({ deleted_at: now })
          .filter("metadata->>file_id", "eq", file_id);

        if (!error) {
          console.log(
            "[RESYNC-FILE] Existing embeddings marked as deleted successfully",
          );
          documentsUpdateError = null;
          break;
        } else {
          documentsUpdateError = error;
          console.log(
            `[RESYNC-FILE] Error updating documents (attempt ${
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
            console.log(`[RESYNC-FILE] Retrying in ${backoffTime}ms...`);
            await new Promise((resolve) => setTimeout(resolve, backoffTime));
          }
        }
      } catch (error) {
        documentsUpdateError = error instanceof Error ? error : new Error(
          typeof error === "object" ? JSON.stringify(error) : String(error),
        );
        console.log(
          `[RESYNC-FILE] Exception during document update (attempt ${
            retryCount + 1
          }/${maxRetries})`,
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        );

        // Only retry if we haven't reached max retries yet
        if (retryCount < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s, etc.
          const backoffTime = Math.pow(2, retryCount) * 1000;
          console.log(`[RESYNC-FILE] Retrying in ${backoffTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
        }
      }

      retryCount++;
    }

    if (documentsUpdateError) {
      console.log(
        "[RESYNC-FILE] All attempts to update existing documents failed",
        {
          error: documentsUpdateError,
        },
      );
      throw new Error(
        `Failed to update existing documents after ${maxRetries} attempts: ${
          documentsUpdateError.message || JSON.stringify(documentsUpdateError)
        }`,
      );
    }

    // Create new embeddings
    console.log("[RESYNC-FILE] Creating embeddings");
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      model: "text-embedding-3-small",
    });

    try {
      console.log("[RESYNC-FILE] Storing documents in vector store");
      await SupabaseVectorStore.fromDocuments(chunks, embeddings, {
        client: supabase,
        tableName: "documents",
      });
      console.log("[RESYNC-FILE] Documents stored in vector store");

      // Update the file_id column for the documents we just inserted
      console.log("[RESYNC-FILE] Updating file_id column");
      await supabase.from("documents")
        .update({ file_id: file_id })
        .eq("metadata->>file_id", file_id)
        .is("file_id", null);

      console.log("[RESYNC-FILE] Capturing PostHog event");
      client.capture({
        distinctId: apiKeyData.profiles?.email as string,
        event: "/resync_file API Call",
        properties: {
          file_name: file.file_name,
          file_type: file.type,
          file_id: file_id,
        },
      });

      console.log("[RESYNC-FILE] Logging API usage");
      logApiUsageAsync({
        endpoint: "/resync_file",
        userId: apiKeyData.user_id || "",
        success: true,
      });

      console.log("[RESYNC-FILE] Sending successful response");
      return res.json({
        success: true,
        message: `File resynced successfully`,
        file_name: file.file_name,
        file_id: file_id,
        chunks: chunks.length,
        chunk_size,
        chunk_overlap,
      });
    } catch (vectorError) {
      console.log("[RESYNC-FILE] Error processing vectors", {
        error: vectorError instanceof Error
          ? vectorError.message
          : "Unknown error",
      });
      throw new Error(
        vectorError instanceof Error
          ? vectorError.message
          : "Error processing vectors",
      );
    }
  } catch (error) {
    console.error("[RESYNC-FILE] Error resyncing file:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[RESYNC-FILE] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/resync_file",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[RESYNC-FILE] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    const customError = error as Error & { status?: number };
    const status = customError.status || 500;
    const message = customError.message || "Failed to resync file";

    console.log("[RESYNC-FILE] Sending error response", { status, message });
    return res.status(status).json({
      success: false,
      error: message,
    });
  }
};
