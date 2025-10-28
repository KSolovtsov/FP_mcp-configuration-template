# MCP Servers Configuration for Claude Code

This repository contains setup instructions for MCP (Model Context Protocol) servers to integrate Notion, Jira, and Slack with Claude Code.

## What is MCP?

MCP (Model Context Protocol) enables Claude Code to integrate with external services. With MCP servers, Claude can:
- Read and create pages in Notion
- Manage tasks in Jira
- Read and send messages in Slack
- Search across all your workspace tools
- Work with databases and more

## Requirements

- Node.js >= 18.0.0
- Claude Code
- **API keys from Kateryna or Kostyantyn**

## Quick Setup

### 1. Get API Keys

**IMPORTANT:** Before installation, request API keys from:
- **Kateryna** - kateryna@keplercommerce.com
- **Kostyantyn** - kostyantyn@keplercommerce.com

You will need:
- `NOTION_API_KEY` - for Notion access
- `JIRA_HOST` - Jira host (keplercommerce.atlassian.net)
- `JIRA_EMAIL` - your Jira email
- `JIRA_API_TOKEN` - Jira token
- `JIRA_BOARD_ID` - Board ID (optional, see available boards below)
- `SLACK_MCP_XOXC_TOKEN` - Slack browser token (you can extract yourself)
- `SLACK_MCP_XOXD_TOKEN` - Slack browser cookie (you can extract yourself)

### 2. Clone This Repository

```bash
# Clone the repository with both MCP servers
git clone https://github.com/KSolovtsov/FP_mcp-configuration-template.git
cd FP_mcp-configuration-template
```

The repository includes:
- `notion-mcp-enhanced/` - Complete Notion MCP server with source code
- `jira-mcp-server/` - Complete Jira MCP server with source code
- `slack-mcp-server/` - Complete Slack MCP server with source code
- Configuration templates and examples
- Complete API documentation (200+ Slack methods)

### 3. Install Dependencies

```bash
# Notion MCP
cd notion-mcp-enhanced
npm install
npm run build

# Jira MCP
cd ../jira-mcp-server
npm install
npm run build

# Slack MCP (Go-based, no npm install needed)
cd ../slack-mcp-server
# Slack MCP can be used via NPX or local build
# See Slack-specific instructions below
```

### 4. Create .env Files

#### Notion MCP

Create `.env` file in `notion-mcp-enhanced` folder:

```bash
NOTION_API_KEY=your_key_from_kateryna_or_kostyantyn
```

#### Jira MCP

Create `.env` file in `jira-mcp-server` folder:

```bash
JIRA_HOST=keplercommerce.atlassian.net
JIRA_EMAIL=your_email@keplercommerce.com
JIRA_API_TOKEN=your_token_from_kateryna_or_kostyantyn
JIRA_BOARD_ID=268
```

**Project Information:**
- **Project Key**: PROD
- **Project URL**: https://keplercommerce.atlassian.net/jira/software/c/projects/PROD
- **Project Name**: PORTAL/SAAS

**Available Boards (PROD Project):**
- **268** - Product (Scrum) - Default board
- **298** - All work/ Portal (Scrum)
- **232** - Engineering (Scrum)
- **167** - Listing Optimization (Scrum)
- **166** - Advertising Board (Scrum)
- **265** - QA (Kanban)
- **266** - Business Process (Scrum)
- **267** - Reporting (Scrum)

Choose the appropriate `JIRA_BOARD_ID` based on your team.

#### Slack MCP

Create `.env` file in `slack-mcp-server` folder:

```bash
SLACK_MCP_XOXC_TOKEN=xoxc-your-token-here
SLACK_MCP_XOXD_TOKEN=xoxd-your-cookie-here
SLACK_MCP_LOG_LEVEL=info
SLACK_MCP_ADD_MESSAGE_TOOL=false
```

**How to get Slack tokens:**

