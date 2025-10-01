// =====================================
// GENERIC FEATURE - Main Export
// =====================================

export * from "./_core/generic.service.js";
export * from "./_schemas/generic.schema.js";
export * from "./tools/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenericTools } from "./tools/index.js";

/**
 * Register all generic features (1 tool)
 */
export function registerGenericFeature(server: McpServer) {
  registerGenericTools(server);
}
