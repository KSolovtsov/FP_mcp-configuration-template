# Slack MCP Server - Claude Code Setup Guide

This guide walks you through setting up the Slack MCP Server with Claude Code.

## Prerequisites

- Claude Code installed
- Slack workspace access
- Node.js 18+ installed

## Step 1: Get Slack Tokens

You need browser tokens to authenticate with Slack. Follow these steps:

### Getting xoxc and xoxd Tokens

1. **Open Slack in your browser** (Chrome or Firefox)
2. **Open Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Network tab**
4. **Refresh the page** (F5)
5. **Find any request to `api.slack.com`**
6. **Copy the tokens:**
   - In Headers, find `Authorization: Bearer xoxc-...` → This is your `SLACK_MCP_XOXC_TOKEN`
   - In Headers, find `Cookie: d=xoxd-...` → This is your `SLACK_MCP_XOXD_TOKEN`

**Example:**
```
Authorization: Bearer xoxc-1234567890123-4567890123456-...
Cookie: d=xoxd-AbCdEfGhIjKlMnOpQrStUvWxYz...
```

> **Security Note:** These tokens grant full access to your Slack workspace. Keep them secure and never share them.

## Step 2: Configure Claude Code

### Option A: Using NPX (Recommended)

1. **Open Claude Code Settings**
   - Press `Cmd/Ctrl + ,`
   - Search for "MCP"
   - Click "Edit in settings.json"

2. **Add the configuration:**

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "slack-mcp-server@latest",
        "--transport",
        "stdio"
      ],
      "env": {
        "SLACK_MCP_XOXC_TOKEN": "xoxc-YOUR-XOXC-TOKEN-HERE",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-YOUR-XOXD-TOKEN-HERE",
        "SLACK_MCP_PORT": "13080",
        "SLACK_MCP_HOST": "127.0.0.1",
        "SLACK_MCP_USERS_CACHE": ".users_cache.json",
        "SLACK_MCP_CHANNELS_CACHE": ".channels_cache_v2.json",
        "SLACK_MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

3. **Replace the tokens:**
   - Replace `xoxc-YOUR-XOXC-TOKEN-HERE` with your actual xoxc token
   - Replace `xoxd-YOUR-XOXD-TOKEN-HERE` with your actual xoxd token

4. **Save and restart Claude Code**

### Option B: Using Local Build

If you've cloned the repository:

```json
{
  "mcpServers": {
    "slack": {
      "command": "go",
      "args": [
        "run",
        "/path/to/slack-mcp-server/cmd/slack-mcp-server/main.go",
        "--transport",
        "stdio"
      ],
      "env": {
        "SLACK_MCP_XOXC_TOKEN": "xoxc-YOUR-TOKEN-HERE",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-YOUR-TOKEN-HERE"
      }
    }
  }
}
```

## Step 3: Verify Installation

1. **Restart Claude Code**
2. **Open a chat**
3. **Type:** "List my Slack channels"
4. **Claude should respond with your channels**

If it works, you're all set! 🎉

## Step 4: Optional Configuration

### Enable Message Posting

By default, message posting is disabled for safety. To enable:

```json
{
  "env": {
    // ... other env vars ...
    "SLACK_MCP_ADD_MESSAGE_TOOL": "true"
  }
}
```

**Enable only for specific channels:**
```json
"SLACK_MCP_ADD_MESSAGE_TOOL": "C1234567890,C9876543210"
```

**Enable for all except specific channels:**
```json
"SLACK_MCP_ADD_MESSAGE_TOOL": "!C1234567890,!C9876543210"
```

### Configure Cache Locations

```json
{
  "env": {
    "SLACK_MCP_USERS_CACHE": "/path/to/.users_cache.json",
    "SLACK_MCP_CHANNELS_CACHE": "/path/to/.channels_cache_v2.json"
  }
}
```

### Use OAuth Token Instead

If you have an OAuth user token (xoxp):

```json
{
  "env": {
    "SLACK_MCP_XOXP_TOKEN": "xoxp-YOUR-OAUTH-TOKEN",
    // Don't need xoxc/xoxd when using xoxp
  }
}
```

## Available Tools

Once configured, Claude Code can use these Slack MCP tools:

### 1. `conversations_history`
Get messages from a channel or DM

**Example:** "Show me recent messages from #general"

### 2. `conversations_replies`
Get replies in a thread

**Example:** "Show me replies to that message"

### 3. `conversations_add_message`
Send a message (if enabled)

**Example:** "Send 'Meeting at 3pm' to #team"

### 4. `conversations_search_messages`
Search messages with filters

**Example:** "Search for 'budget' from @john in #finance last week"

### 5. `channels_list`
List all channels, DMs, and groups

**Example:** "List all my channels"

## Resources

The server also provides these resources:

- `slack://<workspace>/channels` - CSV of all channels
- `slack://<workspace>/users` - CSV of all users

## Troubleshooting

### MCP Server Not Starting

1. **Check logs:**
   ```bash
   # macOS/Linux
   tail -f ~/Library/Logs/Claude/mcp*.log

   # Windows
   type %APPDATA%\Claude\logs\mcp*.log
   ```

2. **Verify tokens are correct**
3. **Check Node.js is installed:** `node --version`
4. **Try manually:** `npx -y slack-mcp-server@latest --transport stdio`

### Tokens Not Working

- **Tokens expired:** Get fresh tokens from browser
- **Wrong workspace:** Make sure tokens are from the correct workspace
- **Enterprise workspace:** May need additional configuration

### Cache Issues

Delete cache files and restart:

```bash
rm .users_cache.json .channels_cache_v2.json
```

### No Channels Showing

1. **Check cache is enabled**
2. **Verify you're in channels**
3. **Wait for initial cache build** (can take 30s-1min)

## Advanced Configuration

### Using Behind Proxy

```json
{
  "env": {
    "SLACK_MCP_PROXY": "http://proxy.company.com:8080"
  }
}
```

### Enterprise Slack

```json
{
  "env": {
    "SLACK_MCP_USER_AGENT": "Mozilla/5.0 ...",
    "SLACK_MCP_CUSTOM_TLS": "true"
  }
}
```

### Debug Mode

```json
{
  "env": {
    "SLACK_MCP_LOG_LEVEL": "debug"
  }
}
```

## Security Best Practices

1. **Never commit tokens to git**
2. **Use environment variables or secure storage**
3. **Rotate tokens regularly**
4. **Keep `SLACK_MCP_ADD_MESSAGE_TOOL` disabled unless needed**
5. **Use channel whitelist when enabling message posting**

## Getting Help

- **Documentation:** [docs/README.md](docs/README.md)
- **Issues:** [GitHub Issues](https://github.com/korotovsky/slack-mcp-server/issues)
- **API Reference:** [docs/Slack_API_Complete_Reference.md](docs/Slack_API_Complete_Reference.md)

## Full Configuration Example

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "slack-mcp-server@latest",
        "--transport",
        "stdio"
      ],
      "env": {
        "SLACK_MCP_XOXC_TOKEN": "xoxc-1234567890123-4567890123456-...",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-AbCdEfGhIjKlMnOpQrStUvWxYz...",
        "SLACK_MCP_PORT": "13080",
        "SLACK_MCP_HOST": "127.0.0.1",
        "SLACK_MCP_USERS_CACHE": ".users_cache.json",
        "SLACK_MCP_CHANNELS_CACHE": ".channels_cache_v2.json",
        "SLACK_MCP_LOG_LEVEL": "info",
        "SLACK_MCP_ADD_MESSAGE_TOOL": "false"
      }
    }
  }
}
```

---

**Ready to use Slack with Claude Code!** 🚀
