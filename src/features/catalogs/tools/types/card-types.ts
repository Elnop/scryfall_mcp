import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetCardTypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetCardTypes(server: McpServer) {
  server.registerTool("get-card-types", {
    title: "Types de cartes",
    description: "Récupère la liste de tous les types de cartes",
    inputSchema: GetCardTypesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, destructiveHint: false }
  }, async () => {
    try {
      const result = await service.getCardTypes();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.types.length, data: result.types } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-card-types");
    }
  });
}
