# Pagination Guide - Notion MCP

**Critical guide to avoid token limit errors when working with Notion databases and pages.**

## ⚠️ Why Pagination is Critical

Notion MCP has a **25,000 token limit** per response. Without pagination, you'll see:

```
Error: MCP tool "query_database" response exceeds maximum allowed tokens (25000)
```

**This happens when**:
- Querying databases with >100 entries
- Getting page content with many blocks
- Listing many users or files

**Solution**: Always use pagination with appropriate `page_size`!

---

## 🎯 Quick Reference

| Tool | Supports Pagination | Max page_size | Default |
|------|-------------------|---------------|---------|
| `query_database` | ✅ Yes | 100 | 100 |
| `get_block_children` | ✅ Yes | 100 | 100 |
| `search_notion` | ✅ Yes | 100 | 100 |
| `list_users` | ✅ Yes | 100 | 100 |
| `get_comments` | ✅ Yes | 100 | - |
| `list_file_uploads` | ✅ Yes | 100 | - |
| `get_page_content` | ✅ Yes | 100 | 100 |
| `list_databases` | ❌ No | - | - |

---

## 📏 Recommended Page Sizes

### By Use Case

| Use Case | Recommended page_size | Reason |
|----------|---------------------|---------|
| Quick preview | 5-10 | Minimal tokens, fast response |
| Normal workflow | 20-30 | Good balance |
| Batch processing | 50-75 | Efficient but safe |
| Maximum (use carefully) | 100 | May hit token limit |

### By Database Size

| Database Entries | Strategy |
|-----------------|----------|
| <50 entries | page_size: 50 (single request) |
| 50-200 entries | page_size: 30 (2-7 requests) |
| 200-500 entries | page_size: 20 (10-25 requests) |
| >500 entries | page_size: 10-20 + filters |

---

## 🔄 How Pagination Works

### Pagination Parameters

```javascript
{
  page_size: 20,        // How many results to return (max: 100)
  start_cursor: "abc..."  // Where to start from (from previous response)
}
```

### Response Structure

```json
{
  "results": [...],           // Your data (array)
  "has_more": true,           // Are there more results?
  "next_cursor": "def456..."  // Use this for next request
}
```

### Pagination Flow

```
Request 1:  page_size=20, start_cursor=null
Response 1: results=[...], has_more=true, next_cursor="cursor1"
            ↓
Request 2:  page_size=20, start_cursor="cursor1"
Response 2: results=[...], has_more=true, next_cursor="cursor2"
            ↓
Request 3:  page_size=20, start_cursor="cursor2"
Response 3: results=[...], has_more=false, next_cursor=null
            ↓
Done! All results retrieved.
```

---

## 📖 Practical Examples

### Example 1: Query Database with Pagination

```javascript
// First request - get first 20 results
const page1 = await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "property": "Status",
    "status": {"does_not_equal": "Done"}
  },
  page_size: 20
});

console.log(`Got ${page1.results.length} results`);
console.log(`More results available: ${page1.has_more}`);

// If there are more results, get next page
if (page1.has_more) {
  const page2 = await mcp__notion__query_database({
    database_id: "db123...",
    filter: {
      "property": "Status",
      "status": {"does_not_equal": "Done"}
    },
    page_size: 20,
    start_cursor: page1.next_cursor  // Use cursor from previous response
  });

  console.log(`Got ${page2.results.length} more results`);
}
```

---

### Example 2: Get ALL Results (Complete Loop)

```javascript
async function getAllTasks(database_id) {
  let allTasks = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await mcp__notion__query_database({
      database_id: database_id,
      filter: {
        "property": "Status",
        "status": {"does_not_equal": "Done"}
      },
      page_size: 30,  // Safe size
      start_cursor: cursor
    });

    // Add results to our collection
    allTasks.push(...response.results);

    // Update pagination state
    cursor = response.next_cursor;
    hasMore = response.has_more;

    console.log(`Loaded ${allTasks.length} tasks so far...`);
  }

  return allTasks;
}

// Usage
const tasks = await getAllTasks("db123...");
console.log(`Total tasks: ${tasks.length}`);
```

---

### Example 3: Get Page Blocks with Pagination

```javascript
async function getAllBlocks(page_id) {
  let allBlocks = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await mcp__notion__get_block_children({
      block_id: page_id,
      page_size: 50,
      start_cursor: cursor
    });

    allBlocks.push(...response.results);
    cursor = response.next_cursor;
    hasMore = response.has_more;
  }

  return allBlocks;
}
```

---

### Example 4: Search with Pagination

```javascript
async function searchAll(query) {
  let allResults = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await mcp__notion__search_notion({
      query: query,
      page_size: 20,
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

## 🚨 Common Pagination Errors

### Error: Token Limit Exceeded

**Error Message**:
```
MCP tool "query_database" response exceeds maximum allowed tokens (25000)
```

**Cause**: `page_size` too large or database entries have too much content

**Solutions**:
1. Reduce `page_size` (try 20, then 10 if still fails)
2. Use filters to reduce result set
3. Request specific properties only (if tool supports it)

**Example Fix**:
```javascript
// ❌ BAD - May exceed token limit
await mcp__notion__query_database({
  database_id: "large-db...",
  page_size: 100  // Too large!
});

