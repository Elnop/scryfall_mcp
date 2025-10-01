// =====================================
// CATALOGS ZOD SCHEMAS
// Validation schemas for catalogs tools
// =====================================

import { z } from "zod";

// =====================================
// BASE SCHEMAS
// =====================================

// Schema for catalogs with optional limit
export const CatalogWithLimitSchema = z.object({
  limit: z.number()
    .int("Limit must be an integer")
    .min(1, "Minimum 1 result")
    .max(1000, "Maximum 1000 results")
    .default(100)
    .describe("Maximum number of items to return (1-1000, default: 100)")
});

// Schema for catalogs without parameters
export const EmptyParamsSchema = z.object({})
  .describe("No parameters required");

// =====================================
// OUTPUT SCHEMAS
// =====================================

export const CatalogOutputSchema = z.object({
  total_values: z.number(),
  data: z.array(z.string())
});

// =====================================
// SPECIFIC TOOL SCHEMAS
// =====================================

// Card names (with limit)
export const GetCardNamesSchema = CatalogWithLimitSchema;

// Type catalogs (no params)
export const GetCreatureTypesSchema = EmptyParamsSchema;
export const GetPlaneswalkerTypesSchema = EmptyParamsSchema;
export const GetLandTypesSchema = EmptyParamsSchema;
export const GetArtifactTypesSchema = EmptyParamsSchema;
export const GetEnchantmentTypesSchema = EmptyParamsSchema;
export const GetCardTypesSchema = EmptyParamsSchema;
export const GetSupertypesSchema = EmptyParamsSchema;

// Mechanics catalogs (no params)
export const GetKeywordAbilitiesSchema = EmptyParamsSchema;
export const GetKeywordActionsSchema = EmptyParamsSchema;
export const GetAbilityWordsSchema = EmptyParamsSchema;

// Metadata catalogs
export const GetWatermarksSchema = EmptyParamsSchema;
export const GetArtistNamesSchema = CatalogWithLimitSchema;

// Stats catalogs (no params)
export const GetPowersSchema = EmptyParamsSchema;
export const GetToughnessesSchema = EmptyParamsSchema;
export const GetLoyaltiesSchema = EmptyParamsSchema;
