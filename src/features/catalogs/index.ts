// =====================================
// CATALOGS FEATURE - Main Export
// =====================================

export * from "./_core/catalogs.service.js";
export * from "./_schemas/catalogs.schema.js";
export * from "./tools/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCatalogsTools } from "./tools/index.js";

/**
 * Register all catalogs features (16 tools)
 */
export function registerCatalogsFeature(server: McpServer) {
  registerCatalogsTools(server);
}
