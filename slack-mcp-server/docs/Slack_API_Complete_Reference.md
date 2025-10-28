# Slack API - Complete Reference (200+ Methods)

> **Version:** 2025 | **Updated:** 2025-10-28  
> **Methods:** 200+ | **Categories:** 32  
> **For:** AI Agents & Administrators

---

## 🎯 AI Quick Search Index

**Looking for a method? Use Ctrl+F:**
- **Create channel** → `conversations.create`
- **Invite user** → `conversations.invite`
- **Remove user** → `conversations.kick`
- **Send message** → `chat.postMessage`
- **Archive channel** → `conversations.archive`
- **Get members** → `conversations.members`
- **Search messages** → `search.messages`
- **List users** → `users.list`
- **Upload file** → `files.getUploadURLExternal` + `files.completeUploadExternal`

---

## API Categories Overview

| Category | Methods | Enterprise Only | Description |
|----------|---------|----------------|-------------|
| **admin*** | 60+ | ✅ | Workspace management |
| **conversations*** | 20+ | ❌ | Channel management |
| **chat*** | 10+ | ❌ | Messaging |
| **users*** | 15+ | ❌ | User management |
| **files*** | 20+ | ❌ | File operations |
| **search*** | 3 | ❌ | Search |
| **reactions*** | 4 | ❌ | Reactions |
| **pins*** | 3 | ❌ | Pinned messages |

---

## Conversations API (Primary)

Most used category for channel operations.

| Method | Description | Scope |
|--------|-------------|-------|
| `conversations.archive` | Archive channel | channels:manage |
| `conversations.create` | Create channel | channels:manage |
| `conversations.history` | Get messages | channels:history |
| `conversations.info` | Get channel info | channels:read |
| `conversations.invite` | Add users (1-1000) | channels:manage |
| `conversations.kick` | Remove user | channels:manage |
| `conversations.list` | List channels | channels:read |
| `conversations.members` | List members | channels:read |
| `conversations.rename` | Rename channel | channels:manage |

**See full documentation at:** https://api.slack.com/methods

---

## Chat API

| Method | Description | Scope |
|--------|-------------|-------|
| `chat.postMessage` | Send message | chat:write |
| `chat.update` | Update message | chat:write |
| `chat.delete` | Delete message | chat:write |
| `chat.scheduleMessage` | Schedule message | chat:write |

---

## Users API

| Method | Description | Scope |
|--------|-------------|-------|
| `users.list` | List all users | users:read |
| `users.info` | Get user info | users:read |
| `users.lookupByEmail` | Find by email | users:read.email |

---

## MCP Server Mapping

Slack MCP provides 5 methods:

| MCP Method | API Equivalent |
|------------|----------------|
| `mcp__slack__channels_list` | `conversations.list` |
| `mcp__slack__conversations_add_message` | `chat.postMessage` |
| `mcp__slack__conversations_history` | `conversations.history` |
| `mcp__slack__conversations_replies` | `conversations.replies` |
| `mcp__slack__conversations_search_messages` | `search.messages` |

**For 195+ other methods:** Use direct API calls with curl or SDK.

---

## Quick Reference

**Create channel:**
```bash
curl -X POST "https://slack.com/api/conversations.create" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "name=my-channel&is_private=false"
```

**Invite users:**
```bash
curl -X POST "https://slack.com/api/conversations.invite" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&users=U111,U222"
```

**Send message:**
```bash
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&text=Hello!"
```

**Get members:**
```bash
curl "https://slack.com/api/conversations.members?channel=C12345" \
  -H "Authorization: Bearer xoxb-TOKEN"
```

---

## Deprecated Methods

⚠️ **Avoid these:**
- `files.upload` → Use new flow (deprecated 03/11/2025)
- `channels.*` → Use `conversations.*`
- `rtm.*` → Use Socket Mode

---

**Complete Slack API documentation:** https://api.slack.com/methods

**Last updated:** 2025-10-28
