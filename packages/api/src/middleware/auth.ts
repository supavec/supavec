import type { NextFunction, Request, Response } from "express";
import { supabase } from "../utils/supabase";

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
}

export const apiKeyAuth = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Missing API key in authorization header",
      });
    }

    const { data, error } = await supabase.from("api_keys").select("id")
      .match({
        api_key: authHeader,
      })
      .single();

    if (error || !data) {
      return res.status(401).json({
        status: "error",
        message: "Invalid API key",
      });
    }

    req.apiKey = authHeader;
    return next();
  };
};
