#!/usr/bin/env node

/**
 * Script de test simple pour vérifier que le serveur MCP fonctionne
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le serveur compilé
const serverPath = path.join(__dirname, '..', '..', 'dist', 'index.js');

console.log('🧪 Test du serveur MCP...');
console.log(`📁 Chemin du serveur: ${serverPath}`);

// Lancer le serveur
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Message d'initialisation MCP
const initMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    capabilities: {
      roots: {
        listChanged: true
      }
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

// Envoyer le message d'initialisation
console.log('📤 Envoi du message d\'initialisation...');
server.stdin.write(JSON.stringify(initMessage) + '\n');

// Écouter les réponses
server.stdout.on('data', (data) => {
  const response = data.toString();
  try {
    const parsed = JSON.parse(response);
    if (parsed.result && parsed.result.serverInfo) {
      console.log(`✅ Serveur connecté: ${parsed.result.serverInfo.name} v${parsed.result.serverInfo.version}`);
    } else if (parsed.error) {
      console.log(`❌ Erreur: ${parsed.error.message}`);
      console.log('📥 Réponse complète:');
      console.log(response);
    }
  } catch (e) {
    console.log('📥 Réponse non-JSON:');
    console.log(response);
  }
});

// Écouter les logs serveur (simplifié)
server.stderr.on('data', (data) => {
  const log = data.toString().trim();
  if (log.includes('Serveur MCP') || log.includes('Server started')) {
    console.log('🚀 Serveur MCP démarré avec succès');
  } else if (log.includes('error') || log.includes('Error')) {
    console.log('❌ Erreur serveur:', log);
  }
  // Autres logs ignorés pour la lisibilité
});

// Gérer la fermeture
server.on('close', (code) => {
  console.log(`🔚 Serveur fermé avec le code: ${code}`);
});

// Fermer le test après 3 secondes
setTimeout(() => {
  console.log('⏰ Fin du test, fermeture du serveur...');
  server.kill();
}, 3000);