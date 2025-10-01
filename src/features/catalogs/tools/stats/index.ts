import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetPowers } from "./powers.js";
import { registerGetToughnesses } from "./toughnesses.js";
import { registerGetLoyalties } from "./loyalties.js";

export * from "./powers.js";
export * from "./toughnesses.js";
export * from "./loyalties.js";

export function registerStatsTools(server: McpServer) {
  registerGetPowers(server);
  registerGetToughnesses(server);
  registerGetLoyalties(server);
}
