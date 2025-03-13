import { Request, Response } from "express";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";

console.log("[DELETE-FILE] Module loaded");

type ValidatedRequest = Request & {
  body: {
    validatedData: {
      file_id: string;
      teamId: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiKeyData: any;
    };
  };
};

async function getFileData(fileId: string, teamId: string) {
  console.log("[DELETE-FILE] Fetching file data", { fileId, teamId });
  const { data: file, error: filesError } = await supabase
    .from("files")
    .select("file_id, storage_path")
    .match({ file_id: fileId, team_id: teamId })
    .is("deleted_at", null)
    .single();

  if (filesError) {
    console.log("[DELETE-FILE] Error fetching file data", {
      error: filesError,
    });
    throw new Error(`Failed to fetch file: ${filesError.message}`);
  }

  if (!file) {
    console.log("[DELETE-FILE] No file found");
    throw {
      status: 404,
      message: "No file found with the provided ID for this team",
    };
  }

  console.log("[DELETE-FILE] File data retrieved", { fileId: file.file_id });
  return file;
}

export const deleteFile = async (req: ValidatedRequest, res: Response) => {
  console.log("[DELETE-FILE] Request received");
  try {
    const { file_id, teamId, apiKeyData } = req.body.validatedData;
    console.log("[DELETE-FILE] Processing request with validated data", {
      file_id,
      teamId,
    });

    const file = await getFileData(file_id, teamId);

    // Delete file from storage if storage path exists
    let storageError: string | undefined;
    if (file.storage_path) {
      console.log("[DELETE-FILE] Deleting file from storage", {
        path: file.storage_path,
      });
      const { error: deleteError } = await supabase.storage
        .from("user-documents")
        .remove([file.storage_path]);

      if (deleteError) {
        console.log("[DELETE-FILE] Error deleting from storage", {
          error: deleteError,
        });
        storageError =
          `Failed to delete ${file.storage_path}: ${deleteError.message}`;
      } else {
        console.log("[DELETE-FILE] File deleted from storage");
      }
    }

    // Soft delete records in files and documents tables
    const now = new Date().toISOString();

    // Update files table with deleted_at
    console.log("[DELETE-FILE] Soft deleting file record");
    const { error: filesUpdateError } = await supabase
      .from("files")
      .update({ deleted_at: now })
      .match({ file_id });

    if (filesUpdateError) {
      console.log("[DELETE-FILE] Error updating file record", {
        error: filesUpdateError,
      });
      throw new Error(`Failed to update file: ${filesUpdateError.message}`);
    }
    console.log("[DELETE-FILE] File record marked as deleted");

    // Soft delete documents
    console.log("[DELETE-FILE] Soft deleting documents");
    const { error: documentsError } = await supabase
      .from("documents")
      .update({ deleted_at: now })
      .match({ file_id });

    if (documentsError) {
      console.log("[DELETE-FILE] Error soft deleting documents", {
        error: documentsError,
      });
      throw new Error(
        `Failed to soft delete documents: ${documentsError.message}`,
      );
    }
    console.log("[DELETE-FILE] Documents soft deleted");

    console.log("[DELETE-FILE] Capturing PostHog event");
    client.capture({
      distinctId: apiKeyData.profiles?.email as string,
      event: "/delete_file API Call",
    });

    console.log("[DELETE-FILE] Logging API usage");
    logApiUsageAsync({
      endpoint: "/delete_file",
      userId: apiKeyData.user_id || "",
      success: true,
    });

    console.log("[DELETE-FILE] Sending successful response");
    return res.json({
      success: true,
      message: "File marked as deleted successfully",
      deleted_file_id: file_id,
      storage_error: storageError,
    });
  } catch (error: unknown) {
    console.error("[DELETE-FILE] Error deleting file:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[DELETE-FILE] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/delete_file",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[DELETE-FILE] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    const customError = error as Error;
    const message = customError.message || "Failed to delete file";
    console.log("[DELETE-FILE] Sending error response", { message });
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
};
