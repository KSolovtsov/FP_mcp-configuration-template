# MCP Servers Configuration for Claude Desktop

This repository contains setup instructions for MCP (Model Context Protocol) servers to integrate Notion and Jira with Claude Desktop.

## What is MCP?

MCP (Model Context Protocol) enables Claude Desktop to integrate with external services. With MCP servers, Claude can:
- Read and create pages in Notion
- Manage tasks in Jira
- Work with databases and more

## Requirements

- Node.js >= 18.0.0
- Claude Desktop
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

### 2. Clone MCP Server Repositories

```bash
# Create projects folder
mkdir -p ~/Projects

# Notion MCP Server
cd ~/Projects
git clone [NOTION_MCP_REPO_URL] notion-mcp-enhanced

# Jira MCP Server
git clone [JIRA_MCP_REPO_URL] jira-mcp-server
```

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

**Replace:**
- `your_key_from_kateryna_or_kostyantyn` - with key from Kateryna/Kostyantyn
- `your_email@keplercommerce.com` - with your work email
- `your_token_from_kateryna_or_kostyantyn` - with token from Kateryna/Kostyantyn

### 5. Configure Claude Desktop

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
        "/full/path/to/notion-mcp-enhanced/dist/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "your_key_from_kateryna_or_kostyantyn"
      }
    },
    "jira": {
      "command": "node",
      "args": [
        "/full/path/to/jira-mcp-server/dist/index.js"
      ],
      "env": {
        "JIRA_HOST": "keplercommerce.atlassian.net",
        "JIRA_EMAIL": "your_email@keplercommerce.com",
        "JIRA_API_TOKEN": "your_token_from_kateryna_or_kostyantyn",
        "JIRA_BOARD_ID": "268"
      }
    }
  }
}
```

**Windows path example:**
```
"C:/Users/YourUsername/Projects/notion-mcp-enhanced/dist/index.js"
```

**macOS/Linux path example:**
```
"/Users/YourUsername/Projects/notion-mcp-enhanced/dist/index.js"
```

### 6. Restart Claude Desktop

Completely close and reopen Claude Desktop.

## Verify Installation

After starting Claude Desktop, try:

**For Notion:**
```
Show my recent Notion pages
```

**For Jira:**
```
Show my open Jira issues
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
3. Completely restart Claude Desktop

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

## Contacts for API Keys

- **Kateryna** - kateryna@keplercommerce.com
- **Kostyantyn** - kostyantyn@keplercommerce.com

## License

MIT
