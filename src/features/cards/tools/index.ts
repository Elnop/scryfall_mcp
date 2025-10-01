// =====================================
// CARDS TOOLS - Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchCards } from "./search-cards.js";
import { registerGetCardNamed } from "./get-card-named.js";
import { registerGetRandomCard } from "./get-random-card.js";
import { registerAutocompleteCards } from "./autocomplete-cards.js";

export * from "./search-cards.js";
export * from "./get-card-named.js";
export * from "./get-random-card.js";
export * from "./autocomplete-cards.js";

/**
 * Register all formatted cards tools
 */
export function registerCardsTools(server: McpServer) {
  registerSearchCards(server);
  registerGetCardNamed(server);
  registerGetRandomCard(server);
  registerAutocompleteCards(server);
}
