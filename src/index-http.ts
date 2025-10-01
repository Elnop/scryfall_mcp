// =====================================
// SCRYFALL MCP SERVER - HTTP ENTRY POINT
// Production entry point for StreamableHTTP transport
// MCP Standard 2025-03-26
// =====================================

import { bootstrapHttpServer } from "./bootstrap/http.bootstrap.js";

async function main() {
  try {
    const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
    const { app, port } = await bootstrapHttpServer(PORT);

    app.listen(port, () => {
      console.log('🚀 Scryfall MCP Server (StreamableHTTP) started');
      console.log(`🔗 MCP endpoint: http://localhost:${port}/mcp`);
      console.log(`💚 Health check: http://localhost:${port}/health`);
      console.log(`📊 Info: http://localhost:${port}/`);
      console.log(`🧪 Test with: npx @modelcontextprotocol/inspector http://localhost:${port}/mcp`);
      console.log(`✅ 32 tools registered across 5 features`);
    });
  } catch (error) {
    console.error('❌ Fatal error starting server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
