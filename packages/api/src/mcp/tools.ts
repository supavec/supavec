import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getEmbeddings } from "../controllers/embeddings";
import { userFiles } from "../controllers/user-files";
import { Request, Response } from "express";

// Schema for fetch-embeddings tool
const fetchEmbeddingsSchema = z.object({
  query: z.string().min(1, "Query is required"),
  k: z.number().int().positive().default(3),
  include_vectors: z.boolean().optional(),
  include_raw_file: z.boolean().optional(),
  file_ids: z.array(z.string().uuid()).min(
    1,
    "At least one file ID is required",
  ),
  api_key: z.string().min(1, "API key is required"),
});

// Schema for list-user-files tool
const listUserFilesSchema = z.object({
  pagination: z.object({
    limit: z.number().positive().default(10),
    offset: z.number().nonnegative().default(0),
  }).default({ limit: 10, offset: 0 }),
  order_dir: z.enum(["asc", "desc"]).default("desc"),
  api_key: z.string().min(1, "API key is required"),
});

// Tool definitions
export const fetchEmbeddingsTool: Tool = {
  name: "fetch-embeddings",
  description:
    "Fetch embeddings for a query against specified files using vector similarity search",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query to find similar content",
      },
      k: {
        type: "number",
        description: "Number of results to return (default: 3)",
        default: 3,
      },
      include_vectors: {
        type: "boolean",
        description: "Include vector embeddings in response",
        default: false,
      },
      include_raw_file: {
        type: "boolean",
        description: "Include raw file content in response",
        default: false,
      },
      file_ids: {
        type: "array",
        items: {
          type: "string",
          format: "uuid",
        },
        description: "Array of file IDs to search within",
      },
      api_key: {
        type: "string",
        description: "API key for authentication",
      },
    },
    required: ["query", "file_ids", "api_key"],
  },
};

export const listUserFilesTool: Tool = {
  name: "list-user-files",
  description: "List files uploaded by the user with pagination",
  inputSchema: {
    type: "object",
    properties: {
      pagination: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of files to return (default: 10)",
            default: 10,
          },
          offset: {
            type: "number",
            description: "Number of files to skip (default: 0)",
            default: 0,
          },
        },
        default: { limit: 10, offset: 0 },
      },
      order_dir: {
        type: "string",
        enum: ["asc", "desc"],
        description: "Sort direction for created_at field (default: desc)",
        default: "desc",
      },
      api_key: {
        type: "string",
        description: "API key for authentication",
      },
    },
    required: ["api_key"],
  },
};

// Tool execution handlers
export async function executeFetchEmbeddings(args: unknown) {
  const validation = fetchEmbeddingsSchema.safeParse(args);
  if (!validation.success) {
    throw new Error(`Invalid arguments: ${validation.error.message}`);
  }

  const { api_key, ...requestBody } = validation.data;

  // Create mock request/response objects
  const mockReq = {
    body: requestBody,
    headers: {
      authorization: api_key,
    },
  } as Request;

  let responseData: unknown = null;
  let statusCode = 200;

  const mockRes = {
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (data: unknown) => {
      responseData = data;
      return mockRes;
    },
  } as Response;

  try {
    await getEmbeddings(mockReq, mockRes);

    if (statusCode !== 200) {
      const errorMessage = (responseData as { error?: string })?.error ||
        "Request failed";
      throw new Error(errorMessage);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(responseData, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch embeddings",
    );
  }
}

export async function executeListUserFiles(args: unknown) {
  const validation = listUserFilesSchema.safeParse(args);
  if (!validation.success) {
    throw new Error(`Invalid arguments: ${validation.error.message}`);
  }

  const { api_key, ...requestBody } = validation.data;

  // Create mock request/response objects
  const mockReq = {
    body: requestBody,
    headers: {
      authorization: api_key,
    },
  } as Request;

  let responseData: unknown = null;
  let statusCode = 200;

  const mockRes = {
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (data: unknown) => {
      responseData = data;
      return mockRes;
    },
  } as Response;

  try {
    await userFiles(mockReq, mockRes);

    if (statusCode !== 200) {
      const errorMessage = (responseData as { error?: string })?.error ||
        "Request failed";
      throw new Error(errorMessage);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(responseData, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to list user files",
    );
  }
}
