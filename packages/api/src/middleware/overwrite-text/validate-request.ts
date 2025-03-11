import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { supabase } from "../../utils/supabase";

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

const requestSchema = z.object({
  file_id: z.string().uuid(),
  contents: z.string().min(5, "Content must be at least 5 characters long"),
  name: z.string().min(1).optional().default("Untitled Document"),
  chunk_size: z.number().positive().default(DEFAULT_CHUNK_SIZE),
  chunk_overlap: z.number()
    .positive()
    .default(DEFAULT_CHUNK_OVERLAP),
}).refine(
  (data) => {
    return data.chunk_overlap < data.chunk_size;
  },
  {
    message: "chunk_overlap must be less than chunk_size",
    path: ["chunk_overlap"],
  },
);

export const validateRequestMiddleware = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validation = requestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          details: validation.error.errors,
        });
      }

      const { file_id, contents, name, chunk_size, chunk_overlap } =
        validation.data;
      const apiKey = req.headers.authorization as string;

      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from("api_keys")
        .select("team_id, user_id, profiles(email)")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyError || !apiKeyData?.team_id) {
        return res.status(401).json({
          success: false,
          message: "Invalid API key",
        });
      }

      // Verify file ownership
      const { data: file, error: filesError } = await supabase
        .from("files")
        .select("file_id, storage_path")
        .match({
          file_id,
          team_id: apiKeyData.team_id,
        })
        .is("deleted_at", null)
        .single();

      if (filesError || !file) {
        return res.status(404).json({
          success: false,
          message: "File not found or not owned by team",
        });
      }

      req.body.validatedData = {
        file_id,
        contents,
        name,
        chunk_size: chunk_size ?? DEFAULT_CHUNK_SIZE,
        chunk_overlap: chunk_overlap ?? DEFAULT_CHUNK_OVERLAP,
        teamId: apiKeyData.team_id,
        apiKeyData,
      };
      return next();
    } catch (error) {
      console.error("Error validating request:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to validate request",
      });
    }
  };
};
