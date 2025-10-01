// =====================================
// TOOL: autocomplete-cards
// Get autocomplete suggestions for card names
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { AutocompleteCardsSchema, AutocompleteCardsOutputSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerAutocompleteCards(server: McpServer) {
  server.registerTool(
    "autocomplete-cards",
    {
      title: "Autocomplétion de cartes",
      description: "Suggestions de noms de cartes pour l'autocomplétion",
      inputSchema: AutocompleteCardsSchema.shape,
      outputSchema: AutocompleteCardsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ query, include_extras }) => {
      try {
        const result = await service.autocompleteCards({
          query,
          include_extras
        });

        const structuredData = {
          total_values: result.suggestions?.length || 0,
          data: result.suggestions || [],
          query: query,
          has_more: false
        };

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: structuredData
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "autocomplete-cards");
      }
    }
  );
}
