# Documentation Index

AI-friendly navigation hub for the Notion MCP Server documentation.

## Quick Navigation

| What You Want | Go To |
|---------------|-------|
| Get started in 5 minutes | [Quick Start](QUICK_START.md) |
| Find a specific tool | [API Reference](API_REFERENCE.md) |
| Avoid token limit errors | [Pagination Guide](PAGINATION.md) ⭐ |
| See practical examples | [Usage Guide](USAGE_GUIDE.md) |
| Fix problems | [Troubleshooting](TROUBLESHOOTING.md) |

---

## By User Intent

### "I want to set up the MCP server"
→ [Quick Start Guide](QUICK_START.md)
- 3-step setup
- Configuration
- Verification

### "I want to avoid token limit errors"
→ [Pagination Guide](PAGINATION.md) ⚠️ **MUST READ**
- Why pagination is critical
- Recommended page sizes
- Complete examples
- Error solutions

### "I need to find how to do X"
→ [API Reference](API_REFERENCE.md)
- All 30+ tools documented
- Parameters and examples
- Response formats
- Filter examples

### "I want practical examples"
→ [Usage Guide](USAGE_GUIDE.md)
- Common workflows
- Natural language examples
- Advanced scenarios

### "Something isn't working"
→ [Troubleshooting Guide](TROUBLESHOOTING.md)
- Common errors
- Solutions
- Debug tips

---

## By Tool Category

