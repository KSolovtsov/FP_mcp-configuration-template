# Team Setup Guide - MCP Servers for Claude Code

> **For:** Kepler Commerce Team
> **Updated:** 2025-10-28
> **Contacts:** Kateryna (kateryna@keplercommerce.com), Kostyantyn (kostyantyn@keplercommerce.com)

---

## 🚀 Quick Start (5 Minutes)

This guide will help you set up Notion, Jira, and Slack integration with Claude Code.

### What You'll Get

- ✅ **Notion** - Read and create pages, manage databases
- ✅ **Jira** - Search issues, create tasks, manage sprints
- ✅ **Slack** - Read messages, search conversations, list channels

---

## Step 1: Install Prerequisites

### Check Node.js Version

```bash
node --version
```

Should show `v18.0.0` or higher. If not, download from: https://nodejs.org/

---

## Step 2: Get API Keys

### For Notion & Jira

**Contact:**
- **Kateryna** - kateryna@keplercommerce.com
- **Kostyantyn** - kostyantyn@keplercommerce.com

**Request:**
- `NOTION_API_KEY`
- `JIRA_API_TOKEN`

### For Slack (Do It Yourself)

You need to extract tokens from your browser:

1. **Open Slack** in Chrome/Firefox
2. **Open DevTools** (Press F12)
3. **Go to Network tab**
4. **Refresh the page** (F5)
5. **Click on any request to `api.slack.com`**
6. **In Request Headers find:**
   - `Authorization: Bearer xoxc-1234567890123-4567890123456-...`
     → Copy everything after `Bearer ` → This is your `SLACK_MCP_XOXC_TOKEN`
   - `Cookie: d=xoxd-AbCdEfGhIjKlMnOpQrStUvWxYz...`
     → Copy everything after `d=` → This is your `SLACK_MCP_XOXD_TOKEN`

**Screenshot guide:** See `slack-mcp-server/docs/01-authentication-setup.md` for detailed screenshots

---

## Step 3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/KSolovtsov/FP_mcp-configuration-template.git
cd FP_mcp-configuration-template
```

---

## Step 4: Install MCP Servers

### Notion MCP

```bash
cd notion-mcp-enhanced
npm install
npm run build
cd ..
```

### Jira MCP

```bash
cd jira-mcp-server
npm install
npm run build
cd ..
```

### Slack MCP

```bash
# Slack MCP uses NPX - no installation needed!
# It will auto-download when Claude Code starts
```

---

## Step 5: Configure Tokens

### Create .env Files

#### For Notion

Create `notion-mcp-enhanced/.env`:
```bash
NOTION_API_KEY=secret_XXXXX
```
*(Replace with key from Kateryna/Kostyantyn)*

#### For Jira

Create `jira-mcp-server/.env`:
```bash
JIRA_HOST=keplercommerce.atlassian.net
JIRA_EMAIL=your_email@keplercommerce.com
JIRA_API_TOKEN=ATATT3xFfGF0XXXXX
JIRA_BOARD_ID=268
```
*(Replace with your email and token from Kateryna/Kostyantyn)*

**Available Boards:**
- **268** - Product (Scrum) - Default
- **298** - All work/Portal (Scrum)
- **232** - Engineering (Scrum)
- **167** - Listing Optimization (Scrum)
- **166** - Advertising Board (Scrum)
- **265** - QA (Kanban)

#### For Slack

Create `slack-mcp-server/.env`:
```bash
SLACK_MCP_XOXC_TOKEN=xoxc-1234567890123-4567890123456-XXXXX
SLACK_MCP_XOXD_TOKEN=xoxd-AbCdEfGhIjKlMnOpQrStUvWxYzXXXXX
SLACK_MCP_LOG_LEVEL=info
SLACK_MCP_ADD_MESSAGE_TOOL=false
```
*(Replace with tokens you extracted from browser)*

---

## Step 6: Configure Claude Code

### Find Configuration File

**Windows:**
```
C:\Users\YourName\AppData\Roaming\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Add MCP Servers

