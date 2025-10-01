// =====================================
// GENERIC TOOLS - Registry
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetSystemMetrics } from "./system-metrics.js";

/**
 * Register all generic tools (1 tool)
 */
export function registerGenericTools(server: McpServer) {
  registerGetSystemMetrics(server);
}