### Search & Navigation
**Documentation**: [API Reference - Search](API_REFERENCE.md#search--navigation)

**Tools**:
- `search_notion` - Search workspace
- `fetch_by_url` - Get content by URL

**Common uses**:
- Find pages by keyword
- Search for databases
- Get content from shared links

---

### Page Management
**Documentation**: [API Reference - Pages](API_REFERENCE.md#page-management)

**Tools**:
- `get_page_content` - Read page
- `create_page` - Create new page
- `create_pages_batch` - Create multiple pages
- `update_page` - Update properties
- `update_pages_batch` - Batch update
- `delete_page` - Archive page
- `move_pages` - Move pages
- `duplicate_page` - Copy page
- `get_page_property` - Get specific property

**Common uses**:
- Create meeting notes
- Update task status
- Organize pages
- Batch operations

---

### Database Management
**Documentation**: [API Reference - Databases](API_REFERENCE.md#database-management)

**Tools**:
- `list_databases` - List all databases
- `get_database` - Get database info
- `query_database` - ⭐ Query with filters
- `create_database` - Create new database
- `update_database` - Update database

**Common uses**:
- Find tasks assigned to you
- Filter by status/priority
- Sort by due date
- Create project tracking databases

**⚠️ Critical**: `query_database` requires pagination for large databases - see [Pagination Guide](PAGINATION.md)

---

### Block Management
**Documentation**: [API Reference - Blocks](API_REFERENCE.md#block-management)

**Tools**:
- `get_block` - Get block info
- `get_block_children` - Get child blocks
- `append_blocks` - Add blocks
- `append_rich_content` - Add formatted content
- `update_block` - Update block
- `delete_block` - Delete block

**Common uses**:
- Add content to pages
- Create formatted documents
- Manage page structure

---

### Comments
**Documentation**: [API Reference - Comments](API_REFERENCE.md#comments)

**Tools**:
- `create_comment` - Add comment
- `get_comments` - Read comments

---

### Users & Teams
**Documentation**: [API Reference - Users](API_REFERENCE.md#users--teams)

**Tools**:
- `list_users` - List workspace users
- `get_user` - Get user info
- `get_self` - Get bot info
- `get_teams` - List teamspaces

**Common uses**:
- Find user IDs for assignments
- Get team member list

---

### Files
**Documentation**: [API Reference - Files](API_REFERENCE.md#files)

**Tools**:
- `upload_file` - Upload file to page
- `get_file_upload` - Get upload info
- `list_file_uploads` - List uploads

---

### Property Helpers
**Documentation**: [API Reference - Helpers](API_REFERENCE.md#property-helpers)

**Tools**:
- `update_page_status` - Update status quickly
- `update_page_date` - Update dates
- `update_page_select` - Update select properties
- `add_page_relation` - Add relations

**Why use helpers**: Simpler syntax for common property updates

---

## By Use Case

### Task Management
1. [API Reference - query_database](API_REFERENCE.md#query_database)
2. [Usage Guide - Task Workflows](USAGE_GUIDE.md#task-management)
3. [Pagination Guide](PAGINATION.md) - For large task lists

### Meeting Notes
1. [API Reference - create_page](API_REFERENCE.md#create_page)
2. [API Reference - append_rich_content](API_REFERENCE.md#append_rich_content)
3. [Usage Guide - Meeting Notes](USAGE_GUIDE.md#meeting-notes)

### Project Tracking
1. [API Reference - Databases](API_REFERENCE.md#database-management)
2. [Usage Guide - Project Tracking](USAGE_GUIDE.md#project-tracking)

### Team Collaboration
1. [API Reference - Comments](API_REFERENCE.md#comments)
2. [API Reference - Users](API_REFERENCE.md#users--teams)

---

## By Problem Type

### "Token limit exceeded" Error
→ [Pagination Guide](PAGINATION.md) ⚠️ **START HERE**
- Reduce page_size
- Use filters
- Implement pagination loop

### Authentication Errors
→ [Troubleshooting - Auth](TROUBLESHOOTING.md#authentication-errors)
- Check API key
- Verify integration connections

### "Not found" Errors
→ [Troubleshooting - Access](TROUBLESHOOTING.md#access-errors)
- Integration not connected
- Wrong ID format

---

## Common Questions & Answers

### "How do I query a database?"
[API Reference - query_database](API_REFERENCE.md#query_database)

### "How do I avoid token limit errors?"
[Pagination Guide](PAGINATION.md) ⭐ **READ THIS**

### "How do I filter by assignee?"
[API Reference - People Filters](API_REFERENCE.md#people-filters)

### "How do I create a page?"
[API Reference - create_page](API_REFERENCE.md#create_page)

### "How do I update multiple pages?"
[API Reference - update_pages_batch](API_REFERENCE.md#update_pages_batch)

### "How do I add content to a page?"
[API Reference - append_rich_content](API_REFERENCE.md#append_rich_content)

### "How do I get all results from a large database?"
[Pagination Guide - Complete Loop](PAGINATION.md#example-2-get-all-results-complete-loop)

---

## Documentation Map

```
Notion MCP Documentation
│
├── Getting Started
│   ├── Quick Start (5 min)          ← Start here!
│   └── API Reference (complete)
│
├── Critical Guides
│   └── Pagination Guide             ← Prevent errors!
│
├── Practical Guides
│   ├── Usage Guide (examples)
│   └── Documentation Index (this)
│
└── Support
    └── Troubleshooting
```

---

## File Structure

```
notion-mcp-enhanced/
├── README.md                    # Project overview
├── docs/
│   ├── QUICK_START.md          # 5-minute start
│   ├── API_REFERENCE.md        # All tools (30+)
│   ├── PAGINATION.md           # ⚠️ Critical guide
│   ├── USAGE_GUIDE.md          # Practical examples
│   ├── DOCUMENTATION_INDEX.md  # This file
│   └── TROUBLESHOOTING.md      # Fix problems
└── src/
    └── ... (implementation)
```

---

## Search Tips for AI

When searching for information in this documentation:

**For tools**: Search in [API Reference](API_REFERENCE.md)
- Pattern: Look for tool name (e.g., `query_database`, `create_page`)

**For pagination**: Search in [Pagination Guide](PAGINATION.md)
- Pattern: "page_size", "start_cursor", "has_more"

**For filters**: Search in [API Reference - Filter Examples](API_REFERENCE.md#filter-examples)
- Pattern: Property type + filter (e.g., "status equals", "people contains")

**For workflows**: Search in [Usage Guide](USAGE_GUIDE.md)
- Pattern: Task or scenario names

---

## Tools by Frequency of Use

### Most Used (Daily)
- ⭐ `query_database` - Search tasks/projects
- ⭐ `update_page` - Update task status
- ⭐ `create_page` - Create new tasks/notes
- ⭐ `get_page_content` - Read pages

### Often Used (Weekly)
- `search_notion` - Find pages
- `create_pages_batch` - Bulk create
- `append_rich_content` - Add content
- `list_databases` - Find databases

### Occasionally Used
- `create_database` - New databases
- `move_pages` - Reorganize
- `duplicate_page` - Copy templates
- Property helpers

### Rarely Used
- `list_users` - Get team members
- `upload_file` - Add files
- `delete_page` - Archive pages

---

## Critical Warnings

### ⚠️ Pagination is MANDATORY

For any database with >100 entries, you **MUST** use pagination:

```javascript
// ❌ BAD - Will fail with large database
query_database({database_id: "..."})

// ✅ GOOD - Safe for any size
query_database({database_id: "...", page_size: 20})
```

**See [Pagination Guide](PAGINATION.md) for details.**

### ⚠️ Always Check Integration Access

Before querying:
1. Integration must be connected to the page/database
2. Use Notion UI: ... → Connections → Connect to [Your Integration]

### ⚠️ Use Correct IDs

- Page IDs: `abc123-def456-...` (with hyphens)
- Database IDs: Same format as page IDs
- User IDs: Different format, get from `list_users`

---

## Update History

This documentation covers:
- ✅ All 30+ Notion MCP tools
- ✅ Complete filter reference
- ✅ Pagination best practices
- ✅ Practical workflows
- ✅ Error handling
- ✅ AI-friendly navigation

**Last Updated**: October 2025
**Version**: 1.0
**MCP Server**: notion-mcp-enhanced

---

## Need Something Not Here?

1. Check [Troubleshooting](TROUBLESHOOTING.md)
2. Search this index for keywords
3. Contact Kateryna or Kostyantyn

---

**Pro Tip**: Use Ctrl+F (or Cmd+F) to search within documents for specific terms!
