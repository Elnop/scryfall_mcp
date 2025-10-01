// =====================================
// SETS ZOD SCHEMAS
// Validation schemas for sets tools
// =====================================

import { z } from "zod";

// =====================================
// VALIDATION PATTERNS
// =====================================

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SET_CODE_PATTERN = /^[A-Z0-9]{3,5}$/;

// =====================================
// BASE SCHEMAS
// =====================================

export const SetCodeSchema = z.string()
  .min(3, "Set code must be at least 3 characters")
  .max(5, "Set code must be at most 5 characters")
  .regex(SET_CODE_PATTERN, "Must be 3-5 uppercase letters/numbers (e.g., 'DOM', 'WAR', 'M21')")
  .describe("Magic: The Gathering set code - 3-5 character identifier")
  .transform(s => s.toUpperCase());

export const SetIdSchema = z.string()
  .regex(UUID_PATTERN, "Must be a valid UUID format")
  .describe("Scryfall UUID identifier for sets")
  .transform(s => s.toLowerCase());

// =====================================
// TOOL SCHEMAS
// =====================================

export const GetAllSetsSchema = z.object({})
  .describe("No parameters required - returns all Magic: The Gathering sets");

export const GetSetByCodeSchema = z.object({
  code: SetCodeSchema
});

export const GetSetByIdSchema = z.object({
  id: SetIdSchema
});

export const SearchSetsSchema = z.object({
  query: z.string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query too long")
    .describe("Search term for set name or characteristics")
    .refine(query => query.trim().length > 0, "Query cannot be only whitespace"),

  type: z.enum([
    "core", "expansion", "masters", "draft_innovation", "commander",
    "planechase", "archenemy", "vanguard", "funny", "starter",
    "box", "promo", "token", "memorabilia"
  ])
    .optional()
    .describe(`Set type filter:
      • core: Core sets
      • expansion: Expansion sets
      • masters: Masters sets
      • commander: Commander products
      • draft_innovation: Special draft sets
      • promo: Promotional cards
      • etc.
    `)
});

// =====================================
// OUTPUT SCHEMAS
// =====================================

export const GetAllSetsOutputSchema = z.object({
  total_sets: z.number(),
  sets: z.array(z.any())
});

export const GetSetOutputSchema = z.object({
  set: z.any()
});

export const SearchSetsOutputSchema = z.object({
  total_found: z.number(),
  sets: z.array(z.any()),
  query: z.string()
});
