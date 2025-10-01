// =====================================
// TOOL: get-random-card
// Retrieve a random Magic: The Gathering card
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { GetRandomCardSchema, GetRandomCardOutputSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerGetRandomCard(server: McpServer) {
  server.registerTool(
    "get-random-card",
    {
      title: "Get Random Card",
      description: "Retrieve a random Magic: The Gathering card with optional search criteria",
      inputSchema: GetRandomCardSchema.shape,
      outputSchema: GetRandomCardOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: false,
        openWorldHint: true,
        destructiveHint: false
      }
    },
    async ({ query }) => {
      try {
        const result = await service.getRandomCard({ query });

        const structuredData = {
          card: result.card,
          query: query
        };

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: structuredData
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-random-card");
      }
    }
  );
}
