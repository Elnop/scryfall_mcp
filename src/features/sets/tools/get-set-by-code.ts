// =====================================
// TOOL: get-set-by-code
// Get MTG set by its code
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SetsService } from "../_core/sets.service.js";
import { GetSetByCodeSchema, GetSetOutputSchema } from "../_schemas/sets.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new SetsService();

export function registerGetSetByCode(server: McpServer) {
  server.registerTool(
    "get-set-by-code",
    {
      title: "Extension par code",
      description: "Récupère les informations d'une extension par son code",
      inputSchema: GetSetByCodeSchema.shape,
      outputSchema: GetSetOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ code }) => {
      try {
        const result = await service.getSetByCode(code);

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: {
            set: result.set
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-set-by-code");
      }
    }
  );
}
