# Notion MCP API Reference

Complete reference for all Notion MCP Server tools (30+ methods).

## Table of Contents

- [Search & Navigation](#search--navigation) (2 tools)
- [Page Management](#page-management) (9 tools)
- [Database Management](#database-management) (5 tools)
- [Block Management](#block-management) (6 tools)
- [Comments](#comments) (2 tools)
- [Users & Teams](#users--teams) (4 tools)
- [Files](#files) (3 tools)
- [Property Helpers](#property-helpers) (4 tools)

---

## Search & Navigation

### search_notion

Search across your Notion workspace with filters.

**Parameters**:
- `query` (string, required): Search query text
- `filter` (object, optional): Filter by object type
  - `value` (string): "page" or "database"
  - `property` (string): "object"
- `sort` (object, optional): Sort results
  - `direction` (string): "ascending" or "descending"
  - `timestamp` (string): "last_edited_time"
- `page_size` (number, optional): Results per page (max: 100)
- `start_cursor` (string, optional): Pagination cursor

**Example**:
```javascript
// Search for pages
await mcp__notion__search_notion({
  query: "project",
  filter: {
    value: "page",
    property: "object"
  },
  page_size: 10
});

// Search for databases
await mcp__notion__search_notion({
  query: "tasks",
  filter: {
    value: "database",
    property: "object"
  }
});
```

**Response**:
```json
{
  "results": [
    {
      "id": "abc123...",
      "object": "page",
      "created_time": "2025-01-15T...",
      "last_edited_time": "2025-10-28T...",
      "properties": {...}
    }
  ],
  "has_more": true,
  "next_cursor": "def456..."
}
```

---

### fetch_by_url

Fetch Notion content by URL (automatically extracts ID).

**Parameters**:
- `url` (string, required): Full Notion URL

**Example**:
```javascript
await mcp__notion__fetch_by_url({
  url: "https://www.notion.so/My-Page-abc123def456"
});
```

---

## Page Management

### get_page_content

Get the content of a Notion page by its ID.

**Parameters**:
- `page_id` (string, required): Page ID

**Example**:
```javascript
await mcp__notion__get_page_content({
  page_id: "abc123-def456-789..."
});
```

**⚠️ Pagination Warning**:
For pages with many blocks, use `page_size` to avoid token limits:
```javascript
await mcp__notion__get_page_content({
  page_id: "abc123...",
  page_size: 20  // Get only 20 blocks at a time
});
```

---

### create_page

Create a new Notion page.

**Parameters**:
- `title` (string, required): Page title
- `parent_page_id` (string, optional): Parent page ID
- `parent_database_id` (string, optional): Parent database ID (use this OR parent_page_id)
- `properties` (object, optional): Page properties (required for database pages)
- `content` (string, optional): Text content for the page
- `icon` (object, optional): Page icon
  - `type`: "emoji" or "external"
  - `emoji` or `external.url`

**Example - Simple Page**:
```javascript
await mcp__notion__create_page({
  title: "Meeting Notes",
  parent_page_id: "parent123...",
  content: "Discussion points from today's meeting"
});
```

**Example - Database Entry with Emoji**:
```javascript
await mcp__notion__create_page({
  title: "🚀 Launch New Feature",
  parent_database_id: "db123...",
  properties: {
    "Status": {
      "status": {"name": "In Progress"}
    },
    "Assignee": {
      "people": [{"id": "user123..."}]
    },
    "Priority": {
      "select": {"name": "High"}
    },
    "Due Date": {
      "date": {"start": "2025-11-01"}
    }
  },
  icon: {
    "type": "emoji",
    "emoji": "🚀"
  }
});
```

---

### create_pages_batch

Create multiple pages at once (batch operation).

**Parameters**:
- `pages` (array, required): Array of page objects (same format as create_page)

**Example**:
```javascript
await mcp__notion__create_pages_batch({
  pages: [
    {
      title: "Task 1",
      parent_database_id: "db123...",
      properties: {"Status": {"status": {"name": "To Do"}}}
    },
    {
      title: "Task 2",
      parent_database_id: "db123...",
      properties: {"Status": {"status": {"name": "To Do"}}}
    }
  ]
});
```

---

### update_page

Update page properties.

**Parameters**:
- `page_id` (string, required): Page ID
- `properties` (object, optional): Properties to update
- `icon` (object, optional): New icon
- `archived` (boolean, optional): Archive/restore the page

**Example**:
```javascript
await mcp__notion__update_page({
  page_id: "page123...",
  properties: {
    "Status": {
      "status": {"name": "Done"}
    },
    "Progress": {
      "number": 100
    }
  }
});
```

---

### update_pages_batch

Update multiple pages at once.

**Parameters**:
- `pages` (array, required): Array of update objects
  - Each object: `{page_id, properties, icon, archived}`

**Example**:
```javascript
await mcp__notion__update_pages_batch({
  pages: [
    {
      page_id: "page1...",
      properties: {"Status": {"status": {"name": "Done"}}}
    },
    {
      page_id: "page2...",
      properties: {"Status": {"status": {"name": "Done"}}}
    }
  ]
});
```

---

### delete_page

Delete (archive) a page.

**Parameters**:
- `page_id` (string, required): Page ID

**Example**:
```javascript
await mcp__notion__delete_page({
  page_id: "page123..."
});
```

---

### get_page_property

Get a specific property value from a page.

**Parameters**:
- `page_id` (string, required): Page ID
- `property_id` (string, required): Property ID

**Example**:
```javascript
await mcp__notion__get_page_property({
  page_id: "page123...",
  property_id: "prop123..."
});
```

---

### move_pages

Move pages to a different parent.

**Parameters**:
- `page_ids` (array, required): Array of page IDs to move
- `target_parent_id` (string, required): New parent page/database ID

**Example**:
```javascript
await mcp__notion__move_pages({
  page_ids: ["page1...", "page2...", "page3..."],
  target_parent_id: "newparent123..."
});
```

---

### duplicate_page

Duplicate a page.

**Parameters**:
- `page_id` (string, required): Page ID to duplicate

**Example**:
```javascript
await mcp__notion__duplicate_page({
  page_id: "page123..."
});
```

---

## Database Management

### list_databases

List all databases in the workspace.

**Parameters**: None

**Example**:
```javascript
await mcp__notion__list_databases();
```

**Response**:
```json
{
  "results": [
    {
      "id": "db123...",
      "title": [{"text": {"content": "Tasks"}}],
      "properties": {...}
    }
  ]
}
```

---

### get_database

Get information about a database (structure, properties, title).

**Parameters**:
- `database_id` (string, required): Database ID

**Example**:
```javascript
await mcp__notion__get_database({
  database_id: "db123..."
});
```

**Response**: Database object with all properties, their types, and configuration.

---

### query_database

⭐ **Most Important Tool** - Query a database with filters and sorting.

**Parameters**:
- `database_id` (string, required): Database ID
- `filter` (object, optional): Filter conditions (see Filter Examples below)
- `sorts` (array, optional): Sort criteria
- `page_size` (number, optional): Results per page (default: 100, max: 100)
- `start_cursor` (string, optional): Pagination cursor

**⚠️ IMPORTANT - Pagination**:
- For databases with >100 entries, **MUST use pagination**
- Recommended `page_size`: 10-50 to avoid token limits
- Always check `has_more` and use `next_cursor` for next page

**Example - Simple Query**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  page_size: 20
});
```

**Example - Filter by Status**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "property": "Status",
    "status": {"equals": "In Progress"}
  },
  page_size: 20
});
```

**Example - Filter by Assignee (People)**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "property": "Assignee",
    "people": {"contains": "user-id-here"}
  }
});
```

**Example - Combined Filters (AND)**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "and": [
      {"property": "Status", "status": {"does_not_equal": "Done"}},
      {"property": "Priority", "select": {"equals": "High"}},
      {"property": "Assignee", "people": {"contains": "user123..."}}
    ]
  },
  page_size: 20
});
```

**Example - Combined Filters (OR)**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "or": [
      {"property": "Priority", "select": {"equals": "High"}},
      {"property": "Priority", "select": {"equals": "Urgent"}}
    ]
  }
});
```

**Example - Sort Results**:
```javascript
await mcp__notion__query_database({
  database_id: "db123...",
  sorts: [
    {"property": "Priority", "direction": "descending"},
    {"timestamp": "created_time", "direction": "descending"}
  ],
  page_size: 20
});
```

**Example - With Pagination**:
```javascript
// First page
const response1 = await mcp__notion__query_database({
  database_id: "db123...",
  page_size: 20
});

