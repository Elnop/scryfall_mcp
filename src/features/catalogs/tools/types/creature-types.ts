// =====================================
// TOOL: get-creature-types
// Get all MTG creature types
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetCreatureTypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetCreatureTypes(server: McpServer) {
  server.registerTool(
    "get-creature-types",
    {
      title: "Types de créatures",
      description: "Récupère la liste de tous les types de créatures",
      inputSchema: GetCreatureTypesSchema.shape,
      outputSchema: CatalogOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async () => {
      try {
        const result = await service.getCreatureTypes();
        return {
          content: [{ type: "text", text: result.formatted }],
          structuredContent: {
            total_values: result.types.length,
            data: result.types
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-creature-types");
      }
    }
  );
}
