// User tools

import type { EnhancedNotionClient } from '../notion-client.js';

export function createUserTools(client: EnhancedNotionClient) {
  return {
    list_users: {
      description: 'List all users in the workspace',
      inputSchema: {
        type: 'object',
        properties: {
          start_cursor: {
            type: 'string',
            description: 'Pagination cursor',
          },
          page_size: {
            type: 'number',
            description: 'Results per page (max 100)',
          },
        },
      },
      handler: async (args: { start_cursor?: string; page_size?: number }) => {
        const response = await client.listUsers(args.start_cursor, args.page_size);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },

    get_user: {
      description: 'Get information about a specific user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            description: 'The user ID',
          },
        },
        required: ['user_id'],
      },
      handler: async (args: { user_id: string }) => {
        const response = await client.getUser(args.user_id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },

    get_self: {
      description: 'Get information about the bot user and workspace',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const response = await client.getBot();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },
  };
}
