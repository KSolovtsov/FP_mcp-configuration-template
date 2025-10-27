#!/usr/bin/env node

/**
 * Enhanced Notion MCP Server
 * Full-featured Model Context Protocol server for Notion API
 *
 * Features:
 * - Working query_database with filters and sorting
 * - Full CRUD operations for pages, databases, and blocks
 * - Comments support
 * - User management
 * - Search functionality
 * - Emoji support
 * - Batch operations
 * - Rich content helpers
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';

import { EnhancedNotionClient } from './notion-client.js';
import { createSearchTools } from './tools/search.js';
import { createPageTools } from './tools/pages.js';
import { createDatabaseTools } from './tools/databases.js';
import { createBlockTools } from './tools/blocks.js';
import { createCommentTools } from './tools/comments.js';
import { createUserTools } from './tools/users.js';

// Load environment variables
dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;

if (!NOTION_API_KEY) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize Notion client
const notionClient = new EnhancedNotionClient(NOTION_API_KEY);

// Create MCP server
const server = new Server(
  {
    name: 'notion-mcp-enhanced',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Collect all tools
const allTools = {
  ...createSearchTools(notionClient),
  ...createPageTools(notionClient),
  ...createDatabaseTools(notionClient),
  ...createBlockTools(notionClient),
  ...createCommentTools(notionClient),
  ...createUserTools(notionClient),
};

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(allTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = allTools[toolName as keyof typeof allTools];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    return await tool.handler((request.params.arguments || {}) as any);
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\n\nStack: ${error.stack}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Enhanced Notion MCP Server running on stdio');
  console.error('Available tools:', Object.keys(allTools).length);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