Replace the entire content with:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": [
        "C:/Users/YourName/FP_mcp-configuration-template/notion-mcp-enhanced/dist/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "secret_XXXXX"
      }
    },
    "jira": {
      "command": "node",
      "args": [
        "C:/Users/YourName/FP_mcp-configuration-template/jira-mcp-server/dist/index.js"
      ],
      "env": {
        "JIRA_HOST": "keplercommerce.atlassian.net",
        "JIRA_EMAIL": "your_email@keplercommerce.com",
        "JIRA_API_TOKEN": "ATATT3xFfGF0XXXXX",
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
        "SLACK_MCP_XOXC_TOKEN": "xoxc-1234567890123-XXXXX",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-jexvBdnQXT8dXXXXX",
        "SLACK_MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

**Important:**
- Replace `YourName` with your actual Windows username
- Replace all `XXXXX` with actual tokens
- Use forward slashes `/` even on Windows
- On macOS/Linux use full paths like `/Users/YourName/...`

---

## Step 7: Restart Claude Code

**Completely close** Claude Code and **reopen** it.

---

## Step 8: Verify Everything Works

Open Claude Code and try these commands:

### Test Notion
```
Show my recent Notion pages
```

### Test Jira
```
Show my open Jira issues
List all PROD project boards
```

### Test Slack
```
List my Slack channels
Show recent messages from #general
Search for "budget" in #product
```

If all three work - you're done! 🎉

---

## 🆘 Troubleshooting

### MCP Server Not Starting

**Check logs:**

Windows:
```bash
type %APPDATA%\Claude\logs\mcp*.log
```

macOS:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

### Common Issues

#### ❌ "Server failed to start"

**Solution:**
1. Check Node.js version: `node --version` (must be 18+)
2. Reinstall dependencies: `npm install && npm run build`
3. Check paths in `claude_desktop_config.json` are correct

#### ❌ "Authorization failed" (Notion/Jira)

**Solution:**
1. Verify API keys in `.env` files
2. No extra spaces in keys
3. Request new keys from Kateryna/Kostyantyn

#### ❌ "not_authed" (Slack)

**Solution:**
1. Get fresh tokens from browser (they expire)
2. Make sure both xoxc AND xoxd tokens are set
3. Check no extra spaces in `.env` file

#### ❌ Slack shows empty channels

**Solution:**
1. Wait 30-60 seconds for initial cache build
2. Check you're actually a member of channels
3. Restart Claude Code

---

## 🔒 Security Reminders

**DO NOT:**
- ❌ Commit `.env` files to Git
- ❌ Share API keys in Slack/email
- ❌ Screenshot tokens
- ❌ Push tokens to GitHub

**DO:**
- ✅ Keep tokens in `.env` files only
- ✅ Request keys from Kateryna/Kostyantyn
- ✅ Extract Slack tokens yourself
- ✅ Regenerate if compromised

---

## 📚 Documentation

### For Slack (200+ API Methods!)

The repository includes complete Slack API documentation:

- **`slack-mcp-server/docs/Slack_API_Complete_Reference.md`**
  - 200+ Slack API methods
  - All parameters documented
  - Working examples
  - AI-friendly search

- **`slack-mcp-server/docs/Slack_Admin_API_Complete_Guide.md`**
  - 24 essential methods
  - Python/Bash scripts
  - Use cases
  - Troubleshooting

### Quick Reference

| What You Want | Where to Look |
|---------------|---------------|
| How to add users to Slack channel | `Slack_API_Complete_Reference.md` → Search "invite" |
| How to search messages | `Slack_API_Complete_Reference.md` → Search "search" |
| Automation scripts | `Slack_Admin_API_Complete_Guide.md` → "Usage Examples" |
| Notion setup | `notion-mcp-enhanced/README.md` |
| Jira setup | `jira-mcp-server/README.md` |

---

## 💡 What Can You Do?

### With Notion
- "Create a new page in my workspace"
- "Search for pages about marketing"
- "Add a task to my project database"

### With Jira
- "Show my open issues"
- "Create a bug for the login page"
- "What's in the current sprint?"
- "Add comment to PROD-123"

### With Slack
- "Show messages from #engineering today"
- "Search for 'deadline' from @john in #product"
- "List all my direct messages"
- "Show thread replies for that message"

### Combined Workflows
- "Find Jira issues mentioned in #engineering Slack channel"
- "Summarize today's #product Slack messages and create Notion page"
- "Check Jira sprint and notify team in #general"

---

## 🆘 Need Help?

**For API Keys:**
- Kateryna - kateryna@keplercommerce.com
- Kostyantyn - kostyantyn@keplercommerce.com

**For Technical Issues:**
- Check documentation in each `*/docs/` folder
- Open issue on GitHub
- Ask Kostyantyn

**For Slack Tokens:**
- Extract yourself from browser (see Step 2 above)
- See detailed guide: `slack-mcp-server/docs/01-authentication-setup.md`

---

## 📦 Repository Structure

```
FP_mcp-configuration-template/
├── README.md                           # Main setup guide
├── TEAM_SETUP_GUIDE.md                # This file
├── claude_desktop_config.json.example # Config template
├── .env.notion.example                # Notion env template
├── .env.jira.example                  # Jira env template
├── .env.slack.example                 # Slack env template
│
├── notion-mcp-enhanced/               # Notion MCP
│   ├── dist/index.js                  # Compiled server
│   └── .env                           # Your tokens here
│
├── jira-mcp-server/                   # Jira MCP
│   ├── dist/index.js                  # Compiled server
│   └── .env                           # Your tokens here
│
└── slack-mcp-server/                  # Slack MCP
    ├── docs/
    │   ├── Slack_API_Complete_Reference.md    # 200+ methods
    │   └── Slack_Admin_API_Complete_Guide.md  # Admin guide
    └── .env                           # Your tokens here
```

---

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Notion MCP: npm install & build
- [ ] Jira MCP: npm install & build
- [ ] API keys from Kateryna/Kostyantyn
- [ ] Slack tokens extracted from browser
- [ ] All `.env` files created
- [ ] `claude_desktop_config.json` updated
- [ ] Claude Code restarted
- [ ] Tested all three integrations

---

## 🎉 You're All Set!

Once everything is configured, you can use Claude Code to:

- Search across Notion, Jira, and Slack simultaneously
- Automate workflows between systems
- Get AI-powered insights from your workspace data
- Manage projects more efficiently

**Happy coding with Claude!** 🚀

---

**Questions?** Ask Kostyantyn or Kateryna!
