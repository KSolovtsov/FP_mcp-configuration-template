# 🚀 Enhanced Notion MCP Server

A full-featured Model Context Protocol (MCP) server for Notion with complete API support.

## ✨ Features

### 🔥 Critical Improvements
- ✅ **Working `query_database`** with filters and sorting
- ✅ Filter by any properties (Assignee, Status, Date, etc.)
- ✅ Support for complex filters (AND/OR logic)
- ✅ **Pagination for large results** (required for databases with >100 records!)

### 📦 Complete Toolset
- 📄 **Pages:** create, read, update, delete, move, duplicate
- 🗄️ **Databases:** create, update, query with filters
- 🧩 **Blocks:** read, update, delete, append child blocks
- 💬 **Comments:** create and read
- 👥 **Users:** list, user information, teams
- 🔍 **Search:** across entire workspace with filters
- 📁 **Files:** upload and management
- 🎯 **Data Sources:** new Notion API capabilities

### 🎨 Developer Experience
- 😀 Full emoji support
- 📊 Batch operations (bulk updates)
- 🛠️ Property helpers
- 📝 Rich content builder

---

## 📋 All Available Tools

### 🔍 Search & Navigation
| Tool | Description |
|------|-------------|
| `search_notion` | Search across workspace with filters |
| `fetch_by_url` | Get content by Notion URL |

### 📄 Pages
| Tool | Description |
|------|-------------|
| `get_page_content` | Get page content |
| `create_page` | Create new page |
| `create_pages_batch` | Create multiple pages at once |
| `update_page` | Update page properties |
| `update_pages_batch` | Bulk update pages |
| `move_pages` | Move pages |
| `duplicate_page` | Duplicate page |
| `delete_page` | Delete (archive) page |
| `get_page_property` | Get specific property |

### 🗄️ Databases
| Tool | Description |
|------|-------------|
| `list_databases` | List all databases |
| `get_database` | Get database information |
| `query_database` | ⭐ Query with filters and sorting |
| `create_database` | Create database |
| `update_database` | Update database |

### 🧩 Blocks
| Tool | Description |
|------|-------------|
| `get_block` | Get block |
| `get_block_children` | Get child blocks |
| `append_blocks` | Append blocks |
| `append_rich_content` | Add formatted content |
| `update_block` | Update block |
| `delete_block` | Delete block |

### 💬 Comments
| Tool | Description |
|------|-------------|
| `create_comment` | Create comment |
| `get_comments` | Get comments |

### 👥 Users & Teams
| Tool | Description |
|------|-------------|
| `list_users` | List users |
| `get_user` | Get user |
| `get_self` | Get bot information |
| `get_teams` | List teams (teamspaces) |

### 📁 Files
| Tool | Description |
|------|-------------|
| `upload_file` | Upload file |
| `get_file_upload` | Get upload information |
| `list_file_uploads` | List uploads |

### 🛠️ Property Helpers
| Tool | Description |
|------|-------------|
| `update_page_status` | Update task status |
| `update_page_date` | Update date |
| `update_page_select` | Update select/multi-select |
| `add_page_relation` | Add relation |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd notion-mcp-enhanced
npm install
npm run build
```

### 2. Get Notion Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Enhanced MCP")
4. Select workspace
5. Copy the Internal Integration Token

### 3. Configure Environment Variables

Create `.env` file:

```bash
NOTION_API_KEY=your_integration_token_here
```

### 4. Connect Integration to Pages

1. Open the target page/database in Notion
2. Click "..." (three dots) → "Connections" → "Connect to"
3. Select your integration

### 5. Configure Claude Code

Add to Claude Code configuration:

**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["/path/to/notion-mcp-enhanced/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "your_integration_token_here"
      }
    }
  }
}
```

---

## 📖 Usage Examples

### Search Tasks by Assignee

```
Find all tasks where Assignee = Kostyantyn
```

The MCP server will execute:
```python
query_database(
    database_id="...",
    filter={
        "property": "Assignee",
        "people": {"contains": "user_id"}
    }
)
```

### Filter by Status

```
Show all tasks with status "In Progress"
```

```python
query_database(
    database_id="...",
    filter={
        "property": "Status",
        "status": {"equals": "In Progress"}
    }
)
```

### Combined Filters

```
Find my incomplete tasks with high priority
```

```python
query_database(
    database_id="...",
    filter={
        "and": [
            {"property": "Assignee", "people": {"contains": "user_id"}},
            {"property": "Status", "status": {"does_not_equal": "Done"}},
            {"property": "Priority", "select": {"equals": "High"}}
        ]
    }
)
```

---

## 🎯 Filter Types by Property

### Text
```python
{"property": "Name", "rich_text": {"contains": "keyword"}}
{"property": "Name", "rich_text": {"equals": "exact match"}}
{"property": "Name", "rich_text": {"is_empty": true}}
```

### Number
```python
{"property": "Priority", "number": {"equals": 5}}
{"property": "Priority", "number": {"greater_than": 3}}
{"property": "Priority", "number": {"less_than_or_equal_to": 10}}
```

