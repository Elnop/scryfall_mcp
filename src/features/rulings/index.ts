// =====================================
// RULINGS FEATURE - Main Export
// =====================================

export * from "./_core/rulings.service.js";
export * from "./_schemas/rulings.schema.js";
export * from "./tools/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRulingsTools } from "./tools/index.js";

/**
 * Register all rulings features
 */
export function registerRulingsFeature(server: McpServer) {
  registerRulingsTools(server);
}
