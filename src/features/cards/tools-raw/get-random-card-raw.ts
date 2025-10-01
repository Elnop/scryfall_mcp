// =====================================
// TOOL: get-random-card-raw
// Get random card and return raw JSON
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { GetRandomCardSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerGetRandomCardRaw(server: McpServer) {
  server.registerTool(
    "get-random-card-raw",
    {
      title: "Get Random Card (Raw JSON)",
      description: "Get random Magic: The Gathering card and return raw JSON response from Scryfall API",
      inputSchema: GetRandomCardSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: false,
        openWorldHint: true,
        destructiveHint: false
      }
    },
    async ({ query }) => {
      try {
        const result = await service.getRandomCardRaw({ query });

        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-random-card-raw");
      }
    }
  );
}
