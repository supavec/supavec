import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { 
  fetchEmbeddingsTool,
  listUserFilesTool,
  executeFetchEmbeddings,
  executeListUserFiles,
} from "./tools.js";

export class SupavecMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "supavec-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [fetchEmbeddingsTool, listUserFilesTool],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
  }

  public async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("Supavec MCP server started on stdio");
  }

  public getServer() {
    return this.server;
  }
}

// Export for standalone usage
if (require.main === module) {
  const server = new SupavecMCPServer();
  server.start().catch(console.error);
}