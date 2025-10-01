import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetCardNamesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetCardNames(server: McpServer) {
  server.registerTool("get-card-names", {
    title: "Tous les noms de cartes",
    description: "Récupère la liste de tous les noms de cartes Magic",
    inputSchema: GetCardNamesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async ({ limit }) => {
    try {
      const result = await service.getCardNames(limit);
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.names.length, data: result.names } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-card-names");
    }
  });
}
