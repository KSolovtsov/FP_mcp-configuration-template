# Troubleshooting - Notion MCP

Solutions for common issues with Notion MCP Server.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Authentication Errors](#authentication-errors)
- [Token Limit Errors](#token-limit-errors) ⚠️ Most Common
- [Access Errors](#access-errors)
- [Query Errors](#query-errors)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### MCP Server Not Showing Up

**Symptoms**:
- Claude Code doesn't recognize Notion commands
- No Notion integration available

**Solutions**:

1. **Check Node.js version**:
   ```bash
   node --version
   # Must be 18.0.0 or higher
   ```

2. **Verify paths in config**:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Paths must use forward slashes `/` even on Windows

3. **Reinstall dependencies**:
   ```bash
   cd notion-mcp-enhanced
   npm install
   npm run build
   ```

4. **Completely restart Claude Code**:
   - Close all windows
   - Quit from system tray/dock
   - Reopen

---

### Module Not Found Error

**Error**: `Cannot find module 'dist/index.js'`

**Solution**:
```bash
# Build the project
npm run build

# Verify dist/index.js exists
ls dist/index.js
```

---

## Authentication Errors

### Unauthorized / 401 Error

**Error**: `Unauthorized - check your NOTION_API_KEY`

**Solutions**:

1. **Verify API key format**:
   - Should start with `secret_`
   - Example: `secret_a1b2c3d4e5f6...`

2. **Check .env file** (if using):
   ```bash
   cat .env
   # Should show: NOTION_API_KEY=secret_...
   # No extra spaces or quotes
   ```

3. **Verify config file**:
   ```json
   {
     "env": {
       "NOTION_API_KEY": "secret_xxxxx"  // Must be here
     }
   }
   ```

4. **Request new key**:
   - Contact Kateryna or Kostyantyn
   - Or create at: https://www.notion.so/my-integrations

---

### Integration Not Connected

**Error**: `Could not find page/database`

**Solution**:

Integration must be connected to each page/database you want to access:

1. Open page/database in Notion
2. Click "..." (three dots in top right)
3. Select "Connections"
4. Click "Connect to"
5. Select your integration name

**Note**: You must do this for EACH page/database separately!

---

## Token Limit Errors

### ⚠️ Most Common Issue

**Error**:
```
MCP tool "query_database" response (35000 tokens) exceeds maximum allowed tokens (25000)
```

**Cause**: Response is too large (too many results or results with too much content)

**Solutions** (in order of preference):

### Solution 1: Reduce page_size ⭐ Best Solution

```javascript
// ❌ BAD - May exceed limit
await query_database({
  database_id: "...",
  page_size: 100  // Too large!
});

// ✅ GOOD - Safe size
await query_database({
  database_id: "...",
  page_size: 20  // Start here
});

// ✅ BETTER - Very safe
await query_database({
  database_id: "...",
  page_size: 10  // Use if 20 still fails
});
```

### Solution 2: Use Filters

Reduce the number of results returned:

```javascript
// ❌ BAD - Gets all 500 entries
await query_database({
  database_id: "..."
});

// ✅ GOOD - Gets only needed entries
await query_database({
  database_id: "...",
  filter: {
    "property": "Status",
    "status": {"equals": "In Progress"}
  },
  page_size: 20
});
```

### Solution 3: Use Pagination Loop

Get results in multiple requests:

```javascript
// ❌ BAD - Single request for all
await query_database({database_id: "..."});

// ✅ GOOD - Multiple smaller requests
let cursor;
let hasMore = true;

while (hasMore) {
  const response = await query_database({
    database_id: "...",
    page_size: 20,
    start_cursor: cursor
  });

  // Process response.results here

  cursor = response.next_cursor;
  hasMore = response.has_more;
}
```

**Complete guide**: [PAGINATION.md](PAGINATION.md)

---

### get_page_content Token Limit

**Error**: Token limit when reading page with many blocks

**Solution**:
```javascript
// ❌ BAD - Gets all blocks at once
await get_page_content({
  page_id: "..."
});

// ✅ GOOD - Gets blocks in chunks
await get_page_content({
  page_id: "...",
  page_size: 20  // Limit blocks per request
});

// Then get more if needed
await get_block_children({
  block_id: "...",
  page_size: 20,
  start_cursor: "from-previous-response"
});
```

---

## Access Errors

### Page/Database Not Found

**Error**: `Could not find page with ID: abc123...`

**Possible Causes**:

1. **Integration not connected**
   - Solution: Connect integration to page (see above)

2. **Wrong ID**
   - Page IDs should be like: `abc123-def456-789...`
   - Check you're using correct ID format

3. **Page was deleted/archived**
   - Verify page exists in Notion

### Permission Denied

**Error**: `You don't have permission to access this`

**Solutions**:

1. **Check workspace access**:
   - Is your integration in the correct workspace?

2. **Verify integration capabilities**:
   - Go to https://www.notion.so/my-integrations
   - Check integration has required permissions:
     - Read content
     - Update content
     - Insert content

---

## Query Errors

### Invalid Filter

**Error**: `Invalid filter parameter`

**Common mistakes**:

```javascript
// ❌ WRONG - Incorrect property type
{
  "property": "Status",
  "select": {"equals": "Done"}  // Wrong! Status uses "status", not "select"
}

// ✅ CORRECT
{
  "property": "Status",
  "status": {"equals": "Done"}
}
```

**Property type must match**:
- Status property → `"status": {...}`
- Select property → `"select": {...}`
- People property → `"people": {...}`
- Date property → `"date": {...}`

**See**: [API Reference - Filter Examples](API_REFERENCE.md#filter-examples)

---

### Empty Results

**Problem**: Query returns no results but you expect some

**Debug steps**:

1. **Test without filter first**:
   ```javascript
   // Remove filter to see all entries
   await query_database({
     database_id: "...",
     page_size: 10  // Small size for testing
   });
   ```

2. **Check property names**:
   - Property names are case-sensitive
   - Use exact names from database

3. **Check filter values**:
   ```javascript
   // Status values are exact
   "In Progress" ≠ "in progress" ≠ "In progress"
   ```

4. **Simplify filter**:
   ```javascript
   // Start simple, then add complexity
   {"property": "Status", "status": {"equals": "Done"}}
   ```

---

## Performance Issues

### Slow Queries

**Cause**: Large result sets or complex filters

**Solutions**:

1. **Use specific filters**:
   ```javascript
   // Faster - specific filter
   filter: {"property": "Assignee", "people": {"contains": "user-id"}}
   ```

2. **Reduce page_size if iterating**:
   ```javascript
   // Faster responses, more requests
   page_size: 20
   ```

3. **Add sorting** to get most relevant first:
   ```javascript
   sorts: [{"timestamp": "last_edited_time", "direction": "descending"}]
   ```

---

### Rate Limiting

**Error**: `rate_limited` or 429 responses

**Solution**:

Notion MCP handles rate limiting automatically with exponential backoff.

If you see rate limit errors:
- Reduce frequency of requests
- Add delays between batch operations
- Contact Notion support if persistent

---

## Common Error Messages

### "database_id is required"

**Fix**: Always provide database_id parameter
```javascript
await query_database({
  database_id: "abc123..."  // Required!
});
```

---

### "Invalid UUID"

**Fix**: Ensure ID format is correct
```javascript
// ✅ Correct format
"abc123-def456-789..."

// ❌ Wrong - URL instead of ID
"https://notion.so/Page-abc123..."

// Solution: Extract ID from URL or use fetch_by_url
```

---

### "start_cursor is invalid"

**Fix**: Use cursor from previous response exactly as returned
```javascript
const page1 = await query_database({...});

// ✅ Use exact cursor
const page2 = await query_database({
  start_cursor: page1.next_cursor  // Exact value
});
```

---

## Debug Checklist

When something doesn't work:

- [ ] Is Node.js 18+ installed?
- [ ] Is npm install && npm run build completed?
- [ ] Is NOTION_API_KEY correct in config?
- [ ] Is integration connected to page/database?
- [ ] Are you using correct page/database ID?
- [ ] Is page_size set for large databases?
- [ ] Are property names exact (case-sensitive)?
- [ ] Is filter format correct for property type?
- [ ] Did you restart Claude Code after config changes?

---

## Getting Help

### Self-Service

1. **Check this troubleshooting guide** (you are here)
2. **Review [Pagination Guide](PAGINATION.md)** - solves 80% of issues
3. **Check [API Reference](API_REFERENCE.md)** - verify correct usage
4. **Test with MCP Inspector**: `npx @modelcontextprotocol/inspector node dist/index.js`

### Contact Support

**For API Keys**:
- Kateryna - kateryna@keplercommerce.com
- Kostyantyn - kostyantyn@keplercommerce.com

**For Technical Issues**:
- Check [GitHub repository](https://github.com/KSolovtsov/FP_mcp-configuration-template)
- Contact Kostyantyn

---

## Debug Mode

Enable detailed logging:

```bash
# In terminal
DEBUG=notion-mcp:* npm start

# Or in .env file
DEBUG=notion-mcp:*
```

Check Claude Code logs:
- **Windows**: `%APPDATA%\Claude\logs\mcp*.log`
- **macOS**: `~/Library/Logs/Claude/mcp*.log`

---

## Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Token limit error | Reduce `page_size` to 20 or 10 |
| Unauthorized | Check NOTION_API_KEY, connect integration |
| Not found | Connect integration to page/database |
| Empty results | Remove filters, test with small page_size |
| Slow queries | Add filters, reduce page_size |
| Invalid filter | Check property type matches filter type |

---

**Most issues are solved by**: Using pagination with `page_size: 20` and ensuring integration is connected to pages! 🎯

**See also**: [Pagination Guide](PAGINATION.md) - Critical reading!
