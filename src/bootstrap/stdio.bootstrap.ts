// =====================================
// STDIO BOOTSTRAP
// Initialize MCP server with stdio transport
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tool-registry.js";

export async function bootstrapStdioServer() {
  const server = new McpServer({
    name: "scryfall-mcp-server",
    version: "2.0.0"
  });

  // Register all tools
  await registerAllTools(server);

  // TODO: Register resources
  // await registerAllResources(server);

  // Connect stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  return server;
}
