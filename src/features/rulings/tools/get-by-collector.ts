// =====================================
// TOOL: get-card-rulings-by-collector
// Get card rulings by set code and collector number
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RulingsService } from "../_core/rulings.service.js";
import { GetCardRulingsByCollectorSchema, GetRulingsOutputSchema } from "../_schemas/rulings.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new RulingsService();

export function registerGetCardRulingsByCollector(server: McpServer) {
  server.registerTool(
    "get-card-rulings-by-collector",
    {
      title: "Règles par set et numéro",
      description: "Récupère les règles d'une carte par son code d'extension et numéro de collection",
      inputSchema: GetCardRulingsByCollectorSchema.shape,
      outputSchema: GetRulingsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ set_code, collector_number }) => {
      try {
        const result = await service.getCardRulingsByCollector({ set_code, collector_number });

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
        return McpErrorHelper.fromError(error, "get-card-rulings-by-collector");
      }
    }
  );
}
