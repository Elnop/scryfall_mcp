// =====================================
// TOOL: autocomplete-cards-raw
// Get autocomplete suggestions and return raw JSON
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { AutocompleteCardsSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerAutocompleteCardsRaw(server: McpServer) {
  server.registerTool(
    "autocomplete-cards-raw",
    {
      title: "Autocomplete Cards (Raw JSON)",
      description: "Get card name suggestions and return raw JSON response from Scryfall API",
      inputSchema: AutocompleteCardsSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ query, include_extras }) => {
      try {
        const result = await service.autocompleteCardsRaw({
          query,
          include_extras
        });

        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "autocomplete-cards-raw");
      }
    }
  );
}