### Checkbox
```python
{"property": "Done", "checkbox": {"equals": true}}
```

### Select
```python
{"property": "Status", "select": {"equals": "In Progress"}}
{"property": "Status", "select": {"does_not_equal": "Done"}}
```

### Multi-select
```python
{"property": "Tags", "multi_select": {"contains": "urgent"}}
```

### Date
```python
{"property": "Due Date", "date": {"equals": "2025-10-27"}}
{"property": "Due Date", "date": {"before": "2025-11-01"}}
{"property": "Due Date", "date": {"after": "2025-10-20"}}
{"property": "Due Date", "date": {"is_empty": true}}
{"property": "Due Date", "date": {"next_week": {}}}
```

### People
```python
{"property": "Assignee", "people": {"contains": "user_id"}}
{"property": "Assignee", "people": {"is_empty": true}}
```

### Relation
```python
{"property": "Related", "relation": {"contains": "page_id"}}
{"property": "Related", "relation": {"is_empty": true}}
```

---

## 🔧 Sorting

```python
query_database(
    database_id="...",
    sorts=[
        {"property": "Priority", "direction": "descending"},
        {"property": "Due Date", "direction": "ascending"}
    ]
)
```

Sort by timestamps:
```python
sorts=[
    {"timestamp": "created_time", "direction": "descending"},
    {"timestamp": "last_edited_time", "direction": "ascending"}
]
```

---

## 📄 Pagination

### When to Use Pagination

**IMPORTANT:** When working with large databases (more than 100 records), **ALWAYS** use pagination to avoid exceeding token limits.

### Basic Parameters

```python
query_database(
    database_id="...",
    page_size=10,           # Number of results (max 100)
    start_cursor="..."      # Cursor for next page
)
```

### Paginated Loading Example

```python
# First request - get first 10 tasks
response = query_database(
    database_id="...",
    page_size=10,
    filter={"property": "Status", "status": {"equals": "Not started"}}
)

# Check if there are more results
if response.has_more:
    # Use cursor to get next 10
    next_response = query_database(
        database_id="...",
        page_size=10,
        start_cursor=response.next_cursor,
        filter={"property": "Status", "status": {"equals": "Not started"}}
    )
```

### Page Size Recommendations

| Scenario | Recommended page_size | Reason |
|----------|----------------------|---------|
| Quick preview | 5-10 | Minimal token usage |
| Normal work | 20-50 | Balance between speed and volume |
| Bulk processing | 50-100 | Fewer requests, more tokens |

---

## 📊 Batch Operations

### Create Multiple Tasks
```python
create_pages_batch([
    {"title": "Task 1", "properties": {...}},
    {"title": "Task 2", "properties": {...}},
    {"title": "Task 3", "properties": {...}}
])
```

### Update Multiple Pages
```python
update_pages_batch([
    {"page_id": "...", "properties": {"Status": "Done"}},
    {"page_id": "...", "properties": {"Status": "Done"}},
    {"page_id": "...", "properties": {"Status": "Done"}}
])
```

---

## 🐛 Debugging

### Run MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Open the URL in browser to test all tools.

### Logging

Set environment variable for detailed logs:

```bash
DEBUG=notion-mcp:* npm start
```

---

## 📝 Project Structure

```
notion-mcp-enhanced/
├── src/
│   ├── index.ts              # Main server file
│   ├── notion-client.ts      # Notion API client
│   ├── tools/
│   │   ├── search.ts         # Search tools
│   │   ├── pages.ts          # Page tools
│   │   ├── databases.ts      # Database tools
│   │   ├── blocks.ts         # Block tools
│   │   ├── comments.ts       # Comment tools
│   │   └── users.ts          # User tools
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utilities
├── dist/                     # Compiled files
├── package.json
├── tsconfig.json
├── .env                      # Environment variables (do not commit!)
└── README.md                 # This documentation
```

---

## 🆚 Comparison with Other MCP Servers

| Feature | Old MCP | Official MCP | Enhanced MCP |
|---------|---------|--------------|--------------|
| query_database | ❌ Broken | ❌ No | ✅ Working |
| Filters | ❌ | ❌ | ✅ |
| Sorting | ❌ | ❌ | ✅ |
| Batch operations | ❌ | Partial | ✅ |
| File uploads | ❌ | ❌ | ✅ |
| Data sources | ❌ | ❌ | ✅ |
| Property helpers | ❌ | ❌ | ✅ |
| Rich content | Basic | Good | ✅ Excellent |
| Documentation | Minimal | Good | ✅ Comprehensive |

---

## 🤝 Support

If you encounter issues:

1. Verify Integration Token is correct
2. Ensure integration is connected to required pages
3. Check logs with `DEBUG=notion-mcp:*`
4. Use MCP Inspector for testing

---

## 📄 License

MIT

---

## 🎉 Ready to Use!

After installation you can:

✅ Filter tasks by Assignee
✅ Get lists of your tasks
✅ Use all Notion API capabilities
✅ Work more efficiently with Notion through Claude

**Happy coding!** 🚀
