// =====================================
// MCP JSON-RPC 2.0 ERROR HELPERS
// =====================================

export enum JsonRpcErrorCode {
  // JSON-RPC 2.0 standard errors
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,

  // MCP specific errors (application-defined range)
  CARD_NOT_FOUND = -32001,
  SET_NOT_FOUND = -32002,
  SEARCH_FAILED = -32003,
  API_ERROR = -32004,
  VALIDATION_ERROR = -32005,
  TIMEOUT_ERROR = -32006,
  RATE_LIMIT_ERROR = -32007,
  NETWORK_ERROR = -32008
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface McpErrorContent {
  [x: string]: unknown;
  content: [{
    type: "text";
    text: string;
  }];
  isError?: boolean;
}

export class McpErrorHelper {
  static createError(
    code: JsonRpcErrorCode,
    message: string,
    data?: unknown
  ): McpErrorContent {
    const errorIcon = this.getErrorIcon(code);
    const formattedMessage = `${errorIcon} ${message}`;

    let debugInfo = "";
    if (data && process.env.NODE_ENV === 'development') {
      debugInfo = `\n\nDétails techniques: ${JSON.stringify(data, null, 2)}`;
    }

    return {
      content: [{
        type: "text",
        text: `${formattedMessage}${debugInfo}`
      }],
      isError: true
    };
  }

  static cardNotFound(cardName: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.CARD_NOT_FOUND,
      `Carte "${cardName}" non trouvée`,
      { cardName, ...(details && typeof details === 'object' ? details as any : {}) }
    );
  }

  static setNotFound(setCode: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.SET_NOT_FOUND,
      `Extension "${setCode}" non trouvée`,
      { setCode, ...(details && typeof details === 'object' ? details as any : {}) }
    );
  }

  static searchFailed(query: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.SEARCH_FAILED,
      `Échec de la recherche pour "${query}"`,
      { query, ...(details && typeof details === 'object' ? details as any : {}) }
    );
  }

  static apiError(message: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.API_ERROR,
      `Erreur API Scryfall: ${message}`,
      details ? { ...details as any } : undefined
    );
  }

  static validationError(message: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.VALIDATION_ERROR,
      `Erreur de validation: ${message}`,
      details ? { ...details as any } : undefined
    );
  }

  static networkError(message: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.NETWORK_ERROR,
      `Erreur réseau: ${message}`,
      details ? { ...details as any } : undefined
    );
  }

  static rateLimitError(details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.RATE_LIMIT_ERROR,
      "Limite de taux API atteinte, veuillez réessayer plus tard",
      details
    );
  }

  static internalError(message: string, details?: unknown): McpErrorContent {
    return this.createError(
      JsonRpcErrorCode.INTERNAL_ERROR,
      `Erreur interne: ${message}`,
      details
    );
  }

  static fromError(error: unknown, context?: string): McpErrorContent {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not found') || message.includes('404')) {
        return this.createError(
          JsonRpcErrorCode.CARD_NOT_FOUND,
          error.message,
          { context, stack: error.stack }
        );
      }

      if (message.includes('rate limit') || message.includes('429')) {
        return this.rateLimitError({ context, originalError: error.message });
      }

      if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
        return this.networkError(error.message, { context, stack: error.stack });
      }

      if (message.includes('validation') || message.includes('invalid')) {
        return this.validationError(error.message, { context });
      }

      return this.internalError(error.message, { context, stack: error.stack });
    }

    return this.internalError(
      `Erreur inattendue: ${String(error)}`,
      { context, originalError: error }
    );
  }

  private static getErrorIcon(code: JsonRpcErrorCode): string {
    switch (code) {
      case JsonRpcErrorCode.CARD_NOT_FOUND:
      case JsonRpcErrorCode.SET_NOT_FOUND:
        return "🔍";
      case JsonRpcErrorCode.SEARCH_FAILED:
        return "❌";
      case JsonRpcErrorCode.API_ERROR:
        return "🌐";
      case JsonRpcErrorCode.VALIDATION_ERROR:
        return "⚠️";
      case JsonRpcErrorCode.NETWORK_ERROR:
        return "📡";
      case JsonRpcErrorCode.RATE_LIMIT_ERROR:
        return "⏱️";
      case JsonRpcErrorCode.TIMEOUT_ERROR:
        return "⏰";
      default:
        return "❌";
    }
  }
}
