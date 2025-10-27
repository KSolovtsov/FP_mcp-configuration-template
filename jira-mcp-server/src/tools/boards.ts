/**
 * Board Management Tools
 *
 * Tools for managing Jira boards (Scrum and Kanban).
 * Uses Jira Agile API v1.0
 */

import { Version3Client } from 'jira.js';
import axios from 'axios';

// Type definitions
interface BoardConfig {
  jira: Version3Client;
  jiraHost: string;
  jiraEmail: string;
  jiraApiToken: string;
}

/**
 * Helper function to make Agile API requests
 * jira.js doesn't fully support Agile API, so we use axios for some endpoints
 */
async function agileApiRequest(
  config: BoardConfig,
  method: string,
  endpoint: string,
  data?: any
) {
  const url = `https://${config.jiraHost}/rest/agile/1.0${endpoint}`;
  const auth = Buffer.from(`${config.jiraEmail}:${config.jiraApiToken}`).toString('base64');

  const response = await axios({
    method,
    url,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    data,
  });

  return response.data;
}

/**
 * Tool: jira_get_boards
 * List all boards, optionally filtered by project
 */
export async function getBoards(config: BoardConfig, args: {
  projectKeyOrId?: string;
  type?: 'scrum' | 'kanban';
  maxResults?: number;
}) {
  const { projectKeyOrId, type, maxResults = 50 } = args;

  let endpoint = `/board?maxResults=${maxResults}`;
  if (projectKeyOrId) {
    endpoint += `&projectKeyOrId=${projectKeyOrId}`;
  }
  if (type) {
    endpoint += `&type=${type}`;
  }

  const result = await agileApiRequest(config, 'GET', endpoint);
  return result;
}

/**
 * Tool: jira_get_board
 * Get details of a specific board
 */
export async function getBoard(config: BoardConfig, args: {
  boardId: number;
}) {
  const { boardId } = args;
  const result = await agileApiRequest(config, 'GET', `/board/${boardId}`);
  return result;
}

/**
 * Tool: jira_get_board_configuration
 * Get board configuration (columns, filters, card layout)
 */
export async function getBoardConfiguration(config: BoardConfig, args: {
  boardId: number;
}) {
  const { boardId } = args;
  const result = await agileApiRequest(config, 'GET', `/board/${boardId}/configuration`);
  return result;
}

/**
 * Tool: jira_get_board_issues
 * Get issues from a board with optional filtering
 */
export async function getBoardIssues(config: BoardConfig, args: {
  boardId: number;
  jql?: string;
  maxResults?: number;
  startAt?: number;
}) {
  const { boardId, jql, maxResults = 50, startAt = 0 } = args;

  let endpoint = `/board/${boardId}/issue?maxResults=${maxResults}&startAt=${startAt}`;
  if (jql) {
    endpoint += `&jql=${encodeURIComponent(jql)}`;
  }

  const result = await agileApiRequest(config, 'GET', endpoint);
  return result;
}

/**
 * Tool: jira_get_board_backlog
 * Get backlog issues for a board
 */
export async function getBoardBacklog(config: BoardConfig, args: {
  boardId: number;
  jql?: string;
  maxResults?: number;
  startAt?: number;
}) {
  const { boardId, jql, maxResults = 50, startAt = 0 } = args;

  let endpoint = `/board/${boardId}/backlog?maxResults=${maxResults}&startAt=${startAt}`;
  if (jql) {
    endpoint += `&jql=${encodeURIComponent(jql)}`;
  }

  const result = await agileApiRequest(config, 'GET', endpoint);
  return result;
}

// Tool definitions for MCP server
export const boardTools = [
  {
    name: 'jira_get_boards',
    description: 'List all boards, optionally filtered by project',
    inputSchema: {
      type: 'object',
      properties: {
        projectKeyOrId: {
          type: 'string',
          description: 'Filter boards by project key or ID (e.g., "PROD")',
        },
        type: {
          type: 'string',
          description: 'Board type: "scrum" or "kanban"',
          enum: ['scrum', 'kanban'],
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results (default: 50)',
          default: 50,
        },
      },
    },
  },
  {
    name: 'jira_get_board',
    description: 'Get details of a specific board',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID (e.g., 268)',
        },
      },
      required: ['boardId'],
    },
  },
  {
    name: 'jira_get_board_configuration',
    description: 'Get board configuration (columns, filters, card layout)',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID',
        },
      },
      required: ['boardId'],
    },
  },
  {
    name: 'jira_get_board_issues',
    description: 'Get issues from a board with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID',
        },
        jql: {
          type: 'string',
          description: 'Additional JQL filter (optional)',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum results (default: 50)',
          default: 50,
        },
        startAt: {
          type: 'number',
          description: 'Pagination offset (default: 0)',
          default: 0,
        },
      },
      required: ['boardId'],
    },
  },
  {
    name: 'jira_get_board_backlog',
    description: 'Get backlog issues for a board',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID',
        },
        jql: {
          type: 'string',
          description: 'Additional JQL filter (optional)',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum results (default: 50)',
          default: 50,
        },
        startAt: {
          type: 'number',
          description: 'Pagination offset (default: 0)',
          default: 0,
        },
      },
      required: ['boardId'],
    },
  },
];
