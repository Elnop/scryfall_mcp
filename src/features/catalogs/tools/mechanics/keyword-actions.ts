import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetKeywordActionsSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetKeywordActions(server: McpServer) {
  server.registerTool("get-keyword-actions", {
    title: "Actions à mot-clé",
    description: "Récupère la liste de toutes les actions à mot-clé",
    inputSchema: GetKeywordActionsSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getKeywordActions();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.actions.length, data: result.actions } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-keyword-actions");
    }
  });
}
