import multer from "multer";
import { Request } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "text/plain" ||
      file.mimetype === "text/markdown" ||
      file.originalname.endsWith(".md")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, text, and markdown files are allowed"));
    }
  },
});