// ✅ GOOD - Safe page size
await mcp__notion__query_database({
  database_id: "large-db...",
  page_size: 20  // Safe size
});
```

---

### Error: Missing next_cursor

**Problem**: Not saving cursor between requests

**Solution**:
```javascript
// ❌ BAD - Loses cursor
const page1 = await query_database({...});
const page2 = await query_database({...});  // No cursor!

// ✅ GOOD - Uses cursor from previous response
const page1 = await query_database({...});
const page2 = await query_database({
  ...sameParams,
  start_cursor: page1.next_cursor  // Pass cursor
});
```

---

### Error: Infinite Loop

**Problem**: Not checking `has_more` condition

**Solution**:
```javascript
// ❌ BAD - Infinite loop if logic error
while (cursor) {  // Wrong condition!
  const response = await query_database({...});
  cursor = response.next_cursor;
}

// ✅ GOOD - Checks has_more
while (hasMore) {  // Correct condition
  const response = await query_database({...});
  hasMore = response.has_more;
  cursor = response.next_cursor;
}
```

---

## 💡 Pro Tips

### Tip 1: Start Small

When working with unfamiliar databases, start with `page_size: 10`:
```javascript
// First, check database size
const test = await mcp__notion__query_database({
  database_id: "db123...",
  page_size: 10
});

console.log(`Found ${test.results.length} results`);
console.log(`Total may be more: ${test.has_more}`);

// Adjust page_size based on results
```

### Tip 2: Use Filters to Reduce Results

Instead of paginating through everything, filter first:
```javascript
// ❌ BAD - Gets all 1000 entries, requires many pages
await query_database({
  database_id: "large-db...",
  page_size: 20
});
// Would need 50 requests!

// ✅ GOOD - Filters to 50 entries
await query_database({
  database_id: "large-db...",
  filter: {
    "property": "Status",
    "status": {"equals": "In Progress"}
  },
  page_size: 50
});
// Only 1 request!
```

### Tip 3: Show Progress for Large Operations

```javascript
let loaded = 0;
while (hasMore) {
  const response = await query_database({...});
  loaded += response.results.length;
  console.log(`Progress: ${loaded} entries loaded...`);
  hasMore = response.has_more;
}
```

### Tip 4: Combine with Filters and Sorting

```javascript
// Get high priority tasks, sorted, with pagination
await mcp__notion__query_database({
  database_id: "db123...",
  filter: {
    "and": [
      {"property": "Priority", "select": {"equals": "High"}},
      {"property": "Status", "status": {"does_not_equal": "Done"}}
    ]
  },
  sorts: [
    {"property": "Due Date", "direction": "ascending"}
  ],
  page_size: 20  // Safe size
});
```

---

## 📊 Performance Comparison

| Approach | Requests | Time | Token Usage | Recommended |
|----------|----------|------|-------------|-------------|
| page_size: 10 | 50 (for 500 entries) | Slower | ✅ Low | For safety |
| page_size: 30 | 17 (for 500 entries) | Medium | ⚠️ Medium | ✅ Best balance |
| page_size: 50 | 10 (for 500 entries) | Fast | ⚠️ High | Use with caution |
| page_size: 100 | 5 (for 500 entries) | Fastest | ❌ Very High | May fail |

---

## 🎓 Learning Path

### Beginner
1. Start with `page_size: 10`
2. Practice single-page queries
3. Check `has_more` in responses

### Intermediate
1. Implement simple loops with pagination
2. Use `page_size: 20-30`
3. Add progress logging

### Advanced
1. Optimize page sizes based on data
2. Combine filters, sorts, and pagination
3. Handle errors gracefully
4. Build reusable pagination functions

---

## ✅ Pagination Checklist

Before running queries on large databases:

- [ ] Set appropriate `page_size` (10-50)
- [ ] Check `has_more` in response
- [ ] Save `next_cursor` for next request
- [ ] Use filters to reduce result set
- [ ] Test with small page_size first
- [ ] Handle token limit errors gracefully
- [ ] Add progress logging for long operations

---

## 🔍 Quick Decision Tree

```
Is database >100 entries?
├─ No → Use page_size: 50-100
└─ Yes → Is it >500 entries?
    ├─ No → Use page_size: 30-50
    └─ Yes → Use page_size: 10-20 + filters
```

---

## 📚 Related Documentation

- [API Reference - query_database](API_REFERENCE.md#query_database)
- [API Reference - get_block_children](API_REFERENCE.md#get_block_children)
- [Quick Start](QUICK_START.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

**Remember**: When in doubt, use smaller `page_size`. You can always make more requests, but you can't fix a token limit error without restarting!
