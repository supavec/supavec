import { Response } from "express";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { randomUUID } from "crypto";
import { updateLoopsContact } from "../utils/loops";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { storeDocumentsWithFileId } from "../utils/vector-store";
import { type Document } from "@langchain/core/documents";
import { AuthenticatedRequest } from "../middleware/auth";

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

type ValidatedUploadTextRequest = AuthenticatedRequest & {
  body: {
    validatedData: {
      contents?: string;
      segments?: Array<{
        content: string;
        metadata?: Record<string, unknown>;
      }>;
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

export const uploadText = async (
  req: ValidatedUploadTextRequest,
  res: Response,
) => {
  console.log("[UPLOAD-TEXT] Request received");
  try {
    const {
      contents,
      segments,
      name,
      chunk_size,
      chunk_overlap,
      teamId,
      apiKeyData,
    } = req.body.validatedData;
    console.log("[UPLOAD-TEXT] Processing text upload", {
      name,
      payloadLength: contents?.length || JSON.stringify(segments).length,
      chunk_size,
      chunk_overlap,
    });

    const fileId = randomUUID();
    const fileName = segments && segments.length
      ? `${fileId}.json`
      : `${fileId}.txt`;
    console.log("[UPLOAD-TEXT] Generated file ID", { fileId, fileName });

    // Decide how we will build the document array
    let docs: Document[]; // will hold the documents to embed
    let storagePayload: string; // the string we upload to Supabase Storage

    if (segments?.length) {
      console.log("[UPLOAD-TEXT] Using caller provided segments");
      docs = segments.map((
        seg: { content: string; metadata?: Record<string, unknown> },
      ) => ({
        pageContent: seg.content,
        metadata: {
          ...(seg.metadata ?? {}),
          source: name,
          file_id: fileId,
        },
      }));
      storagePayload = segments.map((seg: { content: string }) => seg.content)
        .join("\n\n");
    } else {
      console.log(
        "[UPLOAD-TEXT] Splitting raw contents with RecursiveCharacterTextSplitter",
      );
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunk_size ?? DEFAULT_CHUNK_SIZE,
        chunkOverlap: chunk_overlap ?? DEFAULT_CHUNK_OVERLAP,
      });
      docs = await splitter.createDocuments([contents!], [
        { source: name, file_id: fileId },
      ]);
      storagePayload = contents!;
    }
    console.log("[UPLOAD-TEXT] Documents prepared", {
      chunkCount: docs.length,
    });

    // Upload text content to Supabase Storage
    console.log("[UPLOAD-TEXT] Uploading to Supabase Storage");
    const { data: storageData, error: uploadError } = await supabase.storage
      .from("user-documents")
      .upload(`/${teamId}/${fileName}`, storagePayload, {
        contentType: "text/plain",
        upsert: false,
      });

    if (uploadError) {
      console.log("[UPLOAD-TEXT] Storage upload failed", {
        error: uploadError,
      });
      return res.status(500).json({
        success: false,
        error: "Failed to upload file to storage",
      });
    }
    console.log("[UPLOAD-TEXT] Storage upload successful", {
      path: storageData.path,
    });

    console.log("[UPLOAD-TEXT] Storing documents in vector store");
    const { success, insertedCount } = await storeDocumentsWithFileId(
      docs,
      fileId,
      supabase,
    );

    if (!success) {
      throw new Error("Failed to store documents in vector store");
    }

    console.log(
      `[UPLOAD-TEXT] Documents stored successfully. Total inserted: ${insertedCount}`,
    );

    console.log("[UPLOAD-TEXT] Inserting file record");
    await supabase.from("files").insert({
      file_id: fileId,
      type: "text",
      file_name: `${name}.txt`,
      team_id: teamId,
      storage_path: storageData.path,
    });
    console.log("[UPLOAD-TEXT] File record inserted");

    // Update Loops contact
    if (apiKeyData.profiles?.email) {
      try {
        console.log("[UPLOAD-TEXT] Updating Loops contact");
        updateLoopsContact({
          email: apiKeyData.profiles.email,
          isFileUploaded: true,
        });
        console.log("[UPLOAD-TEXT] Loops contact updated");
      } catch (error) {
        console.error("[UPLOAD-TEXT] Error updating Loops contact:", error);
      }
    }

    console.log("[UPLOAD-TEXT] Capturing PostHog event");
    client.capture({
      distinctId: apiKeyData.profiles?.email as string,
      event: "text_upload_completed",
      properties: {
        file_name: fileName,
        file_type: "text",
        file_size: contents?.length ||
          segments?.reduce(
            (sum: number, seg: { content: string }) => sum + seg.content.length,
            0,
          ) ||
          0,
        segment_count: segments?.length ?? docs.length,
        processing_mode: segments ? "segments" : "chunks",
      },
    });

    console.log("[UPLOAD-TEXT] Logging API usage");
    logApiUsageAsync({
      endpoint: "/upload_text",
      userId: apiKeyData.user_id || "",
      success: true,
    });

    console.log("[UPLOAD-TEXT] Sending successful response");
    return res.status(200).json({
      success: true,
      message: "Text uploaded and processed successfully",
      file_id: fileId,
    });
  } catch (error) {
    console.error("[UPLOAD-TEXT] Error processing text upload:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[UPLOAD-TEXT] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/upload_text",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[UPLOAD-TEXT] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    console.log("[UPLOAD-TEXT] Sending error response");
    return res.status(500).json({
      success: false,
      error: "Failed to process text upload",
    });
  }
};
