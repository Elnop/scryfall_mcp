// =====================================
// TYPES TOOLS - Barrel Export
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetCreatureTypes } from "./creature-types.js";
import { registerGetPlaneswalkerTypes } from "./planeswalker-types.js";
import { registerGetLandTypes } from "./land-types.js";
import { registerGetArtifactTypes } from "./artifact-types.js";
import { registerGetEnchantmentTypes } from "./enchantment-types.js";
import { registerGetCardTypes } from "./card-types.js";
import { registerGetSupertypes } from "./supertypes.js";

export * from "./creature-types.js";
export * from "./planeswalker-types.js";
export * from "./land-types.js";
export * from "./artifact-types.js";
export * from "./enchantment-types.js";
export * from "./card-types.js";
export * from "./supertypes.js";

export function registerTypesTools(server: McpServer) {
  registerGetCreatureTypes(server);
  registerGetPlaneswalkerTypes(server);
  registerGetLandTypes(server);
  registerGetArtifactTypes(server);
  registerGetEnchantmentTypes(server);
  registerGetCardTypes(server);
  registerGetSupertypes(server);
}
