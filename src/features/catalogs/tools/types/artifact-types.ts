import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetArtifactTypesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetArtifactTypes(server: McpServer) {
  server.registerTool("get-artifact-types", {
    title: "Types d'artefacts",
    description: "Récupère la liste de tous les types d'artefacts",
    inputSchema: GetArtifactTypesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, destructiveHint: false }
  }, async () => {
    try {
      const result = await service.getArtifactTypes();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.types.length, data: result.types } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-artifact-types");
    }
  });
}
