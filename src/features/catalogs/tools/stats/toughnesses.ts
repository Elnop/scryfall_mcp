import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetToughnessesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetToughnesses(server: McpServer) {
  server.registerTool("get-toughnesses", {
    title: "Valeurs d'endurance",
    description: "Récupère la liste de toutes les valeurs d'endurance possibles",
    inputSchema: GetToughnessesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getToughnesses();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.toughnesses.length, data: result.toughnesses } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-toughnesses");
    }
  });
}
