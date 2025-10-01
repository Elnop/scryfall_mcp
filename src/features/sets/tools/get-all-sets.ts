// =====================================
// TOOL: get-all-sets
// Get all Magic: The Gathering sets
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SetsService } from "../_core/sets.service.js";
import { GetAllSetsSchema, GetAllSetsOutputSchema } from "../_schemas/sets.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new SetsService();

export function registerGetAllSets(server: McpServer) {
  server.registerTool(
    "get-all-sets",
    {
      title: "Toutes les extensions MTG",
      description: "Récupère la liste de toutes les extensions Magic: The Gathering",
      inputSchema: GetAllSetsSchema.shape,
      outputSchema: GetAllSetsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async () => {
      try {
        const result = await service.getAllSets();

        return {
          content: [{
            type: "text",
            text: result.formatted
          }],
          structuredContent: {
            total_sets: result.sets.length,
            sets: result.sets
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-all-sets");
      }
    }
  );
}
