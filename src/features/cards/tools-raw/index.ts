// =====================================
// CARDS RAW TOOLS - Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchCardsRaw } from "./search-cards-raw.js";
import { registerGetCardNamedRaw } from "./get-card-named-raw.js";
import { registerGetRandomCardRaw } from "./get-random-card-raw.js";
import { registerAutocompleteCardsRaw } from "./autocomplete-cards-raw.js";

export * from "./search-cards-raw.js";
export * from "./get-card-named-raw.js";
export * from "./get-random-card-raw.js";
export * from "./autocomplete-cards-raw.js";

/**
 * Register all raw cards tools
 */
export function registerCardsRawTools(server: McpServer) {
  registerSearchCardsRaw(server);
  registerGetCardNamedRaw(server);
  registerGetRandomCardRaw(server);
  registerAutocompleteCardsRaw(server);
}
