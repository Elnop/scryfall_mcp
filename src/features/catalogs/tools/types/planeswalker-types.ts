// =====================================
// TOOL: get-planeswalker-types
//=====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetPlaneswalkerTypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetPlaneswalkerTypes(server: McpServer) {
  server.registerTool("get-planeswalker-types", {
    title: "Types de planeswalkers",
    description: "Récupère la liste de tous les types de planeswalkers",
    inputSchema: GetPlaneswalkerTypesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, destructiveHint: false }
  }, async () => {
    try {
      const result = await service.getPlaneswalkerTypes();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.types.length, data: result.types } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-planeswalker-types");
    }
  });
}
