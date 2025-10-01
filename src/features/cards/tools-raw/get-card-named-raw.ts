// =====================================
// TOOL: get-card-named-raw
// Get card by name and return raw JSON
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { GetCardNamedSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerGetCardNamedRaw(server: McpServer) {
  server.registerTool(
    "get-card-named-raw",
    {
      title: "Get Card by Name (Raw JSON)",
      description: "Get Magic: The Gathering card by name and return raw JSON response from Scryfall API",
      inputSchema: GetCardNamedSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ name, fuzzy, set }) => {
      try {
        const result = await service.getCardNamedRaw({
          name,
          fuzzy,
          set
        });

        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-card-named-raw");
      }
    }
  );
}
