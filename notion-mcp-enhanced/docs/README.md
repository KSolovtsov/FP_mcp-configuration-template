# Notion MCP Server - Documentation

> **Complete documentation for Notion MCP Server**
> **30+ tools | Pagination guides | AI-friendly**

---

## 📚 Documentation Structure

### 🚀 Start Here

**New to Notion MCP?**
1. **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
2. **[PAGINATION.md](PAGINATION.md)** - ⚠️ **MUST READ** to avoid token errors

**Experienced user?**
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete tool reference
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Full navigation

---

## 📖 Available Guides

| Guide | Description | When to Use |
|-------|-------------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | 5-minute setup guide | First time setup |
| **[API_REFERENCE.md](API_REFERENCE.md)** | All 30+ tools with examples | Looking for specific tool |
| **[PAGINATION.md](PAGINATION.md)** | ⚠️ Critical pagination guide | Working with large databases |
| **[USAGE_GUIDE.md](USAGE_GUIDE.md)** | Practical workflows | Learning best practices |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Fix common problems | Something not working |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | Complete navigation | Finding anything |

---

## 🎯 Quick Find

### By Task

| Want to... | See |
|-----------|-----|
| Query a database | [API Reference - query_database](API_REFERENCE.md#query_database) |
| Avoid token errors | [Pagination Guide](PAGINATION.md) ⚠️ |
| Create a page | [API Reference - create_page](API_REFERENCE.md#create_page) |
| Filter by assignee | [API Reference - People Filters](API_REFERENCE.md#people-filters) |
| Update task status | [API Reference - update_page_status](API_REFERENCE.md#update_page_status) |
| Get all results safely | [Pagination - Complete Loop](PAGINATION.md#example-2-get-all-results-complete-loop) |

---

## ⚠️ Critical Information

### **MUST READ**: Pagination

Notion MCP has a **25,000 token limit** per response.

**You MUST use pagination when**:
- Database has >100 entries
- Page has many blocks
- Any "token limit exceeded" error

**Solution**:
```javascript
// Always set page_size
query_database({
  database_id: "...",
  page_size: 20  // Safe size
});
```

**Complete guide**: [PAGINATION.md](PAGINATION.md)

---

## 📊 Tools Overview

**30+ tools across 8 categories**:

| Category | Tools | Most Used |
|----------|-------|-----------|
| Search & Navigation | 2 | search_notion |
| Page Management | 9 | create_page, update_page |
| Database Management | 5 | query_database ⭐ |
| Block Management | 6 | append_rich_content |
| Comments | 2 | create_comment |
| Users & Teams | 4 | list_users |
| Files | 3 | upload_file |
| Property Helpers | 4 | update_page_status |

**See**: [API Reference](API_REFERENCE.md) for complete list

---

## 🚨 Common Issues

### 1. Token Limit Exceeded (80% of issues)

**Error**: `response exceeds maximum allowed tokens`

**Fix**: Use pagination with `page_size: 20`

**Guide**: [PAGINATION.md](PAGINATION.md)

---

### 2. Unauthorized Error

**Error**: `Unauthorized - check your NOTION_API_KEY`

**Fix**:
1. Verify API key in config
2. Contact Kateryna/Kostyantyn for new key

**Guide**: [Troubleshooting - Auth](TROUBLESHOOTING.md#authentication-errors)

---

### 3. Page Not Found

**Error**: `Could not find page/database`

**Fix**: Connect integration to page
1. Open page in Notion
2. "..." → Connections → Connect to [Your Integration]

**Guide**: [Troubleshooting - Access](TROUBLESHOOTING.md#access-errors)

---

## 💡 Best Practices

### Always

✅ Use `page_size: 20-50` for database queries
✅ Check `has_more` before assuming you have all results
✅ Use filters to reduce result sets
✅ Connect integration to pages before accessing

### Never

❌ Query without `page_size` on large databases
❌ Forget to handle pagination
❌ Ignore "has_more" flag
❌ Use `page_size: 100` unless necessary

---

## 🔍 For AI Agents

This documentation is optimized for AI consumption:

**Search patterns**:
- Tool name: `query_database`, `create_page`, etc.
- Property types: `status`, `people`, `date`, `select`
- Error messages: "token limit", "unauthorized", "not found"
- Concepts: "pagination", "filter", "sort"

**Key files for AI**:
1. **[API_REFERENCE.md](API_REFERENCE.md)** - All methods with parameters
2. **[PAGINATION.md](PAGINATION.md)** - Avoid errors
3. **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Navigation

**Pro tip**: Load API_REFERENCE.md and PAGINATION.md into context for best results!

---

## 📞 Support

**For API Keys**:
- Kateryna - kateryna@keplercommerce.com
- Kostyantyn - kostyantyn@keplercommerce.com

**For Technical Issues**:
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [GitHub Repository](https://github.com/KSolovtsov/FP_mcp-configuration-template)

---

## 📝 Documentation Stats

- **Total guides**: 6
- **Tools documented**: 30+
- **Code examples**: 100+
- **Filter examples**: 50+
- **Languages**: English
- **AI-friendly**: ✅ Yes

---

**Start here**: [QUICK_START.md](QUICK_START.md) → [PAGINATION.md](PAGINATION.md) → [API_REFERENCE.md](API_REFERENCE.md)

**Questions?** Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) or [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Ready to use Notion with Claude Code!** 🚀
