import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetLoyaltiesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetLoyalties(server: McpServer) {
  server.registerTool("get-loyalties", {
    title: "Valeurs de loyauté",
    description: "Récupère la liste de toutes les valeurs de loyauté des planeswalkers",
    inputSchema: GetLoyaltiesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getLoyalties();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.loyalties.length, data: result.loyalties } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-loyalties");
    }
  });
}
