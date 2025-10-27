// Page tools

import type { EnhancedNotionClient } from '../notion-client.js';

export function createPageTools(client: EnhancedNotionClient) {
  return {
    get_page_content: {
      description: 'Get the content of a Notion page by its ID',
      inputSchema: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The ID of the page',
          },
        },
        required: ['page_id'],
      },
      handler: async (args: { page_id: string }) => {
        const page = await client.getPage(args.page_id);
        const blocks = await client.getBlockChildren(args.page_id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ page, blocks }, null, 2),
            },
          ],
        };
      },
    },

    create_page: {
      description: 'Create a new Notion page',
      inputSchema: {
        type: 'object',
        properties: {
          parent_page_id: {
            type: 'string',
            description: 'Parent page ID (use this OR parent_database_id)',
          },
          parent_database_id: {
            type: 'string',
            description: 'Parent database ID (use this OR parent_page_id)',
          },
          title: {
            type: 'string',
            description: 'The title of the page',
          },
          content: {
            type: 'string',
            description: 'Text content for the page (optional)',
          },
          properties: {
            type: 'object',
            description: 'Page properties (required for database pages)',
          },
          icon: {
            type: 'object',
            description: 'Page icon - emoji or external URL (optional)',
          },
        },
      },
      handler: async (args: {
        parent_page_id?: string;
        parent_database_id?: string;
        title: string;
        content?: string;
        properties?: any;
        icon?: any;
      }) => {
        const parent: any = args.parent_page_id
          ? { type: 'page_id', page_id: args.parent_page_id }
          : { type: 'database_id', database_id: args.parent_database_id };

        const properties: any = args.properties || {
          title: client.buildProperty('title', args.title),
        };

        const children: any[] = [];
        if (args.content) {
          children.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: client.buildRichText(args.content),
            },
          });
        }

        const response = await client.createPage({
          parent,
          properties,
          children: children.length > 0 ? children : undefined,
          icon: args.icon,
        });

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

    update_page: {
      description: 'Update page properties',
      inputSchema: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The ID of the page to update',
          },
          properties: {
            type: 'object',
            description: 'Properties to update',
          },
          archived: {
            type: 'boolean',
            description: 'Archive/restore the page',
          },
          icon: {
            type: 'object',
            description: 'Update icon',
          },
        },
        required: ['page_id'],
      },
      handler: async (args: {
        page_id: string;
        properties?: any;
        archived?: boolean;
        icon?: any;
      }) => {
        const response = await client.updatePage({
          page_id: args.page_id,
          properties: args.properties,
          archived: args.archived,
          icon: args.icon,
        });

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

    delete_page: {
      description: 'Delete (archive) a page',
      inputSchema: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The ID of the page to delete',
          },
        },
        required: ['page_id'],
      },
      handler: async (args: { page_id: string }) => {
        const response = await client.deletePage(args.page_id);
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

    get_page_property: {
      description: 'Get a specific property value from a page',
      inputSchema: {
        type: 'object',
        properties: {
          page_id: {
            type: 'string',
            description: 'The page ID',
          },
          property_id: {
            type: 'string',
            description: 'The property ID',
          },
        },
        required: ['page_id', 'property_id'],
      },
      handler: async (args: { page_id: string; property_id: string }) => {
        const response = await client.getPageProperty(args.page_id, args.property_id);
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

    fetch_by_url: {
      description: 'Fetch Notion content by URL (extracts ID automatically)',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The Notion URL',
          },
        },
        required: ['url'],
      },
      handler: async (args: { url: string }) => {
        const id = client.extractIdFromUrl(args.url);
        if (!id) {
          throw new Error('Invalid Notion URL');
        }

        // Try as page first
        try {
          const page = await client.getPage(id);
          const blocks = await client.getBlockChildren(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ type: 'page', page, blocks }, null, 2),
              },
            ],
          };
        } catch {
          // Try as database
          const database = await client.getDatabase(id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ type: 'database', database }, null, 2),
              },
            ],
          };
        }
      },
    },
  };
}
