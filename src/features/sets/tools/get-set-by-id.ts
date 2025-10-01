// =====================================
// TOOL: get-set-by-id
// Get MTG set by its Scryfall ID
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SetsService } from "../_core/sets.service.js";
import { GetSetByIdSchema, GetSetOutputSchema } from "../_schemas/sets.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new SetsService();

export function registerGetSetById(server: McpServer) {
  server.registerTool(
    "get-set-by-id",
    {
      title: "Extension par ID",
      description: "Récupère les informations d'une extension par son ID Scryfall",
      inputSchema: GetSetByIdSchema.shape,
      outputSchema: GetSetOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ id }) => {
      try {
        const result = await service.getSetById(id);

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
        return McpErrorHelper.fromError(error, "get-set-by-id");
      }
    }
  );
}
