// Database tools with full query support

import type { EnhancedNotionClient } from '../notion-client.js';

export function createDatabaseTools(client: EnhancedNotionClient) {
  return {
    list_databases: {
      description: 'List all databases in the workspace',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const response = await client.listDatabases();
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

    get_database: {
      description: 'Get information about a database (structure, properties, title)',
      inputSchema: {
        type: 'object',
        properties: {
          database_id: {
            type: 'string',
            description: 'The ID of the database',
          },
        },
        required: ['database_id'],
      },
      handler: async (args: { database_id: string }) => {
        const response = await client.getDatabase(args.database_id);
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

    query_database: {
      description: `Query a database with filters and sorting - THE KEY FEATURE!

Examples of filters:

1. Filter by people (Assignee):
{
  "property": "Assignee",
  "people": {"contains": "user_id"}
}

2. Filter by status:
{
  "property": "Status",
  "status": {"equals": "In Progress"}
}

3. Combined filters (AND):
{
  "and": [
    {"property": "Assignee", "people": {"contains": "user_id"}},
    {"property": "Status", "status": {"does_not_equal": "Done"}}
  ]
}

4. Combined filters (OR):
{
  "or": [
    {"property": "Priority", "select": {"equals": "High"}},
    {"property": "Priority", "select": {"equals": "Urgent"}}
  ]
}

5. Filter by date:
{
  "property": "Due Date",
  "date": {"next_week": {}}
}

Sorting examples:
[
  {"property": "Priority", "direction": "descending"},
  {"timestamp": "created_time", "direction": "ascending"}
]`,
      inputSchema: {
        type: 'object',
        properties: {
          database_id: {
            type: 'string',
            description: 'The ID of the database to query',
          },
          filter: {
            type: 'object',
            description: 'Filter conditions (optional)',
          },
          sorts: {
            type: 'array',
            description: 'Sort criteria (optional)',
            items: {
              type: 'object',
            },
          },
          start_cursor: {
            type: 'string',
            description: 'Pagination cursor (optional)',
          },
          page_size: {
            type: 'number',
            description: 'Number of results to return (default: 100, max: 100)',
            minimum: 1,
            maximum: 100,
          },
        },
        required: ['database_id'],
      },
      handler: async (args: {
        database_id: string;
        filter?: any;
        sorts?: any[];
        start_cursor?: string;
        page_size?: number;
      }) => {
        const response = await client.queryDatabase({
          database_id: args.database_id,
          filter: args.filter,
          sorts: args.sorts,
          start_cursor: args.start_cursor,
          page_size: args.page_size,
        });

        // Format results with page titles for easier reading
        const results = response.results.map((page: any) => {
          const title =
            page.properties.Name?.title?.[0]?.plain_text ||
            page.properties.Title?.title?.[0]?.plain_text ||
            'Untitled';

          return {
            id: page.id,
            url: page.url,
            title,
            properties: page.properties,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
          };
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  results,
                  has_more: response.has_more,
                  next_cursor: response.next_cursor,
                  total_results: results.length,
                },
                null,
                2
              ),
            },
          ],
        };
      },
    },

    create_database: {
      description: 'Create a new database with specified properties',
      inputSchema: {
        type: 'object',
        properties: {
          parent_page_id: {
            type: 'string',
            description: 'The ID of the parent page',
          },
          title: {
            type: 'string',
            description: 'The title of the database',
          },
          properties: {
            type: 'object',
            description: 'Database property schema',
          },
          icon: {
            type: 'object',
            description: 'Icon for the database (optional, emoji or external URL)',
          },
        },
        required: ['parent_page_id', 'title', 'properties'],
      },
      handler: async (args: {
        parent_page_id: string;
        title: string;
        properties: any;
        icon?: any;
      }) => {
        const response = await client.createDatabase({
          parent: { type: 'page_id', page_id: args.parent_page_id },
          title: client.buildRichText(args.title),
          properties: args.properties,
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

    update_database: {
      description: 'Update database title or properties',
      inputSchema: {
        type: 'object',
        properties: {
          database_id: {
            type: 'string',
            description: 'The ID of the database',
          },
          title: {
            type: 'string',
            description: 'New title (optional)',
          },
          properties: {
            type: 'object',
            description: 'Updated properties (optional)',
          },
          icon: {
            type: 'object',
            description: 'Updated icon (optional)',
          },
        },
        required: ['database_id'],
      },
      handler: async (args: {
        database_id: string;
        title?: string;
        properties?: any;
        icon?: any;
      }) => {
        const updateData: any = {};

        if (args.title) {
          updateData.title = client.buildRichText(args.title);
        }
        if (args.properties) {
          updateData.properties = args.properties;
        }
        if (args.icon) {
          updateData.icon = args.icon;
        }

        const response = await client.updateDatabase(args.database_id, updateData);

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
