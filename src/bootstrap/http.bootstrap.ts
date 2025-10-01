// =====================================
// HTTP BOOTSTRAP (StreamableHTTP)
// Initialize MCP server with StreamableHTTP transport
// Standard MCP 2025-03-26
// =====================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { registerAllTools } from "./tool-registry.js";

export interface HttpServerConfig {
  app: express.Application;
  server: McpServer;
  port: number;
}

export async function bootstrapHttpServer(port: number = 8080): Promise<HttpServerConfig> {
  // Create MCP server
  const server = new McpServer({
    name: "scryfall-mcp-server-http",
    version: "2.0.0"
  });

  // Register all tools from new architecture
  await registerAllTools(server);

  // TODO: Register resources
  // await registerAllResources(server);

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Create StreamableHTTP transport (MCP 2025 standard)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('<� MCP Session initialized:', sessionId);
      }
    },
    onsessionclosed: (sessionId: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('= MCP Session closed:', sessionId);
      }
    }
  });

  // Connect server to transport
  await server.connect(transport);

  // MCP endpoint handler
  const handleMCP = async (req: Request, res: Response) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.error(`= MCP request: ${req.method} ${req.path}`);
      }
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('L MCP error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'MCP request failed' });
      }
    }
  };

  // Routes
  app.get('/mcp', handleMCP);
  app.post('/mcp', handleMCP);
  app.delete('/mcp', handleMCP);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      server: 'scryfall-mcp-server',
      version: '2.0.0',
      transport: 'StreamableHTTP (MCP 2025-03-26)',
      timestamp: new Date().toISOString(),
      endpoints: {
        mcp: '/mcp',
        health: '/health'
      }
    });
  });

  // Root endpoint with info
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Scryfall MCP Server',
      version: '2.0.0',
      description: 'Model Context Protocol server for Magic: The Gathering data',
      transport: 'StreamableHTTP (MCP SDK 2025-03-26)',
      tools: 32,
      features: ['cards', 'sets', 'rulings', 'catalogs', 'generic'],
      endpoints: {
        mcp: `http://localhost:${port}/mcp`,
        health: `http://localhost:${port}/health`
      },
      usage: {
        inspector: `npx @modelcontextprotocol/inspector http://localhost:${port}/mcp`,
        client: 'Connect via StreamableHTTP transport to /mcp endpoint'
      }
    });
  });

  return { app, server, port };
}
