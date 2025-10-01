import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetWatermarksSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetWatermarks(server: McpServer) {
  server.registerTool("get-watermarks", {
    title: "Filigranes",
    description: "Récupère la liste de tous les filigranes de cartes",
    inputSchema: GetWatermarksSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getWatermarks();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.watermarks.length, data: result.watermarks } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-watermarks");
    }
  });
}
