// =====================================
// TOOL REGISTRY
// Central registration of all MCP tools
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCardsFeature } from "../features/cards/index.js";
import { registerSetsFeature } from "../features/sets/index.js";
import { registerRulingsFeature } from "../features/rulings/index.js";
import { registerCatalogsFeature } from "../features/catalogs/index.js";
import { registerGenericFeature } from "../features/generic/index.js";

/**
 * Register all tools from all features
 */
export async function registerAllTools(server: McpServer) {
  // Register cards feature (8 tools: 4 formatted + 4 raw)
  registerCardsFeature(server);

  // Register sets feature (4 tools)
  registerSetsFeature(server);

  // Register rulings feature (3 tools)
  registerRulingsFeature(server);

  // Register catalogs feature (16 tools)
  registerCatalogsFeature(server);

  // Register generic feature (1 tool: system metrics)
  registerGenericFeature(server);
}
