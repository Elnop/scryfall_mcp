import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetKeywordAbilitiesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetKeywordAbilities(server: McpServer) {
  server.registerTool("get-keyword-abilities", {
    title: "Capacités à mot-clé",
    description: "Récupère la liste de toutes les capacités à mot-clé",
    inputSchema: GetKeywordAbilitiesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getKeywordAbilities();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.abilities.length, data: result.abilities } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-keyword-abilities");
    }
  });
}
