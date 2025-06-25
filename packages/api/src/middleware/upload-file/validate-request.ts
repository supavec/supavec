import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { supabase } from "../../utils/supabase";

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

const uploadQuerySchema = z.object({
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
      // Validate query parameters
      const queryValidation = uploadQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          details: queryValidation.error.errors,
        });
      }

      const { chunk_size, chunk_overlap } = queryValidation.data;
      const apiKey = req.headers.authorization as string;

      // Validate API key and get team data
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

      // Validate file presence
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file provided",
        });
      }

      // Add validated data to request body for controller to use
      req.body.validatedData = {
        chunk_size: chunk_size ?? DEFAULT_CHUNK_SIZE,
        chunk_overlap: chunk_overlap ?? DEFAULT_CHUNK_OVERLAP,
        teamId: apiKeyData.team_id,
        apiKeyData,
        file: req.file,
      };

      return next();
    } catch (error) {
      console.error("Error validating upload request:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to validate request",
      });
    }
  };
};
