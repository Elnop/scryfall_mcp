import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetKeywordAbilities } from "./keyword-abilities.js";
import { registerGetKeywordActions } from "./keyword-actions.js";
import { registerGetAbilityWords } from "./ability-words.js";

export * from "./keyword-abilities.js";
export * from "./keyword-actions.js";
export * from "./ability-words.js";

export function registerMechanicsTools(server: McpServer) {
  registerGetKeywordAbilities(server);
  registerGetKeywordActions(server);
  registerGetAbilityWords(server);
}
