// =====================================
// TOOL: get-card-rulings-by-id
// Get card rulings by Scryfall ID
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RulingsService } from "../_core/rulings.service.js";
import { GetCardRulingsByIdSchema, GetRulingsOutputSchema } from "../_schemas/rulings.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new RulingsService();

export function registerGetCardRulingsById(server: McpServer) {
  server.registerTool(
    "get-card-rulings-by-id",
    {
      title: "Règles par ID de carte",
      description: "Récupère les règles officielles d'une carte par son ID Scryfall",
      inputSchema: GetCardRulingsByIdSchema.shape,
      outputSchema: GetRulingsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ id }) => {
      try {
        const result = await service.getCardRulingsById(id);

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: {
            total_rulings: result.rulings.length,
            rulings: result.rulings
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-card-rulings-by-id");
      }
    }
  );
}
