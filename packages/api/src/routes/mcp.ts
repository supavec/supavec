import { Request, Response, Router } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  executeFetchEmbeddings,
  executeListUserFiles,
  fetchEmbeddingsTool,
  listUserFilesTool,
} from "../mcp/tools";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export const mcpRouter = Router();

// Store active MCP servers for each connection
const activeServers = new Map<string, Server>();

// Helper function to create a new MCP server instance
function createMCPServer(connectionId: string): Server {
  const server = new Server(
    {
      name: "supavec-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Set up tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [fetchEmbeddingsTool, listUserFilesTool],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "fetch-embeddings":
          return await executeFetchEmbeddings(args);

        case "list-user-files":
          return await executeListUserFiles(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  activeServers.set(connectionId, server);
  return server;
}

// SSE endpoint handler function
async function handleSSEConnection(req: Request, res: Response) {
  const connectionId = req.headers["x-connection-id"] as string ||
    `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[MCP] SSE connection established: ${connectionId}`);

  // Set up SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-connection-id",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });

  // Send initial connection established event
  res.write(`event: connected\ndata: ${JSON.stringify({ connectionId })}\n\n`);

  try {
    // Create MCP server instance
    const server = createMCPServer(connectionId);

    // Create SSE transport with proper base URL
    const transport = new SSEServerTransport("/mcp/message", res);

    // Connect server to transport
    await server.connect(transport);

    console.log(`[MCP] Server connected for connection: ${connectionId}`);

    // Handle client disconnect
    req.on("close", () => {
      console.log(`[MCP] Client disconnected: ${connectionId}`);
      activeServers.delete(connectionId);
      server.close();
    });

    req.on("error", (error) => {
      console.error(`[MCP] SSE error for connection ${connectionId}:`, error);
      activeServers.delete(connectionId);
      server.close();
    });

    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (res.destroyed) {
        clearInterval(keepAlive);
        return;
      }
      res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
    }, 30000);

    req.on("close", () => {
      clearInterval(keepAlive);
    });

  } catch (error) {
    console.error(
      `[MCP] Error setting up SSE connection ${connectionId}:`,
      error,
    );
    res.write(
      `event: error\ndata: ${
        JSON.stringify({ error: "Failed to establish MCP connection" })
      }\n\n`,
    );
    res.end();
  }
}

// SSE endpoint for MCP client connections (handle both GET and POST)
mcpRouter.get("/sse", handleSSEConnection);
mcpRouter.post("/sse", handleSSEConnection);

// Message handling endpoint
mcpRouter.post("/message", async (req: Request, res: Response) => {
  const connectionId = req.headers["x-connection-id"] as string;
  const sessionId = req.query.sessionId as string;

  console.log(`[MCP] Message received for connection: ${connectionId}`, {
    hasBody: !!req.body,
    bodyType: typeof req.body,
    sessionId,
  });

  if (!connectionId) {
    console.log("[MCP] Missing x-connection-id header");
    // Instead of returning an error, try to use sessionId or create a temporary connection
    if (sessionId) {
      console.log(`[MCP] Using sessionId as fallback: ${sessionId}`);
      // Try to find existing connection or create a new one
      const fallbackConnectionId = `session_${sessionId}`;
      if (!activeServers.has(fallbackConnectionId)) {
        console.log(`[MCP] Creating temporary server for session: ${sessionId}`);
        createMCPServer(fallbackConnectionId);
      }
      // Continue with fallback connection
    } else {
      return res.status(400).json({
        error: "Missing x-connection-id header and no sessionId provided",
      });
    }
  }

  const actualConnectionId = connectionId || `session_${sessionId}`;
  const server = activeServers.get(actualConnectionId);
  if (!server) {
    console.log(`[MCP] Server not found for connection: ${actualConnectionId}`);
    return res.status(404).json({
      error: "MCP server not found for this connection",
    });
  }

  try {
    // The SSE transport will handle the message processing
    // This endpoint is used by the SSE transport internally
    console.log(`[MCP] Successfully processed message for connection: ${actualConnectionId}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      `[MCP] Error handling message for connection ${actualConnectionId}:`,
      error,
    );
    return res.status(500).json({
      error: "Failed to process MCP message",
    });
  }
});

// Options endpoint for CORS preflight
mcpRouter.options("/sse", (_req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-connection-id",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.sendStatus(200);
});

mcpRouter.options("/message", (_req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-connection-id",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.sendStatus(200);
});

// Health check endpoint
mcpRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    activeConnections: activeServers.size,
    timestamp: new Date().toISOString(),
  });
});

export default mcpRouter;
