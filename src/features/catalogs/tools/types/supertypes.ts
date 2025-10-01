import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetSupertypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetSupertypes(server: McpServer) {
  server.registerTool("get-supertypes", {
    title: "Super-types",
    description: "Récupère la liste de tous les super-types",
    inputSchema: GetSupertypesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, destructiveHint: false }
  }, async () => {
    try {
      const result = await service.getSupertypes();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.types.length, data: result.types } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-supertypes");
    }
  });
}
