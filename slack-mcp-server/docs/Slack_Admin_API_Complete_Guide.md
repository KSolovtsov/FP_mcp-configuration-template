# Slack Administration API - Complete Guide

> Version: 2025
> Author: Claude Code
> Created: 2025-10-28

## Table of Contents
1. [Introduction](#introduction)
2. [Setup and Authentication](#setup-and-authentication)
3. [User Management](#user-management)
4. [Channel Management](#channel-management)
5. [Message Management](#message-management)
6. [Search and Analytics](#search-and-analytics)
7. [MCP Server for Slack](#mcp-server-for-slack)
8. [Usage Examples](#usage-examples)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

Complete guide for administering Slack workspace through API and MCP server.

### Capabilities:
- ✅ Manage users (view, information)
- ✅ Manage channels (create, archive, rename)
- ✅ Add/remove channel members
- ✅ Send and manage messages
- ✅ Search messages and channels
- ✅ Get analytics (Enterprise Grid)

---

## Setup and Authentication

### Slack Token Types

| Type | Prefix | Description | Recommended |
|------|--------|-------------|-------------|
| Bot Token | `xoxb-` | For bots/apps | ✅ Yes |
| User Token | `xoxp-` | For user apps | ✅ Yes |
| Browser Token | `xoxc-` + `xoxd` | Web client | ⚠️ Unofficial |

### Configuration

File: `slack-mcp-server/.env`

```bash
SLACK_MCP_XOXC_TOKEN=xoxc-YOUR-TOKEN
SLACK_MCP_XOXD_TOKEN=xoxd-YOUR-COOKIE
SLACK_MCP_LOG_LEVEL=info
```

---

## User Management

### List All Users

**Method:** `users.list`

**Example:**
```bash
curl "https://slack.com/api/users.list" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

---

## Channel Management

### List Channels

**Method:** `conversations.list`

**Example:**
```bash
curl "https://slack.com/api/conversations.list?types=public_channel,private_channel" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

### Get Channel Members

**Method:** `conversations.members`

**Example:**
```bash
curl "https://slack.com/api/conversations.members?channel=C12345" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

### Invite Users to Channel

**Method:** `conversations.invite`

**Example:**
```bash
curl -X POST "https://slack.com/api/conversations.invite" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -d "channel=C12345&users=U111,U222"
```

---

## MCP Server for Slack

### Available Methods

| MCP Method | API Equivalent |
|------------|----------------|
| `mcp__slack__channels_list` | `conversations.list` |
| `mcp__slack__conversations_history` | `conversations.history` |
| `mcp__slack__conversations_replies` | `conversations.replies` |
| `mcp__slack__conversations_add_message` | `chat.postMessage` |
| `mcp__slack__conversations_search_messages` | `search.messages` |

---

## Usage Examples

### Example 1: Add Users to Channel

```python
import requests

CHANNEL_ID = "C087E8S6CUQ"
USERS_TO_ADD = ["U084MJ9C28M", "U0853QW4538"]

response = requests.post(
    "https://slack.com/api/conversations.invite",
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Cookie": f"d={COOKIE}"
    },
    json={
        "channel": CHANNEL_ID,
        "users": ",".join(USERS_TO_ADD)
    }
)

if response.json()['ok']:
    print("✓ Users added successfully")
```

### Example 2: Find Users Not in Channel

```python
# Get all workspace users
all_users = requests.get(
    "https://slack.com/api/users.list",
    headers={"Authorization": f"Bearer {TOKEN}"}
).json()['members']

# Get channel members
channel_members = requests.get(
    f"https://slack.com/api/conversations.members?channel={CHANNEL_ID}",
    headers={"Authorization": f"Bearer {TOKEN}"}
).json()['members']

# Find difference
not_in_channel = [
    user for user in all_users
    if user['id'] not in channel_members
    and not user['deleted']
    and not user['is_bot']
]

for user in not_in_channel:
    print(f"{user['real_name']} - {user['profile']['email']}")
```

---

## Troubleshooting

### Common Errors

#### `not_authed`

**Solution:**
- Check token in `.env`
- Verify both xoxc and xoxd are set
- Get fresh tokens from browser

#### `channel_not_found`

**Solution:**
- Verify Channel ID format (C1234567890)
- Check user has access to private channels
- Use `conversations.list` to verify channel exists

#### `rate_limited`

**Solution:**
- Add delays between requests (1 sec recommended)
- Use batch operations where possible

---

## API Rate Limits

| Operation | Limit |
|-----------|-------|
| General | ~1 request/second |
| conversations.history | 20+/minute |
| chat.postMessage | 1/second |

---

## Getting Tokens

To extract xoxc and xoxd tokens:

1. Open Slack in browser
2. Press F12 (DevTools)
3. Go to Network tab
4. Refresh page
5. Find request to `api.slack.com`
6. Copy from Headers:
   - `Authorization: Bearer xoxc-...`
   - `Cookie: d=xoxd-...`

---

## Useful Resources

- Official API: https://api.slack.com/methods
- MCP Server: https://github.com/korotovsky/slack-mcp-server
- Community: https://api.slack.com/community

---

**Last Updated:** 2025-10-28
**Version:** 2.0.0 (English Edition)
