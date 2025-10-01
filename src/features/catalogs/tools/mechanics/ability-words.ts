import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetAbilityWordsSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetAbilityWords(server: McpServer) {
  server.registerTool("get-ability-words", {
    title: "Mots d'habileté",
    description: "Récupère la liste de tous les mots d'habileté",
    inputSchema: GetAbilityWordsSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getAbilityWords();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.words.length, data: result.words } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-ability-words");
    }
  });
}
