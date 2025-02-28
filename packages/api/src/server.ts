import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

// Load .env.local in development mode
if (process.env.NODE_ENV === "development") {
  console.log("Loading .env.local");
  dotenv.config({ path: resolve(__dirname, "../.env.local"), override: true });
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimit } from "./middleware/rate-limit";
import { client as posthogClient } from "./utils/posthog";

const requiredEnvVars = [
  "OPENAI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(rateLimit());

app.use("/", router);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Closing HTTP server...");
  await posthogClient.shutdown();
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received. Closing HTTP server...");
  await posthogClient.shutdown();
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