// If there are more results
if (response1.has_more) {
  const response2 = await mcp__notion__query_database({
    database_id: "db123...",
    page_size: 20,
    start_cursor: response1.next_cursor
  });
}
```

---

### create_database

Create a new database with specified properties.

**Parameters**:
- `parent_page_id` (string, required): Parent page ID
- `title` (string, required): Database title
- `properties` (object, required): Database property schema
- `icon` (object, optional): Database icon

**Example**:
```javascript
await mcp__notion__create_database({
  parent_page_id: "page123...",
  title: "Project Tasks",
  properties: {
    "Name": {"title": {}},
    "Status": {
      "status": {
        "options": [
          {"name": "Not started", "color": "gray"},
          {"name": "In Progress", "color": "blue"},
          {"name": "Done", "color": "green"}
        ]
      }
    },
    "Assignee": {"people": {}},
    "Due Date": {"date": {}},
    "Priority": {
      "select": {
        "options": [
          {"name": "Low", "color": "gray"},
          {"name": "Medium", "color": "yellow"},
          {"name": "High", "color": "red"}
        ]
      }
    }
  }
});
```

---

### update_database

Update database title or properties.

**Parameters**:
- `database_id` (string, required): Database ID
- `title` (string, optional): New title
- `properties` (object, optional): Updated properties
- `icon` (object, optional): Updated icon

**Example**:
```javascript
await mcp__notion__update_database({
  database_id: "db123...",
  title: "Updated Project Tasks"
});
```

---

## Block Management

### get_block

Get information about a block.

**Parameters**:
- `block_id` (string, required): Block ID

**Example**:
```javascript
await mcp__notion__get_block({
  block_id: "block123..."
});
```

---

### get_block_children

Get child blocks of a block or page.

**Parameters**:
- `block_id` (string, required): Block or page ID
- `page_size` (number, optional): Results per page (max: 100)
- `start_cursor` (string, optional): Pagination cursor

**Example**:
```javascript
await mcp__notion__get_block_children({
  block_id: "page123...",
  page_size: 50
});
```

**⚠️ Pagination**: For pages with many blocks, use pagination to avoid token limits.

---

### append_blocks

Add blocks to a page or block.

**Parameters**:
- `block_id` (string, required): Parent block or page ID
- `children` (array, required): Array of block objects to add

**Example - Add Paragraphs**:
```javascript
await mcp__notion__append_blocks({
  block_id: "page123...",
  children: [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{"type": "text", "text": {"content": "Hello world"}}]
      }
    },
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{"type": "text", "text": {"content": "Section Title"}}]
      }
    }
  ]
});
```

**Example - Add To-Do List**:
```javascript
await mcp__notion__append_blocks({
  block_id: "page123...",
  children: [
    {
      "object": "block",
      "type": "to_do",
      "to_do": {
        "rich_text": [{"type": "text", "text": {"content": "First task"}}],
        "checked": false
      }
    }
  ]
});
```

---

### append_rich_content

Helper to easily add formatted content (paragraph, heading, list, code, etc.).

**Parameters**:
- `block_id` (string, required): Parent block or page ID
- `content_type` (string, required): Type of content
  - Options: "paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "to_do", "code", "quote", "callout"
- `text` (string, required): The text content
- `options` (object, optional): Additional options
  - `language` (for code blocks): "javascript", "python", "bash", etc.
  - `checked` (for to_do): true/false

**Example - Add Code Block**:
```javascript
await mcp__notion__append_rich_content({
  block_id: "page123...",
  content_type: "code",
  text: "console.log('Hello world');",
  options: {
    language: "javascript"
  }
});
```

**Example - Add To-Do**:
```javascript
await mcp__notion__append_rich_content({
  block_id: "page123...",
  content_type: "to_do",
  text: "Review pull request",
  options: {
    checked: false
  }
});
```

---

### update_block

Update block content.

**Parameters**:
- `block_id` (string, required): Block ID
- `content` (object, required): New block content

**Example**:
```javascript
await mcp__notion__update_block({
  block_id: "block123...",
  content: {
    "paragraph": {
      "rich_text": [{"type": "text", "text": {"content": "Updated text"}}]
    }
  }
});
```

---

### delete_block

Delete a block.

**Parameters**:
- `block_id` (string, required): Block ID to delete

**Example**:
```javascript
await mcp__notion__delete_block({
  block_id: "block123..."
});
```

---

## Comments

### create_comment

Create a comment on a page.

**Parameters**:
- `page_id` (string, required): Page ID
- `text` (string, required): Comment text

**Example**:
```javascript
await mcp__notion__create_comment({
  page_id: "page123...",
  text: "Great work on this! Ready to review."
});
```

---

### get_comments

Get comments from a page.

**Parameters**:
- `block_id` (string, required): Page or block ID
- `start_cursor` (string, optional): Pagination cursor

**Example**:
```javascript
await mcp__notion__get_comments({
  block_id: "page123..."
});
```

---

## Users & Teams

### list_users

List all users in the workspace.

**Parameters**:
- `page_size` (number, optional): Results per page (max: 100)
- `start_cursor` (string, optional): Pagination cursor

**Example**:
```javascript
await mcp__notion__list_users({
  page_size: 50
});
```

**Response**:
```json
{
  "results": [
    {
      "id": "user123...",
      "name": "Kostyantyn Solovtsov",
      "type": "person",
      "person": {
        "email": "kostyantyn@keplercommerce.com"
      }
    }
  ],
  "has_more": false
}
```

---

### get_user

Get information about a specific user.

**Parameters**:
- `user_id` (string, required): User ID

**Example**:
```javascript
await mcp__notion__get_user({
  user_id: "user123..."
});
```

---

### get_self

Get information about the bot user and workspace.

**Parameters**: None

**Example**:
```javascript
await mcp__notion__get_self();
```

**Response**:
```json
{
  "bot": {
    "owner": {
      "type": "workspace",
      "workspace": true
    },
    "workspace_name": "Kepler Commerce"
  }
}
```

---

### get_teams

Get list of teams (teamspaces) in workspace.

**Parameters**: None

**Example**:
```javascript
await mcp__notion__get_teams();
```

---

## Files

### upload_file

Upload a file to Notion.

**Parameters**:
- `page_id` (string, required): Page ID to upload to
- `file_path` (string, required): Local file path
- `file_name` (string, optional): Display name

**Example**:
```javascript
await mcp__notion__upload_file({
  page_id: "page123...",
  file_path: "/path/to/document.pdf",
  file_name: "Project Proposal.pdf"
});
```

---

### get_file_upload

Get information about a file upload.

**Parameters**:
- `file_id` (string, required): File ID

**Example**:
```javascript
await mcp__notion__get_file_upload({
  file_id: "file123..."
});
```

---

### list_file_uploads

List file uploads.

**Parameters**:
- `page_size` (number, optional): Results per page
- `start_cursor` (string, optional): Pagination cursor

**Example**:
```javascript
await mcp__notion__list_file_uploads({
  page_size: 20
});
```

---

## Property Helpers

Convenient helpers for updating specific property types.

### update_page_status

Update a status property.

**Parameters**:
- `page_id` (string, required): Page ID
- `property_name` (string, required): Status property name
- `status_value` (string, required): New status value

**Example**:
```javascript
await mcp__notion__update_page_status({
  page_id: "page123...",
  property_name: "Status",
  status_value: "Done"
});
```

---

### update_page_date

Update a date property.

**Parameters**:
- `page_id` (string, required): Page ID
- `property_name` (string, required): Date property name
- `date_start` (string, required): Start date (ISO 8601)
- `date_end` (string, optional): End date for date range

**Example**:
```javascript
await mcp__notion__update_page_date({
  page_id: "page123...",
  property_name: "Due Date",
  date_start: "2025-11-01"
});
```

---

### update_page_select

Update a select or multi-select property.

**Parameters**:
- `page_id` (string, required): Page ID
- `property_name` (string, required): Select property name
- `select_value` (string, required): New select value

**Example**:
```javascript
await mcp__notion__update_page_select({
  page_id: "page123...",
  property_name: "Priority",
  select_value: "High"
});
```

---

### add_page_relation

Add a relation to another page.

**Parameters**:
- `page_id` (string, required): Page ID
- `property_name` (string, required): Relation property name
- `related_page_id` (string, required): ID of page to relate to

**Example**:
```javascript
await mcp__notion__add_page_relation({
  page_id: "page123...",
  property_name: "Related Projects",
  related_page_id: "project456..."
});
```

---

## Filter Examples

### Text Filters
```javascript
{"property": "Title", "rich_text": {"contains": "keyword"}}
{"property": "Title", "rich_text": {"equals": "exact match"}}
{"property": "Title", "rich_text": {"is_empty": true}}
{"property": "Title", "rich_text": {"is_not_empty": true}}
```

### Number Filters
```javascript
{"property": "Progress", "number": {"equals": 100}}
{"property": "Progress", "number": {"greater_than": 50}}
{"property": "Progress", "number": {"less_than_or_equal_to": 75}}
```

### Checkbox Filters
```javascript
{"property": "Completed", "checkbox": {"equals": true}}
{"property": "Completed", "checkbox": {"equals": false}}
```

### Status Filters
```javascript
{"property": "Status", "status": {"equals": "In Progress"}}
{"property": "Status", "status": {"does_not_equal": "Done"}}
```

### Select Filters
```javascript
{"property": "Category", "select": {"equals": "Development"}}
{"property": "Category", "select": {"does_not_equal": "Marketing"}}
```

### Multi-Select Filters
```javascript
{"property": "Tags", "multi_select": {"contains": "urgent"}}
{"property": "Tags", "multi_select": {"does_not_contain": "archived"}}
```

### Date Filters
```javascript
// Specific date
{"property": "Due Date", "date": {"equals": "2025-11-01"}}
{"property": "Due Date", "date": {"before": "2025-12-01"}}
{"property": "Due Date", "date": {"after": "2025-10-01"}}

