import { Response } from "express";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { unlink, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { updateLoopsContact } from "../utils/loops";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { storeDocumentsWithFileId } from "../utils/vector-store";
import { AuthenticatedRequest } from "../middleware/auth";

type ValidatedUploadRequest = AuthenticatedRequest & {
  body: {
    validatedData: {
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
      file: Express.Multer.File;
    };
  };
};

export const uploadFile = async (
  req: ValidatedUploadRequest,
  res: Response,
) => {
  console.log("[UPLOAD-FILE] Request received");
  try {
    const {
      chunk_size,
      chunk_overlap,
      teamId,
      apiKeyData,
      file,
    } = req.body.validatedData;

    console.log("[UPLOAD-FILE] Using validated data", {
      teamId,
      chunk_size,
      chunk_overlap,
    });

    const buffer = file.buffer;
    const fileId = randomUUID();
    const isTextFile = file.mimetype === "text/plain";
    const isMarkdownFile = file.mimetype === "text/markdown" ||
      file.originalname.endsWith(".md");
    const fileExtension = isTextFile ? "txt" : isMarkdownFile ? "md" : "pdf";
    const fileName = file.originalname;
    const tempFileName = `${fileId}.${fileExtension}`;
    const tempFilePath = join(tmpdir(), tempFileName);
    console.log("[UPLOAD-FILE] File details", {
      fileId,
      fileName,
      fileType: isTextFile ? "text" : isMarkdownFile ? "markdown" : "pdf",
      fileSize: buffer.length,
    });

    console.log("[UPLOAD-FILE] Writing file to temp location", {
      tempFilePath,
    });
    await writeFile(tempFilePath, buffer);

    // Upload file to Supabase Storage with team ID in path
    console.log("[UPLOAD-FILE] Uploading to Supabase Storage");
    const { data: storageData, error: storageError } = await supabase.storage
      .from("user-documents")
      .upload(`/${teamId}/${tempFileName}`, buffer, {
        contentType: isTextFile
          ? "text/plain"
          : isMarkdownFile
          ? "text/markdown"
          : "application/pdf",
        upsert: false,
      });

    if (storageError) {
      console.log("[UPLOAD-FILE] Storage upload failed", {
        error: storageError,
      });
      throw new Error(
        `Failed to upload file to storage: ${storageError.message}`,
      );
    }
    console.log("[UPLOAD-FILE] Storage upload successful", {
      path: storageData.path,
    });

    console.log("[UPLOAD-FILE] Processing file content");
    let documents: Document[];
    if (isTextFile || isMarkdownFile) {
      // For text and markdown files, create a single document from the content
      console.log(
        `[UPLOAD-FILE] Processing ${isTextFile ? "text" : "markdown"} file`,
      );
      const textContent = buffer.toString("utf-8");
      documents = [
        new Document({
          pageContent: textContent,
          metadata: { source: tempFileName },
        }),
      ];
    } else {
      // For PDFs, use the PDFLoader
      console.log("[UPLOAD-FILE] Processing PDF file with PDFLoader");
      const loader = new PDFLoader(tempFilePath);
      documents = await loader.load();
      console.log("[UPLOAD-FILE] PDF loaded", { pageCount: documents.length });
    }

    // Clean up temp file
    console.log("[UPLOAD-FILE] Cleaning up temp file");
    await unlink(tempFilePath);

    // Split text into chunks
    console.log("[UPLOAD-FILE] Splitting content into chunks");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunk_size,
      chunkOverlap: chunk_overlap,
    });
    const chunks = await splitter.splitDocuments(documents);
    console.log("[UPLOAD-FILE] Content split into chunks", {
      chunkCount: chunks.length,
    });

    // Add file_id metadata to each chunk
    console.log("[UPLOAD-FILE] Adding metadata to chunks");
    chunks.forEach((chunk) => {
      chunk.metadata.file_id = fileId;
      chunk.metadata.team_id = teamId;
    });

    try {
      console.log("[UPLOAD-FILE] Storing documents in vector store");
      const { success, insertedCount } = await storeDocumentsWithFileId(
        chunks,
        fileId,
        supabase,
      );

      if (!success) {
        throw new Error("Failed to store documents in vector store");
      }

      console.log(
        `[UPLOAD-FILE] Documents stored successfully. Total inserted: ${insertedCount}`,
      );

      console.log("[UPLOAD-FILE] Inserting file record");
      await supabase.from("files").insert({
        file_id: fileId,
        type: `${isTextFile ? "text" : isMarkdownFile ? "markdown" : "pdf"}`,
        file_name: fileName,
        team_id: teamId,
        storage_path: storageData.path,
      });
      console.log("[UPLOAD-FILE] File record inserted");

      // Update Loops contact
      if (apiKeyData.profiles?.email) {
        try {
          console.log("[UPLOAD-FILE] Updating Loops contact");
          updateLoopsContact({
            email: apiKeyData.profiles.email,
            isFileUploaded: true,
          });
          console.log("[UPLOAD-FILE] Loops contact updated");
        } catch (error) {
          console.error("[UPLOAD-FILE] Error updating Loops contact:", error);
        }
      }

      console.log("[UPLOAD-FILE] Capturing PostHog event");
      client.capture({
        distinctId: apiKeyData.profiles?.email as string,
        event: "file_upload_completed",
        properties: {
          file_name: fileName,
          file_type: isTextFile ? "text" : isMarkdownFile ? "markdown" : "pdf",
          file_size: buffer.length,
        },
      });

      console.log("[UPLOAD-FILE] Logging API usage");
      logApiUsageAsync({
        endpoint: "/upload_file",
        userId: apiKeyData.user_id || "",
        success: true,
      });

      console.log("[UPLOAD-FILE] Sending successful response");
      return res.json({
        success: true,
        message: `${
          isTextFile ? "Text" : isMarkdownFile ? "Markdown" : "PDF"
        } file processed successfully`,
        file_name: fileName,
        file_id: fileId,
        chunks: chunks.length,
        chunk_size: chunk_size,
        chunk_overlap: chunk_overlap,
      });
    } catch (vectorError) {
      console.log("[UPLOAD-FILE] Error processing vectors", {
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
    console.error("[UPLOAD-FILE] Error processing file:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[UPLOAD-FILE] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/upload_file",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[UPLOAD-FILE] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    console.log("[UPLOAD-FILE] Sending error response");
    return res.status(500).json({
      success: false,
      error: `Failed to process file${
        error instanceof Error ? `: ${error.message}` : ""
      }`,
    });
  }
};
