/**
 * Enhanced Issue Management with Sprint/Board Support
 *
 * Extended create_issue function that automatically adds issues to sprints/boards.
 */

import { Version3Client } from 'jira.js';
import axios from 'axios';

interface IssueConfig {
  jira: Version3Client;
  jiraHost: string;
  jiraEmail: string;
  jiraApiToken: string;
  availableProjects: string[];
}

/**
 * Helper function to make Agile API requests
 */
async function agileApiRequest(
  config: IssueConfig,
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
 * Get active sprint for a board
 */
async function getActiveSprint(config: IssueConfig, boardId: number) {
  const sprints = await agileApiRequest(config, 'GET', `/board/${boardId}/sprint?state=active`);

  if (sprints.values && sprints.values.length > 0) {
    return sprints.values[0];
  }

  return null;
}

/**
 * Add issues to a sprint
 */
async function addIssuesToSprint(config: IssueConfig, sprintId: number, issueKeys: string[]) {
  await agileApiRequest(config, 'POST', `/sprint/${sprintId}/issue`, {
    issues: issueKeys,
  });
}

/**
 * Tool: jira_create_issue (enhanced)
 * Create a new issue with automatic sprint/board assignment
 */
export async function createIssueEnhanced(config: IssueConfig, args: {
  project: string;
  summary: string;
  description?: string;
  issueType?: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  components?: string[];
  sprintId?: number;
  boardId?: number;
  epicKey?: string;
}) {
  const {
    project,
    summary,
    description = '',
    issueType = 'Task',
    priority,
    assignee,
    labels,
    components,
    sprintId,
    boardId,
    epicKey,
  } = args;

  // Validate project
  if (!config.availableProjects.includes(project)) {
    throw new Error(
      `Invalid project "${project}". Available projects: ${config.availableProjects.join(', ')}`
    );
  }

  // Build fields object
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

  if (assignee) {
    fields.assignee = { emailAddress: assignee };
  }

  if (labels && labels.length > 0) {
    fields.labels = labels;
  }

  if (components && components.length > 0) {
    fields.components = components.map(name => ({ name }));
  }

  if (epicKey) {
    // Epic Link custom field (may vary by Jira instance)
    fields.customfield_10014 = epicKey;
  }

  // Create the issue
  const result = await config.jira.issues.createIssue({ fields });
  const issueKey = result.key;

  // Handle sprint assignment
  let sprintInfo = null;

  if (sprintId) {
    // Directly add to specified sprint
    await addIssuesToSprint(config, sprintId, [issueKey]);
    sprintInfo = { sprintId, method: 'direct' };
  } else if (boardId) {
    // Find active sprint on board and add to it
    const activeSprint = await getActiveSprint(config, boardId);

    if (activeSprint) {
      await addIssuesToSprint(config, activeSprint.id, [issueKey]);
      sprintInfo = {
        sprintId: activeSprint.id,
        sprintName: activeSprint.name,
        method: 'auto-active',
      };
    } else {
      sprintInfo = {
        method: 'no-active-sprint',
        message: `No active sprint found on board ${boardId}`,
      };
    }
  }

  return {
    ...result,
    sprint: sprintInfo,
  };
}

// Tool definition for MCP server
export const enhancedIssueTool = {
  name: 'jira_create_issue',
  description: 'Create a new Jira issue with optional automatic sprint/board assignment',
  inputSchema: {
    type: 'object',
    properties: {
      project: {
        type: 'string',
        description: 'Project key (e.g., "PROD")',
      },
      summary: {
        type: 'string',
        description: 'Issue summary/title',
      },
      description: {
        type: 'string',
        description: 'Issue description (optional)',
      },
      issueType: {
        type: 'string',
        description: 'Issue type: Task, Bug, Story, Epic (default: Task)',
        default: 'Task',
      },
      priority: {
        type: 'string',
        description: 'Priority: Highest, High, Medium, Low, Lowest',
      },
      assignee: {
        type: 'string',
        description: 'Assignee email address',
      },
      labels: {
        type: 'array',
        description: 'Array of label strings',
        items: {
          type: 'string',
        },
      },
      components: {
        type: 'array',
        description: 'Array of component names',
        items: {
          type: 'string',
        },
      },
      sprintId: {
        type: 'number',
        description: 'Sprint ID to add issue to (optional)',
      },
      boardId: {
        type: 'number',
        description: 'Board ID - will add to active sprint on this board (optional)',
      },
      epicKey: {
        type: 'string',
        description: 'Parent epic key (e.g., "PROD-100")',
      },
    },
    required: ['project', 'summary'],
  },
};
