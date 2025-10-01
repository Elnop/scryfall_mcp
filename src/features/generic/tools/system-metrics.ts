// =====================================
// TOOL: get-system-metrics
// System performance monitoring
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenericService } from "../_core/generic.service.js";
import { SystemMetricsSchema, SystemMetricsOutputSchema } from "../_schemas/generic.schema.js";
import { McpErrorHelper } from "../../../shared/errors/mcp-errors.js";

const service = new GenericService();

export function registerGetSystemMetrics(server: McpServer) {
  server.registerTool(
    "get-system-metrics",
    {
      title: "System Performance Metrics",
      description: "Get real-time performance metrics and system health status",
      inputSchema: SystemMetricsSchema.shape,
      outputSchema: SystemMetricsOutputSchema.shape,
      annotations: {
        readOnlyHint: true,
        idempotentHint: false,
        openWorldHint: false,
        destructiveHint: false
      }
    },
    async () => {
      try {
        const metrics = await service.getSystemMetrics();
        const formatted = service.formatSystemMetrics(metrics);

        return {
          content: [{ type: "text", text: formatted }],
          structuredContent: {
            status: metrics.status,
            uptime: metrics.uptime,
            memory: metrics.memory,
            api: metrics.api,
            system: metrics.system,
            timestamp: metrics.timestamp
          }
        };
      } catch (error) {
        return McpErrorHelper.fromError(error, "get-system-metrics");
      }
    }
  );
}
