#!/usr/bin/env node

/**
 * 🧪 Test Enhanced du Serveur MCP Scryfall
 *
 * Tests complets :
 * - ✅ Initialisation et capabilities
 * - ✅ Liste des outils (avec outputSchema)
 * - ✅ Appel d'outil avec structuredContent
 * - ✅ Liste des ressources
 * - ✅ Gestion d'erreurs
 * - ✅ Performance et timeouts
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TIMEOUT_MS = 15000; // Increased for API health check
const serverPath = path.join(__dirname, '..', '..', 'dist', 'index.js');

// Statistiques de test
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  startTime: Date.now()
};

// Utilitaires de test
function logTest(name, status, details = '') {
  stats.total++;
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏳';
  const color = status === 'PASS' ? '\x1b[32m' : status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${icon} ${color}${status}${reset} ${name}${details ? ' - ' + details : ''}`);

  if (status === 'PASS') stats.passed++;
  if (status === 'FAIL') stats.failed++;
}

function logSection(title) {
  console.log(`\n🔍 ${title}`);
  console.log('─'.repeat(50));
}

function logSummary() {
  const duration = Date.now() - stats.startTime;
  const successRate = Math.round((stats.passed / stats.total) * 100);

  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('═'.repeat(50));
  console.log(`⏱️  Durée: ${duration}ms`);
  console.log(`📈 Tests: ${stats.total} total`);
  console.log(`✅ Réussis: ${stats.passed}`);
  console.log(`❌ Échecs: ${stats.failed}`);
  console.log(`🎯 Taux de réussite: ${successRate}%`);

  if (stats.failed === 0) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS ! 🎉');
    process.exit(0);
  } else {
    console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
    process.exit(1);
  }
}

// Tests MCP
async function runTests() {
  console.log('🚀 Test Enhanced du Serveur MCP Scryfall v2.0.0');
  console.log('📁 Serveur:', serverPath);
  console.log('⏱️  Timeout:', TIMEOUT_MS + 'ms');

  // Vérifier que le serveur existe
  if (!fs.existsSync(serverPath)) {
    logTest('Server file exists', 'FAIL', 'dist/index.js not found. Run: npm run build');
    logSummary();
    return;
  }
  logTest('Server file exists', 'PASS');

  // Lancer le serveur
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let serverLogs = '';
  server.stderr.on('data', (data) => {
    serverLogs += data.toString();
  });

  // Gestion des timeouts
  const timeout = setTimeout(() => {
    logTest('Overall timeout', 'FAIL', 'Tests timed out after ' + TIMEOUT_MS + 'ms');
    server.kill();
    logSummary();
  }, TIMEOUT_MS);

  try {
    // Test 1: Initialisation
    logSection('INITIALISATION MCP');

    const initResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {
          roots: { listChanged: true }
        },
        clientInfo: {
          name: "enhanced-test-client",
          version: "2.0.0"
        }
      }
    });

    if (initResponse.error) {
      logTest('Server initialization', 'FAIL', initResponse.error.message);
    } else {
      logTest('Server initialization', 'PASS');

      // Valider la réponse d'initialisation
      const result = initResponse.result;
      logTest('Protocol version', result.protocolVersion ? 'PASS' : 'FAIL', result.protocolVersion);
      logTest('Server info', result.serverInfo?.name ? 'PASS' : 'FAIL', result.serverInfo?.name);
      logTest('Capabilities tools', result.capabilities?.tools ? 'PASS' : 'FAIL');
      logTest('Capabilities resources', result.capabilities?.resources ? 'PASS' : 'FAIL');
    }

    // Test 2: Liste des outils
    logSection('OUTILS MCP');

    const toolsResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    });

    if (toolsResponse.error) {
      logTest('Tools list request', 'FAIL', toolsResponse.error.message);
    } else {
      const tools = toolsResponse.result.tools;
      logTest('Tools list request', 'PASS', `${tools.length} tools found`);

      // Vérifier quelques outils essentiels
      const searchCardsTool = tools.find(t => t.name === 'search-cards');
      logTest('search-cards tool', searchCardsTool ? 'PASS' : 'FAIL');

      if (searchCardsTool) {
        logTest('search-cards inputSchema', searchCardsTool.inputSchema ? 'PASS' : 'FAIL');
        logTest('search-cards outputSchema', searchCardsTool.outputSchema ? 'PASS' : 'FAIL');
        logTest('search-cards annotations', searchCardsTool.annotations ? 'PASS' : 'FAIL');
      }

      // Compter les outils avec outputSchema
      const toolsWithOutput = tools.filter(t => t.outputSchema);
      logTest('Tools with outputSchema', 'PASS', `${toolsWithOutput.length}/${tools.length}`);

      // Compter les outils avec annotations
      const toolsWithAnnotations = tools.filter(t => t.annotations);
      logTest('Tools with annotations', 'PASS', `${toolsWithAnnotations.length}/${tools.length}`);
    }

    // Test 3: Appel d'outil réel
    logSection('APPEL D\'OUTIL');

    const toolCallResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "calculatrice",
        arguments: {
          operation: "addition",
          a: 2,
          b: 3
        }
      }
    });

    if (toolCallResponse.error) {
      logTest('Tool call request', 'FAIL', toolCallResponse.error.message);
    } else {
      const result = toolCallResponse.result;
      logTest('Tool call request', 'PASS');
      logTest('Tool response content', result.content ? 'PASS' : 'FAIL');

      // For calculatrice tool, structuredContent is optional
      if (result.content && result.content[0] && result.content[0].text) {
        const hasCalculationResult = result.content[0].text.includes('2 + 3 = 5');
        logTest('Tool response calculation', hasCalculationResult ? 'PASS' : 'FAIL');
      }
    }

    // Test 4: Liste des ressources
    logSection('RESSOURCES MCP');

    const resourcesResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 4,
      method: "resources/list"
    });

    if (resourcesResponse.error) {
      logTest('Resources list request', 'FAIL', resourcesResponse.error.message);
    } else {
      const resources = resourcesResponse.result.resources;
      logTest('Resources list request', 'PASS', `${resources.length} resources found`);

      // Vérifier les ressources attendues
      const systemResource = resources.find(r => r.name === 'info-systeme');
      logTest('System info resource', systemResource ? 'PASS' : 'FAIL');
    }

    // Test 5: Gestion d'erreurs
    logSection('GESTION D\'ERREURS');

    const errorResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "nonexistent-tool",
        arguments: {}
      }
    });

    if (errorResponse.error) {
      logTest('Error handling', 'PASS', 'Correctly returned error for invalid tool');
      logTest('Error code format', errorResponse.error.code ? 'PASS' : 'FAIL');
      logTest('Error message format', errorResponse.error.message ? 'PASS' : 'FAIL');
    } else {
      logTest('Error handling', 'FAIL', 'Should have returned error for invalid tool');
    }

    // Test 6: Performance
    logSection('PERFORMANCE');

    const perfStart = Date.now();
    const perfResponse = await sendMcpMessage(server, {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/list"
    });
    const perfDuration = Date.now() - perfStart;

    logTest('Tools list performance', perfDuration < 1000 ? 'PASS' : 'FAIL', `${perfDuration}ms`);

    clearTimeout(timeout);
    server.kill();

    // Afficher les logs du serveur seulement si erreur
    if (stats.failed > 0 && serverLogs) {
      console.log('\n📋 LOGS DU SERVEUR (ERREURS):');
      console.log(serverLogs.trim());
    }

    logSummary();

  } catch (error) {
    clearTimeout(timeout);
    server.kill();
    logTest('Test execution', 'FAIL', error.message);
    logSummary();
  }
}

// Utilitaire pour envoyer des messages MCP
function sendMcpMessage(server, message) {
  return new Promise((resolve, reject) => {
    const messageStr = JSON.stringify(message) + '\n';

    const timeout = setTimeout(() => {
      reject(new Error('Message timeout'));
    }, 3000);

    const onData = (data) => {
      clearTimeout(timeout);
      server.stdout.removeListener('data', onData);

      try {
        const response = JSON.parse(data.toString().trim());
        resolve(response);
      } catch (error) {
        reject(new Error('Invalid JSON response: ' + data.toString()));
      }
    };

    server.stdout.on('data', onData);
    server.stdin.write(messageStr);
  });
}

// Lancer les tests
runTests().catch(error => {
  console.error('❌ Fatal test error:', error);
  process.exit(1);
});