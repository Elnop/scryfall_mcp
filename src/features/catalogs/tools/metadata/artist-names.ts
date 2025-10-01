import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatalogsService } from "../../_core/catalogs.service.js";
import { GetArtistNamesSchema, CatalogOutputSchema } from "../../_schemas/catalogs.schema.js";
import { McpErrorHelper } from "../../../../shared/errors/mcp-errors.js";

const service = new CatalogsService();

export function registerGetArtistNames(server: McpServer) {
  server.registerTool("get-artist-names", {
    title: "Noms d'artistes",
    description: "Récupère la liste de tous les noms d'artistes",
    inputSchema: GetArtistNamesSchema.shape,
    outputSchema: CatalogOutputSchema.shape,
    annotations: { readOnlyHint: true, idempotentHint: true }
  }, async ({ limit }) => {
    try {
      const result = await service.getArtistNames(limit);
      return { content: [{ type: "text", text: result.formatted }], structuredContent: { total_values: result.artists.length, data: result.artists } };
    } catch (error) {
      return McpErrorHelper.fromError(error, "get-artist-names");
    }
  });
}
