# Installation Guide

Complete guide to installing and configuring the Jira MCP Server.

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Jira Cloud Account**: With admin or appropriate permissions
- **Claude Desktop**: Latest version installed

## Step 1: Get Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a label (e.g., "MCP Server")
4. Copy the token immediately (you won't see it again)

## Step 2: Install MCP Server

### Clone or Navigate to Directory
```bash
cd ~/Projects/Jira/mcp-server
```

### Install Dependencies
```bash
npm install
```

Expected packages:
- `@modelcontextprotocol/sdk`
- `axios`
- `dotenv`

## Step 3: Configure Environment

Create `.env` file in the project root:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` with your credentials:
```env
JIRA_HOST=keplercommerce.atlassian.net
JIRA_EMAIL=kostyantyn@keplercommerce.com
JIRA_API_TOKEN=your_api_token_here
```

**Important**:
- Do NOT include `https://` in JIRA_HOST
- Use your actual Atlassian account email
- Keep `.env` secret (already in .gitignore)

## Step 4: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

## Step 5: Test the Server

Run a quick test:
```bash
node dist/index.js
```

You should see MCP server initialization messages. Press `Ctrl+C` to stop.

## Step 6: Configure Claude Desktop

### Locate Configuration File

**macOS**:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```bash
~/.config/Claude/claude_desktop_config.json
```

### Add MCP Server Configuration

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [
        "C:/Users/kossa/Projects/Jira/mcp-server/dist/index.js"
      ],
      "env": {
        "JIRA_HOST": "keplercommerce.atlassian.net",
        "JIRA_EMAIL": "kostyantyn@keplercommerce.com",
        "JIRA_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**Alternative**: Reference `.env` file (recommended)
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [
        "C:/Users/kossa/Projects/Jira/mcp-server/dist/index.js"
      ]
    }
  }
}
```

With this approach, the server reads from `.env` file automatically.

### Important Path Notes

**Windows**: Use forward slashes `/` or escaped backslashes `\\`
- ✅ `C:/Users/kossa/Projects/Jira/mcp-server/dist/index.js`
- ✅ `C:\\Users\\kossa\\Projects\\Jira\\mcp-server\\dist\\index.js`
- ❌ `C:\Users\kossa\...` (will fail)

**macOS/Linux**: Use full absolute paths
- ✅ `/Users/username/Projects/Jira/mcp-server/dist/index.js`
- ❌ `~/Projects/...` (may not work)

## Step 7: Restart Claude Desktop

1. **Quit Claude Desktop completely** (not just close window)
   - macOS: `Cmd+Q`
   - Windows: Right-click taskbar icon → Quit
2. **Restart Claude Desktop**
3. Open a new conversation

## Step 8: Verify Installation

In Claude Desktop, try:

```
Use the Jira MCP to list all projects
```

Or check available tools:
```
What Jira MCP tools are available?
```

You should see 30+ tools including board and sprint management tools.

## Troubleshooting Installation

### Server Not Showing Up

**Check Claude Desktop Logs**:
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Windows: `%APPDATA%\Claude\logs\mcp*.log`

**Common Issues**:
1. **Path incorrect**: Verify absolute path to `dist/index.js`
2. **Build missing**: Run `npm run build` again
3. **JSON syntax**: Validate config with [JSONLint](https://jsonlint.com)

### Authentication Errors

```
401 Unauthorized
```

**Solutions**:
1. Verify API token is correct
2. Check email matches Jira account
3. Ensure token hasn't expired
4. Regenerate token if needed

### Permission Errors

```
403 Forbidden
```

**Solutions**:
1. Verify your Jira account has appropriate permissions
2. Check project access rights
3. Contact Jira admin if needed

### Module Not Found

```
Cannot find module '@modelcontextprotocol/sdk'
```

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Updating the Server

When you make changes to the code:

```bash
# Rebuild
npm run build

# Restart Claude Desktop (important!)
# The server won't reload until Claude restarts
```

## Multiple Projects Setup

To use with multiple Jira instances, create separate server entries:

```json
{
  "mcpServers": {
    "jira-prod": {
      "command": "node",
      "args": ["path/to/server1/dist/index.js"]
    },
    "jira-dev": {
      "command": "node",
      "args": ["path/to/server2/dist/index.js"]
    }
  }
}
```

## Security Best Practices

1. **Never commit `.env`** - Already in .gitignore
2. **Use separate tokens** - Create specific tokens for MCP
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Limit permissions** - Use least-privilege access
5. **Keep logs secure** - MCP logs may contain sensitive data

## Next Steps

- Read [Quick Start Guide](QUICK_START.md) for usage examples
- Explore [API Reference](API_REFERENCE.md) for all available tools
- Check [Usage Guide](USAGE_GUIDE.md) for common workflows

## Getting Help

If you encounter issues:
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review Claude Desktop logs
3. Verify Jira API connectivity: `curl -u email:token https://keplercommerce.atlassian.net/rest/api/3/myself`
4. Contact support: kostyantyn@keplercommerce.com

---

**Estimated Setup Time**: 10-15 minutes
