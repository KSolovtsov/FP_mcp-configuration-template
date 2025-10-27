// Block tools

import type { EnhancedNotionClient } from '../notion-client.js';

export function createBlockTools(client: EnhancedNotionClient) {
  return {
    get_block: {
      description: 'Get information about a block',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The ID of the block',
          },
        },
        required: ['block_id'],
      },
      handler: async (args: { block_id: string }) => {
        const response = await client.getBlock(args.block_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },

    get_block_children: {
      description: 'Get child blocks of a block or page',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The block or page ID',
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
        required: ['block_id'],
      },
      handler: async (args: { block_id: string; start_cursor?: string; page_size?: number }) => {
        const response = await client.getBlockChildren(
          args.block_id,
          args.start_cursor,
          args.page_size
        );
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },

    append_blocks: {
      description: 'Add blocks to a page or block',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The parent block or page ID',
          },
          children: {
            type: 'array',
            description: 'Array of block objects to add',
          },
        },
        required: ['block_id', 'children'],
      },
      handler: async (args: { block_id: string; children: any[] }) => {
        const response = await client.appendBlocks(args.block_id, args.children);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },

    append_rich_content: {
      description: 'Helper to easily add formatted content (paragraph, heading, list, code, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The parent block or page ID',
          },
          content_type: {
            type: 'string',
            description: 'Type of content',
            enum: [
              'paragraph',
              'heading_1',
              'heading_2',
              'heading_3',
              'bulleted_list_item',
              'numbered_list_item',
              'to_do',
              'code',
              'quote',
              'callout',
            ],
          },
          text: {
            type: 'string',
            description: 'The text content',
          },
          options: {
            type: 'object',
            description: 'Additional options (e.g., language for code, checked for to_do)',
          },
        },
        required: ['block_id', 'content_type', 'text'],
      },
      handler: async (args: {
        block_id: string;
        content_type: string;
        text: string;
        options?: any;
      }) => {
        const richText = client.buildRichText(args.text);
        let block: any;

        switch (args.content_type) {
          case 'paragraph':
            block = { type: 'paragraph', paragraph: { rich_text: richText } };
            break;
          case 'heading_1':
            block = { type: 'heading_1', heading_1: { rich_text: richText } };
            break;
          case 'heading_2':
            block = { type: 'heading_2', heading_2: { rich_text: richText } };
            break;
          case 'heading_3':
            block = { type: 'heading_3', heading_3: { rich_text: richText } };
            break;
          case 'bulleted_list_item':
            block = { type: 'bulleted_list_item', bulleted_list_item: { rich_text: richText } };
            break;
          case 'numbered_list_item':
            block = { type: 'numbered_list_item', numbered_list_item: { rich_text: richText } };
            break;
          case 'to_do':
            block = {
              type: 'to_do',
              to_do: { rich_text: richText, checked: args.options?.checked || false },
            };
            break;
          case 'code':
            block = {
              type: 'code',
              code: {
                rich_text: richText,
                language: args.options?.language || 'plain text',
              },
            };
            break;
          case 'quote':
            block = { type: 'quote', quote: { rich_text: richText } };
            break;
          case 'callout':
            block = {
              type: 'callout',
              callout: {
                rich_text: richText,
                icon: args.options?.icon || { type: 'emoji', emoji: '💡' },
              },
            };
            break;
          default:
            throw new Error(`Unsupported content type: ${args.content_type}`);
        }

        const response = await client.appendBlocks(args.block_id, [block]);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },

    update_block: {
      description: 'Update block content',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The block ID',
          },
          content: {
            type: 'object',
            description: 'New block content',
          },
        },
        required: ['block_id', 'content'],
      },
      handler: async (args: { block_id: string; content: any }) => {
        const response = await client.updateBlock(args.block_id, args.content);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },

    delete_block: {
      description: 'Delete a block',
      inputSchema: {
        type: 'object',
        properties: {
          block_id: {
            type: 'string',
            description: 'The block ID to delete',
          },
        },
        required: ['block_id'],
      },
      handler: async (args: { block_id: string }) => {
        const response = await client.deleteBlock(args.block_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },
  };
}
