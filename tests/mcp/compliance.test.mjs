#!/usr/bin/env node

/**
 * Test de conformité MCP complet
 * Vérifie les nouvelles fonctionnalités implementées
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMcpCompliance() {
  console.log('🧪 Test de conformité MCP complet...');

  const serverPath = path.join(__dirname, '..', '..', 'dist', 'index.js');
  console.log(`📁 Chemin du serveur: ${serverPath}`);

  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let serverOutput = '';
  serverProcess.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  const tests = [
    // Test 1: Initialisation avec capabilities
    {
      name: "Initialisation avec capabilities",
      message: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {
            roots: { listChanged: true },
            sampling: {}
          },
          clientInfo: {
            name: "test-client",
            version: "1.0.0"
          }
        }
      }
    },

    // Test 2: Liste des outils (doit inclure outputSchema)
    {
      name: "Liste des outils avec outputSchema",
      message: {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list"
      }
    },

    // Test 3: Appel d'un outil avec structuredContent
    {
      name: "Appel d'outil avec structuredContent",
      message: {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "get-card-named",
          arguments: {
            name: "Lightning Bolt",
            fuzzy: true
          }
        }
      }
    },

    // Test 4: Liste des ressources
    {
      name: "Liste des ressources",
      message: {
        jsonrpc: "2.0",
        id: 4,
        method: "resources/list"
      }
    }
  ];

  try {
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`\n📤 Test ${i + 1}: ${test.name}...`);

      // Envoyer le message
      const messageStr = JSON.stringify(test.message) + '\n';
      serverProcess.stdin.write(messageStr);

      // Attendre la réponse
      const response = await new Promise((resolve) => {
        const handler = (data) => {
          const responseStr = data.toString().trim();
          if (responseStr) {
            serverProcess.stdout.removeListener('data', handler);
            resolve(responseStr);
          }
        };
        serverProcess.stdout.on('data', handler);
      });

      // Analyser la réponse selon le test
      const responseObj = JSON.parse(response);

      // Log erreur si nécessaire
      if (responseObj.error) {
        console.log(`❌ Erreur: ${responseObj.error.message}`);
        continue;
      }

      switch (i) {
        case 0: // Initialisation
          if (responseObj.result && responseObj.result.capabilities) {
            console.log(`✅ Capabilities: tools=${!!responseObj.result.capabilities.tools}, resources=${!!responseObj.result.capabilities.resources}`);
          }
          break;

        case 1: // Liste des outils
          if (responseObj.result && responseObj.result.tools) {
            const toolsWithOutputSchema = responseObj.result.tools.filter(
              tool => tool.outputSchema
            );
            console.log(`✅ Outils avec outputSchema: ${toolsWithOutputSchema.length}/${responseObj.result.tools.length}`);

            // Vérifier les annotations
            const toolsWithAnnotations = responseObj.result.tools.filter(
              tool => tool.annotations
            );
            console.log(`✅ Outils avec annotations: ${toolsWithAnnotations.length}/${responseObj.result.tools.length}`);
          }
          break;

        case 2: // Appel d'outil
          if (responseObj.result) {
            const hasStructuredContent = !!responseObj.result.structuredContent;
            const hasContent = !!responseObj.result.content;
            console.log(`✅ Content: ${hasContent}, StructuredContent: ${hasStructuredContent}`);

            if (hasStructuredContent) {
              console.log(`📊 StructuredContent keys: ${Object.keys(responseObj.result.structuredContent).join(', ')}`);
            }
          }
          break;

        case 3: // Ressources
          if (responseObj.result && responseObj.result.resources) {
            console.log(`✅ Ressources disponibles: ${responseObj.result.resources.length}`);
          }
          break;
      }
    }

    console.log('\n🎉 Tests de conformité MCP terminés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    console.log('\n⏰ Fermeture du serveur...');
    serverProcess.kill();

    if (serverOutput) {
      console.log('📊 Log du serveur:');
      console.log(serverOutput);
    }
  }
}

// Lancer les tests
testMcpCompliance().catch(console.error);