// =====================================
// TOOL: search-cards
// Advanced search for MTG cards using Scryfall syntax
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { SearchCardsSchema, SearchCardsOutputSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerSearchCards(server: McpServer) {
  server.registerTool(
    "search-cards",
    {
      title: "Search Magic: The Gathering Cards",
      description: "Advanced search for Magic: The Gathering cards using Scryfall syntax with strict validation",
      inputSchema: SearchCardsSchema.shape,
      outputSchema: SearchCardsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ query, limit, order, dir, unique, include_extras }) => {
      try {
        const result = await service.searchCards({
          query,
          limit,
          order,
          dir,
          unique,
          include_extras
        });

        const structuredData = {
          total_cards: result.total,
          has_more: result.total > result.cards.length,
          cards: result.cards,
          query: query,
          page: 1
        };

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: structuredData
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "search-cards");
      }
    }
  );
}
