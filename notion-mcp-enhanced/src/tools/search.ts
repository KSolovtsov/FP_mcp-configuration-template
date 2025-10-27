// Search tools

import type { EnhancedNotionClient } from '../notion-client.js';

export function createSearchTools(client: EnhancedNotionClient) {
  return {
    search_notion: {
      description: 'Search across your Notion workspace',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query',
          },
          filter: {
            type: 'object',
            description: 'Filter by object type (page or database)',
          },
          sort: {
            type: 'object',
            description: 'Sort results by timestamp',
          },
          start_cursor: {
            type: 'string',
            description: 'Pagination cursor',
          },
          page_size: {
            type: 'number',
            description: 'Results per page (max 100)',
          },
        },
        required: ['query'],
      },
      handler: async (args: {
        query: string;
        filter?: any;
        sort?: any;
        start_cursor?: string;
        page_size?: number;
      }) => {
        const response = await client.search(
          args.query,
          args.filter,
          args.sort,
          args.start_cursor,
          args.page_size
        );

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
