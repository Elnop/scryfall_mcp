// =====================================
// RULINGS TOOLS - Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetCardRulingsByName } from "./get-by-name.js";
import { registerGetCardRulingsById } from "./get-by-id.js";
import { registerGetCardRulingsByCollector } from "./get-by-collector.js";

export * from "./get-by-name.js";
export * from "./get-by-id.js";
export * from "./get-by-collector.js";

/**
 * Register all rulings tools
 */
export function registerRulingsTools(server: McpServer) {
  registerGetCardRulingsByName(server);
  registerGetCardRulingsById(server);
  registerGetCardRulingsByCollector(server);
}
