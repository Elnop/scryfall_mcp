#!/usr/bin/env node

/**
 * Utilitaires partagés pour tous les tests
 */

import { spawn } from 'child_process';
import config from './test-config.mjs';

class TestHelpers {
  /**
   * Lance un serveur MCP et retourne une promesse avec le processus
   * @param {string} serverPath - Chemin vers le serveur
   * @param {object} options - Options du processus
   * @returns {Promise<object>} - Processus du serveur et helpers
   */
  static async spawnServer(serverPath = config.SERVER_PATH, options = {}) {
    const defaultOptions = {
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    };

    const serverProcess = spawn('node', [serverPath], defaultOptions);

    let serverOutput = '';
    let isReady = false;

    // Collecter les logs stderr
    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      serverOutput += output;

      // Détecter quand le serveur est prêt
      if (output.includes('Serveur MCP Scryfall démarré') || output.includes('Server started')) {
        isReady = true;
      }
    });

    // Attendre que le serveur soit prêt
    const waitForReady = () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout: Server not ready'));
        }, config.DEFAULT_TIMEOUT_MS);

        const checkReady = () => {
          if (isReady) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
    };

    return {
      process: serverProcess,
      output: () => serverOutput,
      waitForReady,
      cleanup: () => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGTERM');
        }
      }
    };
  }

  /**
   * Envoie un message JSON-RPC au serveur et attend la réponse
   * @param {object} serverProcess - Processus du serveur
   * @param {object} message - Message JSON-RPC
   * @param {number} timeout - Timeout en ms
   * @returns {Promise<object>} - Réponse du serveur
   */
  static async sendMessage(serverProcess, message, timeout = config.DEFAULT_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      let response = '';
      let responseReceived = false;

      const timeoutId = setTimeout(() => {
        if (!responseReceived) {
          reject(new Error(`Timeout after ${timeout}ms`));
        }
      }, timeout);

      // Écouter la réponse
      const onData = (data) => {
        response += data.toString();

        // Vérifier si on a une réponse JSON complète
        try {
          const lines = response.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.id === message.id) {
              responseReceived = true;
              clearTimeout(timeoutId);
              serverProcess.stdout.removeListener('data', onData);
              resolve(parsed);
              return;
            }
          }
        } catch (e) {
          // Pas encore une réponse JSON complète, continuer à attendre
        }
      };

      serverProcess.stdout.on('data', onData);

      // Envoyer le message
      const messageStr = JSON.stringify(message) + '\n';
      serverProcess.stdin.write(messageStr);
    });
  }

  /**
   * Affiche un message de test avec couleur
   * @param {string} message - Message à afficher
   * @param {string} type - Type: 'info', 'success', 'error', 'warning'
   */
  static log(message, type = 'info') {
    const { COLORS } = config;
    const colors = {
      info: COLORS.BLUE,
      success: COLORS.GREEN,
      error: COLORS.RED,
      warning: COLORS.YELLOW,
      step: COLORS.CYAN
    };

    const color = colors[type] || COLORS.RESET;
    console.log(`${color}${message}${COLORS.RESET}`);
  }

  /**
   * Valide qu'un objet contient les propriétés requises
   * @param {object} obj - Objet à valider
   * @param {string[]} requiredProps - Propriétés requises
   * @param {string} objName - Nom de l'objet pour les erreurs
   */
  static validateObject(obj, requiredProps, objName = 'object') {
    for (const prop of requiredProps) {
      if (!(prop in obj)) {
        throw new Error(`${objName} manque la propriété requise: ${prop}`);
      }
    }
  }

  /**
   * Valide une réponse MCP standard
   * @param {object} response - Réponse à valider
   */
  static validateMcpResponse(response) {
    this.validateObject(response, ['jsonrpc', 'id'], 'MCP Response');

    if (response.jsonrpc !== '2.0') {
      throw new Error(`Version JSON-RPC invalide: ${response.jsonrpc}`);
    }

    if (response.error) {
      throw new Error(`Erreur MCP: ${response.error.message}`);
    }
  }

  /**
   * Crée un message d'appel d'outil
   * @param {string} toolName - Nom de l'outil
   * @param {object} args - Arguments de l'outil
   * @param {number} id - ID du message
   * @returns {object} - Message JSON-RPC
   */
  static createToolCall(toolName, args = {}, id = Date.now()) {
    return {
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };
  }

  /**
   * Crée un message de lecture de ressource
   * @param {string} uri - URI de la ressource
   * @param {number} id - ID du message
   * @returns {object} - Message JSON-RPC
   */
  static createResourceRead(uri, id = Date.now()) {
    return {
      jsonrpc: "2.0",
      id,
      method: "resources/read",
      params: {
        uri
      }
    };
  }

  /**
   * Attend un délai
   * @param {number} ms - Délai en millisecondes
   */
  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Exécute une fonction avec timeout
   * @param {Function} fn - Fonction à exécuter
   * @param {number} timeout - Timeout en ms
   * @returns {Promise} - Résultat de la fonction ou erreur de timeout
   */
  static async withTimeout(fn, timeout = config.DEFAULT_TIMEOUT_MS) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
      )
    ]);
  }
}

export default TestHelpers;