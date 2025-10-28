# Slack MCP Server - Documentation

> **Updated:** 2025-10-28
> **Project:** slack-mcp-server
> **Documentation Author:** Claude Code AI

---

## 📚 Documentation Structure

### 🚀 Quick Start

1. **[01-authentication-setup.md](./01-authentication-setup.md)**
   - Authentication setup
   - Getting tokens

2. **[02-installation.md](./02-installation.md)**
   - MCP server installation
   - Dependencies

3. **[03-configuration-and-usage.md](./03-configuration-and-usage.md)**
   - Configuration
   - Basic usage

---

### 📖 Complete Slack API Documentation

#### ⭐ Main Reference (PRIMARY)
**[Slack_API_Complete_Reference.md](./Slack_API_Complete_Reference.md)**
- **200+ Slack API methods**
- **32 categories**
- AI-friendly quick search (Ctrl+F)
- All parameters, examples, scopes
- Organized for AI agents

**Contains:**
- Admin API (60+ methods) - Enterprise Grid
- Conversations API (20+ methods) - Channel management
- Chat API (10 methods) - Messaging
- Users API (15 methods) - User management
- Files API (20 methods) - File operations
- Search API (3 methods) - Search
- All other categories (150+ methods)

#### 📘 Administrator's Guide
**[Slack_Admin_API_Complete_Guide.md](./Slack_Admin_API_Complete_Guide.md)**
- 24 essential methods to get started
- Detailed usage examples
- Practical scripts (Python/Bash)
- Troubleshooting
- Best practices

---

## 🎯 Quick Search

### Want to find how to...

| Task | Open | Method |
|------|------|--------|
| Create channel | Complete_Reference.md → Ctrl+F "create channel" | `conversations.create` |
| Add users | Complete_Reference.md → Ctrl+F "invite" | `conversations.invite` |
| Bulk archive | Complete_Reference.md → "admin.conversations.bulk" | `admin.conversations.bulkArchive` |
| Search messages | Complete_Reference.md → "search.messages" | `search.messages` |
| Upload file | Complete_Reference.md → "files.getUpload" | New flow (2025) |
| Script examples | Complete_Guide.md → "Usage Examples" | Python/Bash examples |

---

## 🔗 MCP Server Methods

Slack MCP Server provides 5 main methods out of 200+:

| MCP Method | API Method | Documentation |
|------------|------------|---------------|
| `mcp__slack__channels_list` | `conversations.list` | Complete_Reference.md |
| `mcp__slack__conversations_add_message` | `chat.postMessage` | Complete_Reference.md |
| `mcp__slack__conversations_history` | `conversations.history` | Complete_Reference.md |
| `mcp__slack__conversations_replies` | `conversations.replies` | Complete_Reference.md |
| `mcp__slack__conversations_search_messages` | `search.messages` | Complete_Reference.md |

**For all other operations use direct API calls** (see Complete_Reference.md)

---

## 📦 Project Structure

```
slack-mcp-server/
├── docs/                                   # Documentation
│   ├── README.md                          # This file
│   ├── 01-authentication-setup.md         # Token setup
│   ├── 02-installation.md                 # Installation
│   ├── 03-configuration-and-usage.md      # Usage
│   ├── Slack_Admin_API_Complete_Guide.md # Guide (24 methods)
│   └── Slack_API_Complete_Reference.md   # FULL reference (200+ methods)
├── .env                                    # Tokens (DON'T commit!)
├── .env.dist                              # Configuration template
└── [project code]
```

---

## 🛠️ Using Documentation

### For AI Agents:

1. Load **Slack_API_Complete_Reference.md** into context
2. Use search (Ctrl+F) to quickly find methods
3. Copy curl examples and adapt parameters
4. All methods have complete parameter descriptions

### For Developers:

1. Start with **Slack_Admin_API_Complete_Guide.md** for basic understanding
2. Use **Slack_API_Complete_Reference.md** as reference
3. All examples work with tokens from `.env`
4. Check "Quick Reference Tables" section for quick lookup

### For Administrators:

1. Setup tokens per **01-authentication-setup.md**
2. Study examples in **Slack_Admin_API_Complete_Guide.md**
3. Use ready automation scripts
4. For Enterprise Grid see "Admin API Methods" section

---

## ⚠️ Important Notes

### Tokens
- xoxc + xoxd - browser tokens (works for most operations)
- xoxb - bot tokens (for automation)
- xoxp - user tokens (for user-specific operations)

### Deprecated Methods
- `files.upload` → use new flow (deprecated from 11.03.2025)
- `channels.*` → use `conversations.*`
- `rtm.*` → use Socket Mode

### Enterprise Grid
- Admin API methods require Enterprise Grid workspace
- Standard workspaces have limited functionality

---

## 🔍 FAQ

**Q: Where to find list of ALL methods?**
A: `Slack_API_Complete_Reference.md` - contains all 200+ methods

**Q: How to upload file in 2025?**
A: Use new flow: `files.getUploadURLExternal` → POST → `files.completeUploadExternal`

**Q: Which methods are available via MCP?**
A: Only 5 main ones. For others use direct API calls.

**Q: Where are script examples?**
A: `Slack_Admin_API_Complete_Guide.md` → "Usage Examples" section

**Q: How to find needed method?**
A: Open `Slack_API_Complete_Reference.md` → Ctrl+F → enter task

---

## 📞 Support

- **Official Slack API Docs:** https://api.slack.com/methods
- **Slack API Community:** https://api.slack.com/community
- **GitHub Issues:** https://github.com/korotovsky/slack-mcp-server/issues

---

## 📝 Changelog

### 2025-10-28
- ✅ Added complete reference (200+ methods)
- ✅ Created administrator's guide
- ✅ AI-friendly indexes and quick search
- ✅ Examples for all major operations
- ✅ Quick reference tables by tasks/scopes/HTTP methods

---

**Documentation ready to use!** 🚀
