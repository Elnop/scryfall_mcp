// =====================================
// GENERIC SERVICE
// Business logic for generic utility tools
// =====================================

import { getApiMetrics, checkApiHealth } from "../../../core/api/scryfall/client.js";

export class GenericService {
  // Calculator operations
  calculate(operation: "addition" | "soustraction" | "multiplication" | "division", a: number, b: number): number {
    switch (operation) {
      case "addition":
        return a + b;
      case "soustraction":
        return a - b;
      case "multiplication":
        return a * b;
      case "division":
        if (b === 0) {
          throw new Error("Division par z�ro impossible");
        }
        return a / b;
      default:
        throw new Error("Op�ration non support�e");
    }
  }

  formatCalculation(operation: string, a: number, b: number, result: number): string {
    const symbols = {
      addition: "+",
      soustraction: "-",
      multiplication: "*",
      division: "/"
    };
    const symbol = symbols[operation as keyof typeof symbols] || operation;
    return `R�sultat: ${a} ${symbol} ${b} = ${result}`;
  }

  // System metrics
  async getSystemMetrics(): Promise<{
    status: string;
    uptime: number;
    timestamp: string;
    memory: { used: number; total: number; external: number; rss: number };
    api: any;
    system: { platform: string; nodeVersion: string; architecture: string };
  }> {
    const apiMetrics = getApiMetrics();
    const isHealthy = await checkApiHealth();
    const memUsage = process.memoryUsage();

    const metrics = {
      status: isHealthy ? "healthy" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      },
      api: apiMetrics,
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        architecture: process.arch
      }
    };

    return metrics;
  }

  formatSystemMetrics(metrics: any): string {
    return [
      `<� **System Health:** ${metrics.status.toUpperCase()}`,
      `� **Uptime:** ${Math.round(metrics.uptime)} seconds`,
      ``,
      `=� **API Performance:**`,
      `" Total requests: ${metrics.api.requests.total}`,
      `" Cache hit rate: ${metrics.api.cache.hitRate.toFixed(1)}%`,
      `" Average response time: ${metrics.api.requests.avgResponseTime.toFixed(0)}ms`,
      `" Rate limit remaining: ${metrics.api.rateLimiter.remaining}/${metrics.api.rateLimiter.maxRequests}`,
      `" Pending requests: ${metrics.api.deduplicator.pendingRequests}`,
      `" Errors: ${metrics.api.requests.errors}`,
      ``,
      `=� **Memory Usage:**`,
      `" Heap used: ${metrics.memory.used}MB / ${metrics.memory.total}MB`,
      `" RSS: ${metrics.memory.rss}MB`,
      `" External: ${metrics.memory.external}MB`,
      ``,
      `=� **System:**`,
      `" Platform: ${metrics.system.platform}`,
      `" Node.js: ${metrics.system.nodeVersion}`,
      `" Architecture: ${metrics.system.architecture}`,
      ``,
      `=� **Cache Statistics:**`,
      `" Valid entries: ${metrics.api.cache.validEntries}/${metrics.api.cache.totalEntries}`,
      `" Max capacity: ${metrics.api.cache.maxSize}`,
      ``,
      `*Last updated: ${metrics.timestamp}*`
    ].join("\\n");
  }
}
