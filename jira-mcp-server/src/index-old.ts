#!/usr/bin/env node
/**
 * Jira MCP Server
 * Model Context Protocol server for Jira integration
 *
 * Features:
 * - Search and get issues
 * - Create and update issues
 * - Change issue status
 * - Add comments
 * - Get projects and boards
 * - User management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { Version3Client } from 'jira.js';

// Load environment variables
dotenv.config();

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Available projects
const AVAILABLE_PROJECTS = [
  'AD',    // OLD SaaS / Portal
  'AN',    // Business Process Automation
  'PROD',  // PORTAL/SAAS
  'TEST',  // Test + Prod
  'TRIAL', // Trial
];

if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Error: JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN are required');
  process.exit(1);
}

// Initialize Jira client
const jira = new Version3Client({
  host: `https://${JIRA_HOST}`,
  authentication: {
    basic: {
      email: JIRA_EMAIL,
      apiToken: JIRA_API_TOKEN,
    },
  },
});

// Create MCP server
const server = new Server(
  {
    name: 'jira-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools = [
  {
    name: 'jira_search_issues',
    description: 'Search Jira issues using JQL (Jira Query Language)',
    inputSchema: {
      type: 'object',
      properties: {
        jql: {
          type: 'string',
          description: 'JQL query string (e.g., "assignee = currentUser() AND status != Done")',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results (default: 50)',
          default: 50,
        },
      },
      required: ['jql'],
    },
  },
  {
    name: 'jira_get_issue',
    description: 'Get details of a specific Jira issue by key',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROD-123")',
        },
      },
      required: ['issueKey'],
    },
  },
  {
    name: 'jira_create_issue',
    description: 'Create a new Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Project key. Available projects: AD (OLD SaaS/Portal), AN (Business Process Automation), PROD (PORTAL/SAAS), TEST (Test + Prod), TRIAL (Trial)',
        },
        summary: {
          type: 'string',
          description: 'Issue summary/title',
        },
        description: {
          type: 'string',
          description: 'Issue description',
        },
        issueType: {
          type: 'string',
          description: 'Issue type (Task, Bug, Story, etc.)',
          default: 'Task',
        },
        priority: {
          type: 'string',
          description: 'Priority (Highest, High, Medium, Low, Lowest)',
        },
      },
      required: ['project', 'summary'],
    },
  },
  {
    name: 'jira_update_issue',
    description: 'Update an existing Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROD-123")',
        },
        summary: {
          type: 'string',
          description: 'New summary',
        },
        description: {
          type: 'string',
          description: 'New description',
        },
        assignee: {
          type: 'string',
          description: 'Assignee email or account ID',
        },
      },
      required: ['issueKey'],
    },
  },
  {
    name: 'jira_transition_issue',
    description: 'Change the status of an issue (transition)',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROD-123")',
        },
        transitionName: {
          type: 'string',
          description: 'Target status/transition name (e.g., "In Progress", "Done")',
        },
      },
      required: ['issueKey', 'transitionName'],
    },
  },
  {
    name: 'jira_add_comment',
    description: 'Add a comment to an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROD-123")',
        },
        comment: {
          type: 'string',
          description: 'Comment text',
        },
      },
      required: ['issueKey', 'comment'],
    },
  },
  {
    name: 'jira_get_projects',
    description: 'Get list of all Jira projects',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'jira_get_transitions',
    description: 'Get available transitions (status changes) for an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Issue key (e.g., "PROD-123")',
        },
      },
      required: ['issueKey'],
    },
  },
  {
    name: 'jira_get_current_user',
    description: 'Get information about the current authenticated user',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'jira_search_issues': {
        const { jql, maxResults = 50 } = args as { jql: string; maxResults?: number };
        // Use the new enhanced search endpoint instead of deprecated searchForIssuesUsingJql
        // The old endpoint /rest/api/3/search was removed (410 Gone)
        // New endpoint: /rest/api/3/search/jql
        const result = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearchPost({
          jql,
          maxResults,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'jira_get_issue': {
        const { issueKey } = args as { issueKey: string };
        const issue = await jira.issues.getIssue({
          issueIdOrKey: issueKey,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      }

      case 'jira_create_issue': {
        const {
          project,
          summary,
          description = '',
          issueType = 'Task',
          priority,
        } = args as {
          project: string;
          summary: string;
          description?: string;
          issueType?: string;
          priority?: string;
        };

        // Validate project
        if (!AVAILABLE_PROJECTS.includes(project)) {
          throw new Error(
            `Invalid project "${project}". Available projects: ${AVAILABLE_PROJECTS.join(', ')}`
          );
        }

        const fields: any = {
          project: { key: project },
          summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: description,
                  },
                ],
              },
            ],
          },
          issuetype: { name: issueType },
        };

        if (priority) {
          fields.priority = { name: priority };
        }

        const result = await jira.issues.createIssue({ fields });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'jira_update_issue': {
        const { issueKey, summary, description, assignee } = args as {
          issueKey: string;
          summary?: string;
          description?: string;
          assignee?: string;
        };

        const fields: any = {};

        if (summary) {
          fields.summary = summary;
        }

        if (description) {
          fields.description = {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: description,
                  },
                ],
              },
            ],
          };
        }

        if (assignee) {
          fields.assignee = { emailAddress: assignee };
        }

        await jira.issues.editIssue({
          issueIdOrKey: issueKey,
          fields,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Issue ${issueKey} updated successfully`,
            },
          ],
        };
      }

      case 'jira_transition_issue': {
        const { issueKey, transitionName } = args as {
          issueKey: string;
          transitionName: string;
        };

        // Get available transitions
        const transitions = await jira.issues.getTransitions({
          issueIdOrKey: issueKey,
        });
        const transition = transitions.transitions?.find(
          (t: any) => t.name.toLowerCase() === transitionName.toLowerCase()
        );

        if (!transition) {
          throw new Error(
            `Transition "${transitionName}" not found. Available: ${transitions.transitions?.map((t: any) => t.name).join(', ')}`
          );
        }

        await jira.issues.doTransition({
          issueIdOrKey: issueKey,
          transition: { id: transition.id },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Issue ${issueKey} transitioned to "${transitionName}"`,
            },
          ],
        };
      }

      case 'jira_add_comment': {
        const { issueKey, comment } = args as {
          issueKey: string;
          comment: string;
        };

        await jira.issueComments.addComment({
          issueIdOrKey: issueKey,
          comment: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: comment,
                  },
                ],
              },
            ],
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: `Comment added to ${issueKey}`,
            },
          ],
        };
      }

      case 'jira_get_projects': {
        const projects = await jira.projects.searchProjects();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      }

      case 'jira_get_transitions': {
        const { issueKey } = args as { issueKey: string };
        const transitions = await jira.issues.getTransitions({
          issueIdOrKey: issueKey,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(transitions, null, 2),
            },
          ],
        };
      }

      case 'jira_get_current_user': {
        const user = await jira.myself.getCurrentUser();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    // Log full error details for debugging
    console.error('Jira API Error:', {
      message: error.message,
      status: error.status || error.statusCode,
      statusText: error.statusText,
      response: error.response?.data || error.response,
      stack: error.stack
    });

    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\nStatus: ${error.status || error.statusCode || 'unknown'}\nDetails: ${JSON.stringify(error.response?.data || error.response || {}, null, 2)}`,
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
  console.error('Jira MCP Server running on stdio');
  console.error(`Connected to: ${JIRA_HOST}`);
  console.error(`Available projects: ${AVAILABLE_PROJECTS.join(', ')}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
