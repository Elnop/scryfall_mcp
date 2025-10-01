// =====================================
// RULINGS ZOD SCHEMAS
// Validation schemas for rulings tools
// =====================================

import { z } from "zod";

// =====================================
// VALIDATION PATTERNS
// =====================================

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SET_CODE_PATTERN = /^[A-Z0-9]{3,5}$/;
const COLLECTOR_NUMBER_PATTERN = /^[0-9]+[a-z]?(\*|†|‡|★)?$/i;

// =====================================
// BASE SCHEMAS
// =====================================

export const CardNameSchema = z.string()
  .min(1, "Card name cannot be empty")
  .max(200, "Card name too long")
  .describe("Magic: The Gathering card name")
  .refine(name => name.trim().length > 0, "Card name cannot be only whitespace");

export const SetCodeSchema = z.string()
  .min(3, "Set code must be at least 3 characters")
  .max(5, "Set code must be at most 5 characters")
  .regex(SET_CODE_PATTERN, "Must be 3-5 uppercase letters/numbers (e.g., 'DOM', 'WAR', 'M21')")
  .describe("Magic: The Gathering set code")
  .transform(s => s.toUpperCase());

export const CollectorNumberSchema = z.string()
  .min(1, "Collector number cannot be empty")
  .max(10, "Collector number too long")
  .regex(COLLECTOR_NUMBER_PATTERN, "Invalid collector number format (e.g., '123', '45a', '67*')")
  .describe("Card collector number within a set");

export const CardIdSchema = z.string()
  .regex(UUID_PATTERN, "Must be a valid UUID format")
  .describe("Scryfall UUID identifier for cards")
  .transform(s => s.toLowerCase());

// =====================================
// TOOL SCHEMAS
// =====================================

export const GetCardRulingsByNameSchema = z.object({
  name: CardNameSchema,

  fuzzy: z.boolean()
    .default(true)
    .describe("Enable fuzzy search (tolerates typos)"),

  set: SetCodeSchema
    .optional()
    .describe("Limit search to specific set")
});

export const GetCardRulingsByIdSchema = z.object({
  id: CardIdSchema
});

export const GetCardRulingsByCollectorSchema = z.object({
  set_code: SetCodeSchema,
  collector_number: CollectorNumberSchema
});

// =====================================
// OUTPUT SCHEMAS
// =====================================

export const GetRulingsByNameOutputSchema = z.object({
  card_name: z.string(),
  total_rulings: z.number(),
  rulings: z.array(z.any())
});

export const GetRulingsOutputSchema = z.object({
  total_rulings: z.number(),
  rulings: z.array(z.any())
});
