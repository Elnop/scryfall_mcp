#!/usr/bin/env node

/**
 * Test spécifique d'un appel d'outil avec structuredContent
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testToolCall() {
  console.log('🧪 Test d\'appel d\'outil avec structuredContent...');

  const serverPath = path.join(__dirname, '..', '..', 'dist', 'index.js');
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let serverOutput = '';
  serverProcess.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  try {
    // Initialisation
    const initMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
      }
    };

    serverProcess.stdin.write(JSON.stringify(initMessage) + '\n');

    // Attendre la réponse d'initialisation
    await new Promise((resolve) => {
      const handler = (data) => {
        if (data.toString().trim()) {
          serverProcess.stdout.removeListener('data', handler);
          resolve();
        }
      };
      serverProcess.stdout.on('data', handler);
    });

    // Test d'appel d'outil
    const toolCallMessage = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "get-card-named",
        arguments: {
          name: "Lightning Bolt",
          fuzzy: true
        }
      }
    };

    console.log('📤 Appel d\'outil: get-card-named avec "Lightning Bolt"...');
    serverProcess.stdin.write(JSON.stringify(toolCallMessage) + '\n');

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

    console.log('📥 Réponse reçue');
    const responseObj = JSON.parse(response);

    if (responseObj.error) {
      console.log('❌ Erreur:', responseObj.error.message);
    } else if (responseObj.result) {
      console.log('✅ Succès !');
      console.log('📊 Content présent:', !!responseObj.result.content);
      console.log('📊 StructuredContent présent:', !!responseObj.result.structuredContent);

      if (responseObj.result.structuredContent) {
        console.log('📋 StructuredContent keys:', Object.keys(responseObj.result.structuredContent));
        console.log('🃏 Carte trouvée:', responseObj.result.structuredContent.card?.name);
        console.log('🔍 Type de recherche:', responseObj.result.structuredContent.search_type);
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    console.log('⏰ Fermeture du serveur...');
    serverProcess.kill();

    // Afficher logs seulement si erreur ou mode debug
    if (process.env.DEBUG && serverOutput) {
      console.log('📊 Log du serveur (DEBUG):');
      console.log(serverOutput);
    }
  }
}

testToolCall().catch(console.error);