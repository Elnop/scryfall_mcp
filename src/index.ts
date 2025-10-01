// =====================================
// SCRYFALL MCP SERVER - STDIO ENTRY POINT
// Production entry point for stdio transport (Claude Desktop)
// =====================================

import { bootstrapStdioServer } from "./bootstrap/stdio.bootstrap.js";

async function main() {
  try {
    await bootstrapStdioServer();
    console.error("🚀 Scryfall MCP Server (stdio) started");
    console.error("✅ 32 tools registered across 5 features");
  } catch (error) {
    console.error("❌ Fatal error starting server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
