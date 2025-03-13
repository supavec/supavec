import { Request, Response } from "express";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { z } from "zod";
import { randomUUID } from "crypto";
import { updateLoopsContact } from "../utils/loops";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";
import { storeDocumentsWithFileId } from "../utils/vector-store";

console.log("[UPLOAD-TEXT] Module loaded");

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

const uploadTextSchema = z.object({
  contents: z.string().min(5, "Content must be at least 5 characters long"),
  name: z.string().min(1).optional().default("Untitled Document"),
  chunk_size: z.coerce.number().positive().nullish(),
  chunk_overlap: z.coerce.number().positive().nullish(),
});

export const uploadText = async (req: Request, res: Response) => {
  console.log("[UPLOAD-TEXT] Request received");
  try {
    // Validate body parameters
    console.log("[UPLOAD-TEXT] Validating request body");
    const bodyValidation = uploadTextSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      console.log(
        "[UPLOAD-TEXT] Validation failed",
        bodyValidation.error.issues,
      );
      return res.status(400).json({
        success: false,
        error: bodyValidation.error.issues,
      });
    }

    const apiKey = req.headers.authorization as string;
    // Get team ID from API key
    console.log("[UPLOAD-TEXT] Verifying API key");
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("team_id, user_id, profiles(email)")
      .match({ api_key: apiKey })
      .single();

    if (apiKeyError || !apiKeyData?.team_id) {
      console.log("[UPLOAD-TEXT] Invalid API key", { error: apiKeyError });
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
      });
    }

    const teamId = apiKeyData.team_id as string;
    console.log("[UPLOAD-TEXT] Team ID retrieved", { teamId });

    const {
      contents,
      name,
      chunk_size = DEFAULT_CHUNK_SIZE,
      chunk_overlap = DEFAULT_CHUNK_OVERLAP,
    } = bodyValidation.data;
    console.log("[UPLOAD-TEXT] Processing text upload", {
      name,
      contentLength: contents.length,
      chunk_size,
      chunk_overlap,
    });

    const fileId = randomUUID();
    const fileName = `${fileId}.txt`;
    console.log("[UPLOAD-TEXT] Generated file ID", { fileId, fileName });

    // Upload text content to Supabase Storage
    console.log("[UPLOAD-TEXT] Uploading to Supabase Storage");
    const { data: storageData, error: uploadError } = await supabase.storage
      .from("user-documents")
      .upload(`/${teamId}/${fileName}`, contents, {
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

    console.log("[UPLOAD-TEXT] Creating text splitter");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunk_size ?? DEFAULT_CHUNK_SIZE,
      chunkOverlap: chunk_overlap ?? DEFAULT_CHUNK_OVERLAP,
    });

    console.log("[UPLOAD-TEXT] Splitting text into chunks");
    const docs = await splitter.createDocuments([contents], [{
      source: name,
      file_id: fileId,
    }]);
    console.log("[UPLOAD-TEXT] Text split into chunks", {
      chunkCount: docs.length,
    });

    console.log("[UPLOAD-TEXT] Creating embeddings");
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      model: "text-embedding-3-small",
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
        file_size: contents.length,
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
