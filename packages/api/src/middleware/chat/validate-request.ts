import { z } from "zod";
import type { NextFunction, Response } from "express";
import { supabase } from "../../utils/supabase";
import type { AuthenticatedRequest } from "../auth";

const requestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  k: z.number().int().positive().default(3),
  file_ids: z.array(z.string().uuid()).min(
    1,
    "At least one file ID is required",
  ),
  stream: z.boolean().default(false),
});

export type ValidatedChatRequest = {
  query: string;
  k: number;
  file_ids: string[];
  stream: boolean;
  teamId: string;
  apiKeyData: {
    team_id: string;
    user_id: string;
    profiles: {
      email: string;
    };
  };
};

export const validateRequestMiddleware = () => {
  return async (
    req: AuthenticatedRequest,
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

      const { query, k, file_ids, stream } = validation.data;
      const apiKey = req.headers.authorization;
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message: "API key is required",
        });
      }

      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from("api_keys")
        .select("team_id, user_id, profiles(email)")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyError || !apiKeyData?.team_id || !apiKeyData?.user_id) {
        return res.status(401).json({
          success: false,
          message: "Invalid API key",
        });
      }

      // Verify file ownership
      const { data: files, error: filesError } = await supabase
        .from("files")
        .select("file_id")
        .in("file_id", file_ids)
        .match({ team_id: apiKeyData.team_id });

      if (filesError) {
        console.error("Error verifying file ownership:", filesError);
        return res.status(500).json({
          success: false,
          message: "Failed to verify file ownership",
        });
      }

      if (!files || files.length !== file_ids.length) {
        return res.status(403).json({
          success: false,
          message: "One or more files do not belong to your team",
        });
      }

      req.userId = apiKeyData.user_id;
      req.body.validatedData = {
        query,
        k,
        file_ids,
        teamId: apiKeyData.team_id,
        apiKeyData,
        stream,
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
