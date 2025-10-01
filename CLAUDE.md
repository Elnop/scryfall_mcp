# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run dev` - Run development server with tsx (stdio transport)
- `npm run dev:http` - Run development HTTP server with SSE transport
- `npm start` - Run compiled stdio server from dist/
- `npm start:http` - Run compiled HTTP server from dist/

### Testing
- `npm test` - Run all test suites (integration + MCP compliance)
- `npm run test:inspector` - Interactive testing with MCP inspector (stdio)
- `npm run test:inspector:http` - Interactive testing with MCP inspector (HTTP)

#### Test Organization
Tests are organized in the `tests/` directory:
- `tests/integration/` - Integration tests for server functionality
- `tests/mcp/` - MCP protocol-specific tests
- `tests/utils/` - Shared test utilities and configuration
- `tests/unit/` - Unit tests (reserved for future use)

The `npm test` command runs all tests in sequence:
1. Basic server functionality test
2. Enhanced server test with full feature coverage
3. MCP protocol compliance test
4. Tool call functionality test

### HTTP Server Testing
The HTTP server runs on port 8080 by default with SSE (Server-Sent Events) transport. Use these for testing HTTP transport:
- `npm run dev:http` then `npm run test:inspector:http`
- Server endpoint: `http://localhost:8080/sse`

## Architecture Overview

### Core Structure
This is a **Model Context Protocol (MCP) server** that provides Magic: The Gathering data via the Scryfall API. The server supports both **stdio** (for Claude Desktop) and **HTTP/SSE** transports.

### Key Components

#### Transport Layers
- **stdio**: Main transport for Claude Desktop integration (`src/index.ts`)
- **HTTP/SSE**: Web-compatible transport for browser/web clients (`src/mcp-http-server.ts`, `src/index-http.ts`)

#### Service Architecture
The codebase follows a modular service pattern:
- `src/services/cards.ts` - Card search, retrieval, and autocomplete (4 main + 4 raw tools)
- `src/services/sets.ts` - MTG set/expansion data (4 tools)
- `src/services/rulings.ts` - Official card rulings (3 tools)
- `src/services/catalogs.ts` - MTG game data catalogs (16 tools)

#### Core Libraries
- `src/lib/scryfall.ts` - Ultra-optimized Scryfall API client with caching, rate limiting, and deduplication
- `src/lib/mcp-errors.ts` - JSON-RPC 2.0 compliant error handling
- `src/lib/capabilities.ts` - MCP capabilities management
- `src/schemas/zod-schemas.ts` - Strict input/output validation with Zod

### Tool Categories (33 total)
1. **Cards** (8 tools): Both formatted and raw JSON responses for search, named lookup, random cards, autocomplete
2. **Sets** (4 tools): MTG set/expansion information and search
3. **Rulings** (3 tools): Official card rulings by name, ID, or set+collector number
4. **Catalogs** (16 tools): All MTG game data (creature types, keywords, artists, etc.)
5. **Generic** (2 tools): Calculator and system metrics

### MCP Resources (3 dynamic)
- `info://systeme` - Server information and statistics
- `scryfall://{categorie}` - Documentation by category (cards, sets, rulings, catalogs, syntaxe)
- `quick://{query}` - Quick card search with preview (5 results)

### API Integration
- **Scryfall API**: Full integration with comprehensive Magic: The Gathering database
- **Optimizations**: Request caching, rate limiting, request deduplication for performance
- **Error Handling**: Graceful fallbacks and MCP-compliant error responses

### Configuration Files
- `tsconfig.json` - TypeScript configuration (ES2022, CommonJS, strict mode)
- `package.json` - Dependencies: @modelcontextprotocol/sdk, express, zod, cors, helmet
- No linting configuration detected - no `npm run lint` or `npm run typecheck` commands available

### Documentation
- `DOCUMENTATION.md` - Comprehensive French documentation with 28 Scryfall tools + usage examples
- Server supports both French and English, with tools primarily documented in French

## Development Notes

### Code Style
- TypeScript with strict mode enabled
- Modular service architecture with clear separation of concerns
- MCP SDK v1.18.0 for protocol compliance
- Zod schemas for runtime validation
- Express.js for HTTP transport with CORS and security headers

### Testing Strategy
The project includes multiple test files:
- Basic functionality testing
- Enhanced test suite with comprehensive coverage
- MCP compliance testing
- HTTP transport testing
- Tool call testing

### Transport Support
- **Primary**: stdio transport for Claude Desktop integration
- **Secondary**: HTTP/SSE transport for web applications and testing
- Both transports expose identical tool and resource sets