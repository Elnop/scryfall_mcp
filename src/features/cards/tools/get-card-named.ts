// =====================================
// TOOL: get-card-named
// Retrieve a Magic: The Gathering card by name
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardsService } from "../_core/cards.service.js";
import { GetCardNamedSchema, GetCardNamedOutputSchema } from "../_schemas/cards.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new CardsService();

export function registerGetCardNamed(server: McpServer) {
  server.registerTool(
    "get-card-named",
    {
      title: "Get Card by Name",
      description: "Retrieve a Magic: The Gathering card by name with fuzzy search support",
      inputSchema: GetCardNamedSchema.shape,
      outputSchema: GetCardNamedOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ name, fuzzy, set }) => {
      try {
        const result = await service.getCardNamed({
          name,
          fuzzy,
          set
        });

        const structuredData = {
          card: result.card,
          search_type: fuzzy ? "fuzzy" : "exact",
          query: name
        };

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: structuredData
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-card-named");
      }
    }
  );
}
