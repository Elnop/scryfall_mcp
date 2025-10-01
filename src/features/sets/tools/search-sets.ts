// =====================================
// TOOL: search-sets
// Search MTG sets by name or type
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SetsService } from "../_core/sets.service.js";
import { SearchSetsSchema, SearchSetsOutputSchema } from "../_schemas/sets.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new SetsService();

export function registerSearchSets(server: McpServer) {
  server.registerTool(
    "search-sets",
    {
      title: "Recherche d'extensions",
      description: "Recherche des extensions par nom ou type",
      inputSchema: SearchSetsSchema.shape,
      outputSchema: SearchSetsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async ({ query, type }) => {
      try {
        const result = await service.searchSets({ query, type });

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: {
            total_found: result.sets.length,
            sets: result.sets,
            query: query
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "search-sets");
      }
    }
  );
}
