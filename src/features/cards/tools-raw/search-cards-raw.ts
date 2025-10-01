// =====================================
// TOOL: search-cards-raw
// Search cards and return raw JSON from Scryfall API
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { SearchCardsSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerSearchCardsRaw(server: McpServer) {
  server.registerTool(
    "search-cards-raw",
    {
      title: "Search Cards (Raw JSON)",
      description: "Search Magic: The Gathering cards and return raw JSON response from Scryfall API",
      inputSchema: SearchCardsSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ query, limit, order, dir, unique, include_extras }) => {
      try {
        const result = await service.searchCardsRaw({
          query,
          limit,
          order,
          dir,
          unique,
          include_extras
        });

        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "search-cards-raw");
      }
    }
  );
}
