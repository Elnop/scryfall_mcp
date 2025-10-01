import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetPowersSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetPowers(server: McpServer) {
  server.registerTool("get-powers", {
    title: "Valeurs de force",
    description: "Récupère la liste de toutes les valeurs de force possibles",
    inputSchema: GetPowersSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async () => {
    try {
      const result = await service.getPowers();
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.powers.length, data: result.powers } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-powers");
    }
  });
}
