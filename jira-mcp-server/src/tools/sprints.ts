/**
 * Sprint Management Tools
 *
 * Tools for managing Jira sprints (create, start, close, add issues).
 * Uses Jira Agile API v1.0
 */

import { Version3Client } from 'jira.js';
import axios from 'axios';

// Type definitions
interface SprintConfig {
  jira: Version3Client;
  jiraHost: string;
  jiraEmail: string;
  jiraApiToken: string;
}

/**
 * Helper function to make Agile API requests
 */
async function agileApiRequest(
  config: SprintConfig,
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
 * Tool: jira_get_board_sprints
 * Get all sprints for a board
 */
export async function getBoardSprints(config: SprintConfig, args: {
  boardId: number;
  state?: 'active' | 'future' | 'closed';
  maxResults?: number;
}) {
  const { boardId, state, maxResults = 50 } = args;

  let endpoint = `/board/${boardId}/sprint?maxResults=${maxResults}`;
  if (state) {
    endpoint += `&state=${state}`;
  }

  const result = await agileApiRequest(config, 'GET', endpoint);
  return result;
}

/**
 * Tool: jira_get_sprint
 * Get details of a specific sprint
 */
export async function getSprint(config: SprintConfig, args: {
  sprintId: number;
}) {
  const { sprintId } = args;
  const result = await agileApiRequest(config, 'GET', `/sprint/${sprintId}`);
  return result;
}

/**
 * Tool: jira_create_sprint
 * Create a new sprint on a board
 */
export async function createSprint(config: SprintConfig, args: {
  boardId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
}) {
  const { boardId, name, startDate, endDate, goal } = args;

  const data: any = {
    name,
    originBoardId: boardId,
  };

  if (startDate) data.startDate = startDate;
  if (endDate) data.endDate = endDate;
  if (goal) data.goal = goal;

  const result = await agileApiRequest(config, 'POST', '/sprint', data);
  return result;
}

/**
 * Tool: jira_update_sprint
 * Update sprint details
 */
export async function updateSprint(config: SprintConfig, args: {
  sprintId: number;
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  state?: 'active' | 'closed' | 'future';
}) {
  const { sprintId, name, goal, startDate, endDate, state } = args;

  const data: any = {};
  if (name) data.name = name;
  if (goal) data.goal = goal;
  if (startDate) data.startDate = startDate;
  if (endDate) data.endDate = endDate;
  if (state) data.state = state;

  const result = await agileApiRequest(config, 'POST', `/sprint/${sprintId}`, data);
  return result;
}

/**
 * Tool: jira_start_sprint
 * Start a sprint (must be in "future" state)
 */
export async function startSprint(config: SprintConfig, args: {
  sprintId: number;
  startDate?: string;
  endDate?: string;
}) {
  const { sprintId, startDate, endDate } = args;

  const data: any = {
    state: 'active',
  };

  if (startDate) data.startDate = startDate;
  if (endDate) data.endDate = endDate;

  const result = await agileApiRequest(config, 'POST', `/sprint/${sprintId}`, data);
  return result;
}

/**
 * Tool: jira_close_sprint
 * Complete/close a sprint
 */
export async function closeSprint(config: SprintConfig, args: {
  sprintId: number;
  moveToBacklog?: boolean;
  moveToSprintId?: number;
}) {
  const { sprintId, moveToBacklog = true, moveToSprintId } = args;

  // First, get incomplete issues
  const sprintIssues = await agileApiRequest(config, 'GET', `/sprint/${sprintId}/issue`);
  const incompleteIssues = sprintIssues.issues?.filter(
    (issue: any) => issue.fields.status.name !== 'Done'
  );

  // Close the sprint
  const data: any = {
    state: 'closed',
  };

  const result = await agileApiRequest(config, 'POST', `/sprint/${sprintId}`, data);

  // Handle incomplete issues
  if (incompleteIssues && incompleteIssues.length > 0) {
    const issueKeys = incompleteIssues.map((i: any) => i.key);

    if (moveToSprintId) {
      // Move to another sprint
      await agileApiRequest(config, 'POST', `/sprint/${moveToSprintId}/issue`, {
        issues: issueKeys,
      });
    } else if (moveToBacklog) {
      // Move to backlog
      await agileApiRequest(config, 'POST', '/backlog/issue', {
        issues: issueKeys,
      });
    }
  }

  return {
    ...result,
    incompleteIssues: incompleteIssues?.length || 0,
    movedTo: moveToSprintId ? 'sprint' : moveToBacklog ? 'backlog' : 'none',
  };
}

/**
 * Tool: jira_get_sprint_issues
 * Get all issues in a sprint
 */
export async function getSprintIssues(config: SprintConfig, args: {
  sprintId: number;
  jql?: string;
  maxResults?: number;
  startAt?: number;
}) {
  const { sprintId, jql, maxResults = 50, startAt = 0 } = args;

  let endpoint = `/sprint/${sprintId}/issue?maxResults=${maxResults}&startAt=${startAt}`;
  if (jql) {
    endpoint += `&jql=${encodeURIComponent(jql)}`;
  }

  const result = await agileApiRequest(config, 'GET', endpoint);
  return result;
}

/**
 * Tool: jira_add_issues_to_sprint
 * Add issues to a sprint
 */
export async function addIssuesToSprint(config: SprintConfig, args: {
  sprintId: number;
  issues: string[];
}) {
  const { sprintId, issues } = args;

  const data = { issues };
  const result = await agileApiRequest(config, 'POST', `/sprint/${sprintId}/issue`, data);
  return { success: true, issuesAdded: issues.length };
}

/**
 * Tool: jira_move_issues_to_backlog
 * Move issues from sprint back to backlog
 */
export async function moveIssuesToBacklog(config: SprintConfig, args: {
  issues: string[];
}) {
  const { issues } = args;

  const data = { issues };
  await agileApiRequest(config, 'POST', '/backlog/issue', data);
  return { success: true, issuesMoved: issues.length };
}

/**
 * Tool: jira_remove_issues_from_sprint
 * Remove issues from sprint (moves to backlog)
 */
export async function removeIssuesFromSprint(config: SprintConfig, args: {
  sprintId: number;
  issues: string[];
}) {
  // Removing from sprint is same as moving to backlog
  return moveIssuesToBacklog(config, args);
}

// Tool definitions for MCP server
export const sprintTools = [
  {
    name: 'jira_get_board_sprints',
    description: 'Get all sprints for a board, optionally filtered by state',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID',
        },
        state: {
          type: 'string',
          description: 'Filter by sprint state: "active", "future", or "closed"',
          enum: ['active', 'future', 'closed'],
        },
        maxResults: {
          type: 'number',
          description: 'Maximum results (default: 50)',
          default: 50,
        },
      },
      required: ['boardId'],
    },
  },
  {
    name: 'jira_get_sprint',
    description: 'Get details of a specific sprint',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
        },
      },
      required: ['sprintId'],
    },
  },
  {
    name: 'jira_create_sprint',
    description: 'Create a new sprint on a board',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Board ID where sprint will be created',
        },
        name: {
          type: 'string',
          description: 'Sprint name (e.g., "Sprint 24")',
        },
        startDate: {
          type: 'string',
          description: 'Start date in ISO 8601 format (optional, e.g., "2025-02-01T10:00:00.000Z")',
        },
        endDate: {
          type: 'string',
          description: 'End date in ISO 8601 format (optional, e.g., "2025-02-15T18:00:00.000Z")',
        },
        goal: {
          type: 'string',
          description: 'Sprint goal (optional)',
        },
      },
      required: ['boardId', 'name'],
    },
  },
  {
    name: 'jira_update_sprint',
    description: 'Update sprint details (name, goal, dates, state)',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
        },
        name: {
          type: 'string',
          description: 'New sprint name',
        },
        goal: {
          type: 'string',
          description: 'New sprint goal',
        },
        startDate: {
          type: 'string',
          description: 'New start date in ISO 8601 format',
        },
        endDate: {
          type: 'string',
          description: 'New end date in ISO 8601 format',
        },
        state: {
          type: 'string',
          description: 'Sprint state: "active", "closed", or "future"',
          enum: ['active', 'closed', 'future'],
        },
      },
      required: ['sprintId'],
    },
  },
  {
    name: 'jira_start_sprint',
    description: 'Start a sprint (changes state from "future" to "active")',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
        },
        startDate: {
          type: 'string',
          description: 'Start date (optional, defaults to now)',
        },
        endDate: {
          type: 'string',
          description: 'End date in ISO 8601 format (required if not set during creation)',
        },
      },
      required: ['sprintId'],
    },
  },
  {
    name: 'jira_close_sprint',
    description: 'Complete/close a sprint and handle incomplete issues',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID to close',
        },
        moveToBacklog: {
          type: 'boolean',
          description: 'Move incomplete issues to backlog (default: true)',
          default: true,
        },
        moveToSprintId: {
          type: 'number',
          description: 'Move incomplete issues to another sprint (optional)',
        },
      },
      required: ['sprintId'],
    },
  },
  {
    name: 'jira_get_sprint_issues',
    description: 'Get all issues in a sprint with optional JQL filtering',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
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
      required: ['sprintId'],
    },
  },
  {
    name: 'jira_add_issues_to_sprint',
    description: 'Add issues to a sprint',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
        },
        issues: {
          type: 'array',
          description: 'Array of issue keys (e.g., ["PROD-123", "PROD-124"])',
          items: {
            type: 'string',
          },
        },
      },
      required: ['sprintId', 'issues'],
    },
  },
  {
    name: 'jira_move_issues_to_backlog',
    description: 'Move issues from sprint to backlog',
    inputSchema: {
      type: 'object',
      properties: {
        issues: {
          type: 'array',
          description: 'Array of issue keys (e.g., ["PROD-123", "PROD-124"])',
          items: {
            type: 'string',
          },
        },
      },
      required: ['issues'],
    },
  },
  {
    name: 'jira_remove_issues_from_sprint',
    description: 'Remove issues from sprint (moves to backlog)',
    inputSchema: {
      type: 'object',
      properties: {
        sprintId: {
          type: 'number',
          description: 'Sprint ID',
        },
        issues: {
          type: 'array',
          description: 'Array of issue keys to remove',
          items: {
            type: 'string',
          },
        },
      },
      required: ['sprintId', 'issues'],
    },
  },
];
