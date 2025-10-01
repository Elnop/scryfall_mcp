// =====================================
// CATALOGS TOOLS - Main Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTypesTools } from "./types/index.js";
import { registerMechanicsTools } from "./mechanics/index.js";
import { registerMetadataTools } from "./metadata/index.js";
import { registerStatsTools } from "./stats/index.js";

export * from "./types/index.js";
export * from "./mechanics/index.js";
export * from "./metadata/index.js";
export * from "./stats/index.js";

/**
 * Register all catalogs tools (16 tools total)
 */
export function registerCatalogsTools(server: McpServer) {
  registerTypesTools(server);      // 7 tools
  registerMechanicsTools(server);  // 3 tools
  registerMetadataTools(server);   // 3 tools
  registerStatsTools(server);      // 3 tools
}
