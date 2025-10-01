// =====================================
// SETS TOOLS - Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetAllSets } from "./get-all-sets.js";
import { registerGetSetByCode } from "./get-set-by-code.js";
import { registerGetSetById } from "./get-set-by-id.js";
import { registerSearchSets } from "./search-sets.js";

export * from "./get-all-sets.js";
export * from "./get-set-by-code.js";
export * from "./get-set-by-id.js";
export * from "./search-sets.js";

/**
 * Register all sets tools
 */
export function registerSetsTools(server: McpServer) {
  registerGetAllSets(server);
  registerGetSetByCode(server);
  registerGetSetById(server);
  registerSearchSets(server);
}
