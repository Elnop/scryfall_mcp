// =====================================
// TOOL: get-card-rulings-by-name
// Get card rulings by card name
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RulingsService } from "../_core/rulings.service.js";
import { GetCardRulingsByNameSchema, GetRulingsByNameOutputSchema } from "../_schemas/rulings.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new RulingsService();

export function registerGetCardRulingsByName(server: McpServer) {
  server.registerTool(
    "get-card-rulings-by-name",
    {
      title: "Règles par nom de carte",
      description: "Récupère les règles officielles d'une carte par son nom",
      inputSchema: GetCardRulingsByNameSchema.shape,
      outputSchema: GetRulingsByNameOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ name, fuzzy, set }) => {
      try {
        const result = await service.getCardRulingsByName({ name, fuzzy, set });

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: {
            card_name: result.card.name,
            total_rulings: result.rulings.length,
            rulings: result.rulings
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-card-rulings-by-name");
      }
    }
  );
}
