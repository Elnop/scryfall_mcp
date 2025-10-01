// =====================================
// DEVELOPMENT/TEST ENTRY POINT
// Use this for testing the new architecture
// =====================================

import { bootstrapStdioServer } from "./bootstrap/stdio.bootstrap.js";

async function main() {
  try {
    await bootstrapStdioServer();
    console.error("🚀 Serveur MCP Scryfall démarré (nouvelle architecture)");
    console.error("✅ 32 tools enregistrés avec succès:");
    console.error("   • 8 tools Cards (formatted + raw)");
    console.error("   • 4 tools Sets");
    console.error("   • 3 tools Rulings");
    console.error("   • 16 tools Catalogs");
    console.error("   • 1 tool Generic (system metrics)");
  } catch (error) {
    console.error("❌ Erreur fatale lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
