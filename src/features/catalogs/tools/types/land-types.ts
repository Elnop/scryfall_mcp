import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetLandTypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetLandTypes(server: McpServer) {
  server.registerTool("get-land-types", {
    title: "Types de terrains",
    description: "Récupère la liste de tous les types de terrains",
    inputSchema: GetLandTypesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, destructiveHint: false }
  }, async () => {
    try {
      const result = await service.getLandTypes();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.types.length, data: result.types } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-land-types");
    }
  });
}
