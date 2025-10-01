import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetCardNames } from "./card-names.js";
import { registerGetArtistNames } from "./artist-names.js";
import { registerGetWatermarks } from "./watermarks.js";

export * from "./card-names.js";
export * from "./artist-names.js";
export * from "./watermarks.js";

export function registerMetadataTools(server: McpServer) {
  registerGetCardNames(server);
  registerGetArtistNames(server);
  registerGetWatermarks(server);
}
