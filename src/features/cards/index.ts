// =====================================
// CARDS FEATURE - Main Export
// =====================================

export * from "./_core/cards.service.js";
export * from "./_schemas/cards.schema.js";
export * from "./tools/index.js";
export * from "./tools-raw/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCardsTools } from "./tools/index.js";
import { registerCardsRawTools } from "./tools-raw/index.js";

/**
 * Register all cards features (formatted + raw tools)
 */
export function registerCardsFeature(server: McpServer) {
  registerCardsTools(server);
  registerCardsRawTools(server);
}
