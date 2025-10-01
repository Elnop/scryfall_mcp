#!/usr/bin/env node

/**
 * Configuration centralisée pour tous les tests
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // Timeouts
  DEFAULT_TIMEOUT_MS: 8000,
  QUICK_TIMEOUT_MS: 5000,
  LONG_TIMEOUT_MS: 15000,

  // Chemins
  SERVER_PATH: path.join(__dirname, '..', '..', 'dist', 'index.js'),
  HTTP_SERVER_PATH: path.join(__dirname, '..', '..', 'dist', 'mcp-http-server.js'),
  ROOT_DIR: path.join(__dirname, '..', '..'),

  // Configuration serveur HTTP
  HTTP_SERVER: {
    HOST: 'localhost',
    PORT: 8080,
    ENDPOINT: 'http://localhost:8080/sse'
  },

  // Messages de test standardisés
  MESSAGES: {
    INITIALIZE: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          roots: { listChanged: true },
          sampling: {}
        },
        clientInfo: {
          name: "test-client",
          version: "1.0.0"
        }
      }
    },
    LIST_TOOLS: {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    },
    LIST_RESOURCES: {
      jsonrpc: "2.0",
      id: 3,
      method: "resources/list"
    }
  },

  // Couleurs pour les logs
  COLORS: {
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m'
  }
};