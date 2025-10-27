// Comment tools

import type { EnhancedNotionClient } from '../notion-client.js';

export function createCommentTools(client: EnhancedNotionClient) {
  return {
    create_comment: {
      description: 'Create a comment on a page',
      inputSchema: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The page ID',
          },
          text: {
            type: 'string',
            description: 'Comment text',
          },
        },
        required: ['page_id', 'text'],
      },
      handler: async (args: { page_id: string; text: string }) => {
        const richText = client.buildRichText(args.text);
        const response = await client.createComment(args.page_id, richText);

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

    get_comments: {
      description: 'Get comments from a page',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The page or block ID',
          },
          start_cursor: {
            type: 'string',
            description: 'Pagination cursor',
          },
        },
        required: ['block_id'],
      },
      handler: async (args: { block_id: string; start_cursor?: string }) => {
        const response = await client.getComments(args.block_id, args.start_cursor);

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
