import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { supabase } from "../../utils/supabase";

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

const uploadTextSchema = z.object({
  // OPTION A – raw text
  contents: z.string().min(5, "Content must be at least 5 characters long")
    .optional(),

  // OPTION B – caller‑provided, already‑chunked segments
  segments: z.array(
    z.object({
      content: z.string().min(1),
      metadata: z.record(z.any()).optional(),
    }),
  ).optional(),

  name: z.string().min(1).optional().default("Untitled Document"),

  // legacy split knobs (only used when `contents` is present)
  chunk_size: z.number().positive().default(DEFAULT_CHUNK_SIZE),
  chunk_overlap: z.number().positive().default(DEFAULT_CHUNK_OVERLAP),
})
  // require ONE of contents or segments
  .refine(
    (d) => Boolean(d.contents) !== Boolean(d.segments),
    {
      message:
        "Must provide either `contents` (raw text) or `segments` (pre-chunked), but not both.",
    },
  )
  // overlap rule only matters when splitting raw contents
  .refine(
    (d) => !d.contents || d.chunk_overlap < d.chunk_size,
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
      // Validate body parameters
      const bodyValidation = uploadTextSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          details: bodyValidation.error.issues,
        });
      }

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

      const {
        contents,
        segments,
        name,
        chunk_size = DEFAULT_CHUNK_SIZE,
        chunk_overlap = DEFAULT_CHUNK_OVERLAP,
      } = bodyValidation.data;

      // Add validated data to request body for controller to use
      req.body.validatedData = {
        contents,
        segments,
        name,
        chunk_size,
        chunk_overlap,
        teamId: apiKeyData.team_id,
        apiKeyData,
      };

      return next();
    } catch (error) {
      console.error("Error validating upload text request:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to validate request",
      });
    }
  };
};