// Relative dates
{"property": "Due Date", "date": {"this_week": {}}}
{"property": "Due Date", "date": {"next_week": {}}}
{"property": "Due Date", "date": {"next_month": {}}}
{"property": "Due Date", "date": {"past_week": {}}}

// Empty checks
{"property": "Due Date", "date": {"is_empty": true}}
{"property": "Due Date", "date": {"is_not_empty": true}}
```

### People Filters
```javascript
{"property": "Assignee", "people": {"contains": "user-id"}}
{"property": "Assignee", "people": {"does_not_contain": "user-id"}}
{"property": "Assignee", "people": {"is_empty": true}}
```

### Relation Filters
```javascript
{"property": "Projects", "relation": {"contains": "page-id"}}
{"property": "Projects", "relation": {"is_empty": true}}
```

---

## Sorting Options

### Sort by Property
```javascript
sorts: [
  {"property": "Priority", "direction": "ascending"},
  {"property": "Due Date", "direction": "descending"}
]
```

### Sort by Timestamp
```javascript
sorts: [
  {"timestamp": "created_time", "direction": "descending"},
  {"timestamp": "last_edited_time", "direction": "ascending"}
]
```

**Note**: Multiple sorts are applied in order (first sort, then second, etc.)

---

## Pagination Best Practices

### ⚠️ When to Use Pagination

**ALWAYS use pagination when**:
- Database has >100 entries
- Getting all blocks from large pages
- Listing many users/files

**Recommended page sizes**:
- Quick preview: `page_size: 10`
- Normal usage: `page_size: 20-50`
- Batch processing: `page_size: 100` (max)

### Pattern for Complete Data Retrieval

```javascript
async function getAllDatabaseEntries(database_id, filter = null) {
  let allResults = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await mcp__notion__query_database({
      database_id: database_id,
      filter: filter,
      page_size: 50,  // Safe size
      start_cursor: cursor
    });

    allResults.push(...response.results);
    cursor = response.next_cursor;
    hasMore = response.has_more;
  }

  return allResults;
}
```

---

## Error Handling

All tools return structured errors:

**Authentication Error**:
```json
{
  "error": "Unauthorized - check your NOTION_API_KEY"
}
```

**Not Found Error**:
```json
{
  "error": "Page or database not found"
}
```

**Validation Error**:
```json
{
  "error": "Invalid parameters: database_id is required"
}
```

**Token Limit Exceeded**:
```
MCP tool response exceeds maximum allowed tokens (25000)
→ Solution: Reduce page_size or use pagination
```

---

## Rate Limiting

Notion API rate limits:
- **General**: 3 requests per second
- **Burst**: Short bursts allowed
- **Retry**: Uses exponential backoff

The MCP server handles rate limiting automatically.

---

## Next Steps

- See [PAGINATION.md](PAGINATION.md) for detailed pagination guide
- Check [QUICK_START.md](QUICK_START.md) for common workflows
- Read [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for navigation

---

**Note**: All examples assume use within Claude Code with Notion MCP server configured.
