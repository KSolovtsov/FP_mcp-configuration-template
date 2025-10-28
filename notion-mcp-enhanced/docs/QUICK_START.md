# Quick Start - Notion MCP

Get up and running with Notion MCP in 5 minutes.

## Prerequisites

- ✅ Claude Code installed
- ✅ Node.js 18+ installed
- ✅ Access to Notion workspace

---

## 3-Step Setup

### Step 1: Clone & Install

```bash
git clone https://github.com/KSolovtsov/FP_mcp-configuration-template.git
cd FP_mcp-configuration-template/notion-mcp-enhanced
npm install
npm run build
```

### Step 2: Get Notion API Key

**Get from Team**: Contact Kateryna or Kostyantyn for `NOTION_API_KEY`

**Or create your own**:
1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Claude MCP")
4. Select your workspace
5. Copy the "Internal Integration Token"

**Connect integration to pages**:
1. Open page/database in Notion
2. Click "..." → "Connections" → "Connect to"
3. Select your integration

### Step 3: Configure Claude Code

Edit config file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": [
        "C:/path/to/notion-mcp-enhanced/dist/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "secret_xxxxx"
      }
    }
  }
}
```

**Restart Claude Code** and you're done!

---

## ✅ Verify Installation

Try these commands in Claude Code:

```
"List my Notion databases"
```

```
"Search for pages about project"
```

```
"Show me tasks assigned to me"
```

If these work, you're all set! 🎉

---

## 🎯 Common Tasks

### Search for Pages
```
"Find all pages about marketing"
```

### Query Database
```
"Show me all tasks with status 'In Progress'"
```

### Create Page
```
"Create a new task in my Tasks database:
Title: Fix login bug
Status: To Do
Priority: High"
```

### Update Page
```
"Update task TASK-123 status to Done"
```

### Add Comment
```
"Add comment to page: This looks good!"
```

---

## ⚠️ Critical: Pagination

**ALWAYS use pagination for large databases!**

When querying databases with >100 entries:

```
"Query my Tasks database with page_size 20"
```

Or ask Claude:
```
"Get first 20 tasks from database, then get next 20"
```

**See [PAGINATION.md](PAGINATION.md) for complete guide.**

---

## 🔥 Pro Tips

### Tip 1: Use Filters
Instead of getting all entries and filtering in code, filter in the query:

```
"Show me tasks where Assignee = Kostyantyn AND Status != Done"
```

### Tip 2: Specify page_size
For large databases, always specify page_size:

```
"Query database with page_size 25"
```

### Tip 3: Use Emoji
Notion supports emoji in titles:

```
"Create task: 🚀 Launch new feature"
```

### Tip 4: Batch Operations
Update multiple pages at once:

```
"Update status to Done for pages: page1, page2, page3"
```

---

## 📚 Next Steps

Now that you're set up:

1. **Learn filters**: [API Reference - Filters](API_REFERENCE.md#filter-examples)
2. **Master pagination**: [Pagination Guide](PAGINATION.md)
3. **Explore all tools**: [API Reference](API_REFERENCE.md)
4. **See examples**: [Usage Guide](USAGE_GUIDE.md)

---

## 🆘 Troubleshooting

### "Unauthorized" Error
- Check NOTION_API_KEY is correct
- Verify integration is connected to pages/databases

### "Token limit exceeded"
- Use smaller `page_size` (try 20 or 10)
- See [PAGINATION.md](PAGINATION.md)

### "Page/database not found"
- Verify integration has access
- Check ID is correct

### MCP Server not starting
- Check Node.js version: `node --version` (must be 18+)
- Reinstall: `npm install && npm run build`
- Verify paths in claude_desktop_config.json

---

## 🔗 Useful Links

- [API Reference](API_REFERENCE.md) - All tools
- [Pagination Guide](PAGINATION.md) - Avoid token errors
- [Documentation Index](DOCUMENTATION_INDEX.md) - Full navigation

---

**You're ready to go!** Start exploring with Claude Code 🚀
