// =====================================
// CARDS ZOD SCHEMAS
// Validation schemas for cards tools
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

export const CardNameSchema = z.string()
  .min(1, "Card name cannot be empty")
  .max(200, "Card name too long")
  .describe("Magic: The Gathering card name - supports exact matches and fuzzy search")
  .refine(name => name.trim().length > 0, "Card name cannot be only whitespace");

export const SetCodeSchema = z.string()
  .min(3, "Set code must be at least 3 characters")
  .max(5, "Set code must be at most 5 characters")
  .regex(SET_CODE_PATTERN, "Must be 3-5 uppercase letters/numbers (e.g., 'DOM', 'WAR', 'M21')")
  .describe("Magic: The Gathering set code - 3-5 character identifier")
  .transform(s => s.toUpperCase());

export const ScryfallQuerySchema = z.string()
  .min(1, "Search query cannot be empty")
  .max(1000, "Search query too long (Scryfall API limit: 1000 Unicode characters)")
  .describe(`
    Scryfall search syntax query. Examples:
    • Basic search: "Lightning Bolt"
    • Color: "c:red" or "c:r"
    • Type: "t:creature", "t:instant"
    • Mana cost: "cmc=3", "cmc<=2", "cmc>=4"
    • Power/Toughness: "power=3", "toughness<=2"
    • Set: "set:dom", "set:war"
    • Rarity: "r:rare", "r:mythic"
    • Combined: "c:blue t:creature cmc<=3"

    Full syntax: https://scryfall.com/docs/syntax
    Maximum length: 1000 Unicode characters (Scryfall API limit)
  `)
  .refine(query => query.trim().length > 0, "Query cannot be only whitespace");

export const AutocompleteQuerySchema = z.string()
  .min(2, "Autocomplete requires at least 2 characters")
  .max(50, "Autocomplete query too long")
  .describe("Partial card name for autocomplete suggestions (minimum 2 characters)")
  .refine(query => !/^\s|\s$/.test(query), "Query cannot start or end with whitespace");

// =====================================
// TOOL SCHEMAS
// =====================================

export const SearchCardsSchema = z.object({
  query: ScryfallQuerySchema,

  limit: z.number()
    .int("Limit must be an integer")
    .min(1, "Minimum 1 result")
    .max(175, "Maximum 175 results (Scryfall API limit)")
    .default(25)
    .describe("Maximum number of cards to return (1-175, default: 25)"),

  order: z.enum([
    "name", "set", "released", "rarity", "color", "usd", "tix", "eur",
    "cmc", "power", "toughness", "edhrec", "penny", "artist", "review"
  ])
    .default("name")
    .describe(`Sort order for results:
      • name: Alphabetical by card name
      • set: By set release date
      • released: By card release date
      • rarity: By rarity (common→mythic)
      • color: By color identity
      • usd/eur/tix: By price
      • cmc: By converted mana cost
      • power/toughness: By creature stats
      • edhrec/penny: By format popularity
      • artist: By artist name
      • review: By community review score
    `),

  dir: z.enum(["auto", "asc", "desc"])
    .default("auto")
    .describe("Sort direction: 'auto' (natural), 'asc' (ascending), 'desc' (descending)"),

  unique: z.enum(["cards", "art", "prints"])
    .default("cards")
    .describe(`Deduplication strategy:
      • cards: One per unique card (default)
      • art: One per unique artwork
      • prints: All printings/versions
    `),

  include_extras: z.boolean()
    .default(false)
    .describe("Include special cards (tokens, emblems, art cards, etc.)")
});

export const GetCardNamedSchema = z.object({
  name: CardNameSchema,

  fuzzy: z.boolean()
    .default(true)
    .describe("Enable fuzzy search (tolerates typos and partial matches)"),

  set: SetCodeSchema
    .optional()
    .describe("Limit search to specific set (e.g., 'DOM', 'WAR', 'M21')")
});

export const GetRandomCardSchema = z.object({
  query: ScryfallQuerySchema
    .optional()
    .describe("Optional search criteria to filter random selection (e.g., 'c:blue t:creature')")
});

export const AutocompleteCardsSchema = z.object({
  query: AutocompleteQuerySchema,

  include_extras: z.boolean()
    .default(false)
    .describe("Include special cards in autocomplete suggestions")
});

// =====================================
// OUTPUT SCHEMAS (for type safety)
// =====================================

export const SearchCardsOutputSchema = z.object({
  total_cards: z.number(),
  has_more: z.boolean(),
  cards: z.array(z.any()),
  query: z.string(),
  page: z.number()
});

export const GetCardNamedOutputSchema = z.object({
  card: z.any(),
  search_type: z.enum(["fuzzy", "exact"]),
  query: z.string()
});

export const GetRandomCardOutputSchema = z.object({
  card: z.any(),
  query: z.string().optional()
});

export const AutocompleteCardsOutputSchema = z.object({
  total_values: z.number(),
  data: z.array(z.string()),
  query: z.string(),
  has_more: z.boolean()
});
