// =====================================
// SETS FEATURE - Main Export
// =====================================

export * from "./_core/sets.service.js";
export * from "./_schemas/sets.schema.js";
export * from "./tools/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSetsTools } from "./tools/index.js";

/**
 * Register all sets features
 */
export function registerSetsFeature(server: McpServer) {
  registerSetsTools(server);
}
