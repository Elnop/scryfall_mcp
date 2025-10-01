// =====================================
// SCRYFALL API CONSTANTS
// =====================================

export const SCRYFALL_API_BASE = "https://api.scryfall.com";

export const SCRYFALL_RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 1000, // 1 minute
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3
};

export const CACHE_CONFIG = {
  MAX_SIZE: 1000,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  CATALOG_TTL: 24 * 60 * 60 * 1000, // 24 hours
  SET_TTL: 60 * 60 * 1000, // 1 hour
  CARD_TTL: 10 * 60 * 1000 // 10 minutes
};

export const SEARCH_DEFAULTS = {
  LIMIT: 25,
  ORDER: "name" as const,
  DIR: "auto" as const,
  UNIQUE: "cards" as const
};

export const CATALOG_ENDPOINTS = {
  CARD_NAMES: "/catalog/card-names",
  CREATURE_TYPES: "/catalog/creature-types",
  PLANESWALKER_TYPES: "/catalog/planeswalker-types",
  LAND_TYPES: "/catalog/land-types",
  ARTIFACT_TYPES: "/catalog/artifact-types",
  ENCHANTMENT_TYPES: "/catalog/enchantment-types",
  SPELL_TYPES: "/catalog/spell-types",
  POWERS: "/catalog/powers",
  TOUGHNESSES: "/catalog/toughnesses",
  LOYALTIES: "/catalog/loyalties",
  WATERMARKS: "/catalog/watermarks",
  KEYWORD_ABILITIES: "/catalog/keyword-abilities",
  KEYWORD_ACTIONS: "/catalog/keyword-actions",
  ABILITY_WORDS: "/catalog/ability-words",
  ARTIST_NAMES: "/catalog/artist-names"
} as const;