1. Open Slack in your browser (Chrome/Firefox)
2. Open Developer Tools (F12)
3. Go to Network tab
4. Refresh the page
5. Find any request to `api.slack.com`
6. In Headers, find:
   - `Authorization: Bearer xoxc-...` → Your `SLACK_MCP_XOXC_TOKEN`
   - `Cookie: d=xoxd-...` → Your `SLACK_MCP_XOXD_TOKEN`

**Important:** These are YOUR personal tokens. Each team member needs to get their own.

**Replace:**
- `your_key_from_kateryna_or_kostyantyn` - with key from Kateryna/Kostyantyn
- `your_email@keplercommerce.com` - with your work email
- `your_token_from_kateryna_or_kostyantyn` - with token from Kateryna/Kostyantyn
- `xoxc-your-token-here` - with your Slack xoxc token (extract yourself)
- `xoxd-your-cookie-here` - with your Slack xoxd cookie (extract yourself)

### 5. Configure Claude Code

#### Find configuration file:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Add MCP servers to configuration:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": [
        "/path/to/FP_mcp-configuration-template/notion-mcp-enhanced/dist/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "your_key_from_kateryna_or_kostyantyn"
      }
    },
    "jira": {
      "command": "node",
      "args": [
        "/path/to/FP_mcp-configuration-template/jira-mcp-server/dist/index.js"
      ],
      "env": {
        "JIRA_HOST": "keplercommerce.atlassian.net",
        "JIRA_EMAIL": "your_email@keplercommerce.com",
        "JIRA_API_TOKEN": "your_token_from_kateryna_or_kostyantyn",
        "JIRA_BOARD_ID": "268"
      }
    },
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "slack-mcp-server@latest",
        "--transport",
        "stdio"
      ],
      "env": {
        "SLACK_MCP_XOXC_TOKEN": "xoxc-your-token-here",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-your-cookie-here",
        "SLACK_MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

**Windows path example:**
```json
"C:/Users/YourUsername/FP_mcp-configuration-template/notion-mcp-enhanced/dist/index.js"
```

**macOS/Linux path example:**
```json
"/Users/YourUsername/FP_mcp-configuration-template/notion-mcp-enhanced/dist/index.js"
```

### 6. Restart Claude Code

Completely close and reopen Claude Code.

## Verify Installation

After starting Claude Code, try:

**For Notion:**
```
Show my recent Notion pages
```

**For Jira:**
```
Show my open Jira issues
```

**For Slack:**
```
List my Slack channels
Show recent messages from #general
```

## Security

**CRITICAL:**
- ❌ DO NOT commit `.env` files to Git
- ❌ DO NOT share API keys in chats/emails
- ❌ DO NOT publish keys in public repositories
- ✅ Keep keys only in local `.env` files
- ✅ Request new keys from Kateryna/Kostyantyn if needed

## Troubleshooting

### MCP server won't start

1. Check Node.js version:
```bash
node --version
```
Should be >= 18.0.0

2. Reinstall dependencies:
```bash
npm install
npm run build
```

### Claude doesn't see MCP servers

1. Verify paths in `claude_desktop_config.json`
2. Ensure `.env` files exist and are populated
3. Completely restart Claude Code

### Authorization errors

1. Verify API keys are correct
2. Check for extra spaces in `.env` files
3. Contact Kateryna or Kostyantyn for new keys

## Features

### Notion MCP
- Search and read pages
- Create and edit pages
- Work with databases
- Filters and sorting
- Block content management

### Jira MCP
- Search issues (JQL queries)
- Create and update issues
- Work with sprints and boards
- Comments and status transitions
- **Primary focus on PROD project** (PORTAL/SAAS)
- Access to 8 different boards (Product, Engineering, QA, etc.)

### Slack MCP
- Read messages from channels and DMs
- Search messages with filters (date, user, content)
- List all channels (public, private, DMs, groups)
- Send messages (optional, disabled by default)
- Thread support (read and reply)
- Smart history fetch (by date or count)
- **Complete API documentation** - 200+ Slack methods documented
- **AI-friendly** - Fast search and examples

## Contacts for API Keys

- **Kateryna** - kateryna@keplercommerce.com
- **Kostyantyn** - kostyantyn@keplercommerce.com

## License

MIT
