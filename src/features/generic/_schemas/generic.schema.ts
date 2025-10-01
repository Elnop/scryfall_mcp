// =====================================
// GENERIC ZOD SCHEMAS
// Validation schemas for generic tools
// =====================================

import { z } from "zod";

// =====================================
// CALCULATOR SCHEMAS
// =====================================

export const CalculatorSchema = z.object({
  operation: z.enum(["addition", "soustraction", "multiplication", "division"])
    .describe("Type d'opération mathématique"),
  a: z.number().describe("Premier nombre"),
  b: z.number().describe("Deuxième nombre")
});

export const CalculatorOutputSchema = z.object({
  operation: z.string(),
  a: z.number(),
  b: z.number(),
  result: z.number()
});

// =====================================
// SYSTEM METRICS SCHEMAS
// =====================================

export const SystemMetricsSchema = z.object({})
  .describe("No parameters required");

export const SystemMetricsOutputSchema = z.object({
  status: z.enum(["healthy", "degraded"]),
  uptime: z.number(),
  timestamp: z.string(),
  memory: z.object({
    used: z.number(),
    total: z.number(),
    external: z.number(),
    rss: z.number()
  }),
  api: z.object({
    requests: z.any(),
    cache: z.any(),
    rateLimiter: z.any(),
    deduplicator: z.any()
  }),
  system: z.object({
    platform: z.string(),
    nodeVersion: z.string(),
    architecture: z.string()
  })
});
