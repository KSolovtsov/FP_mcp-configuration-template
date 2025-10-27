# Quick Start Guide

Get started with Jira MCP Server in 5 minutes.

## Prerequisites Check

- ✅ Node.js 18+ installed
- ✅ Jira API token generated
- ✅ Claude Code installed

## Installation (3 steps)

### 1. Setup Environment
```bash
cd ~/FP_mcp-configuration-template/jira-mcp-server
npm install
```

Create `.env`:
```env
JIRA_HOST=keplercommerce.atlassian.net
JIRA_EMAIL=your-email@keplercommerce.com
JIRA_API_TOKEN=your_token_here
```

### 2. Build
```bash
npm run build
```

### 3. Configure Claude Code

Edit `claude_desktop_config.json`:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/FP_mcp-configuration-template/jira-mcp-server/dist/index.js"]
    }
  }
}
```

**Restart Claude Code** completely!

## First Commands

### Test Connection
```
List all my Jira projects
```

### View Your Tasks
```
Show me my current tasks in project PROD
```

### Create an Issue
```
Create a new task in PROD project:
- Summary: Set up authentication system
- Priority: High
```

### Search with JQL
```
Find all bugs in PROD that are unassigned
```

## Essential Tools Cheat Sheet

### Issues
| Tool | Usage |
|------|-------|
| `jira_search_issues` | Search with JQL |
| `jira_create_issue` | Create new issue |
| `jira_get_issue` | Get issue details by key (e.g., PROD-123) |
| `jira_update_issue` | Update issue fields |
| `jira_transition_issue` | Change status (To Do → In Progress → Done) |
| `jira_add_comment` | Add comment to issue |

### Boards & Sprints
| Tool | Usage |
|------|-------|
| `jira_get_boards` | List all boards in project |
| `jira_get_board_sprints` | Get sprints for a board |
| `jira_create_sprint` | Create new sprint |
| `jira_start_sprint` | Start a sprint |
| `jira_add_issues_to_sprint` | Add issues to sprint |
| `jira_get_sprint_issues` | Get all issues in sprint |

### Projects & Users
| Tool | Usage |
|------|-------|
| `jira_get_projects` | List all accessible projects |
| `jira_get_current_user` | Get your user info |

## Common Workflows

### Daily Standup Prep
```
Show me:
1. Issues I'm currently working on
2. Issues I completed yesterday
3. Any blockers assigned to me
```

### Sprint Planning
```
For board 268:
1. Show me the backlog
2. Create a new sprint named "Sprint 24"
3. Add issues PROD-123, PROD-124, PROD-125 to the sprint
4. Start the sprint
```

### Bug Triage
```
Show me all unassigned bugs in PROD with high priority
```

### Release Planning
```
Search for all issues in PROD with:
- Status: Done
- Sprint: Sprint 23
- Group by Epic
```

## JQL Quick Reference

### Basic Syntax
```
project = PROD AND status = "In Progress"
```

### Common Queries

**My active work**:
```
assignee = currentUser() AND status IN ("In Progress", "To Do")
```

**Sprint issues**:
```
project = PROD AND Sprint = 893
```

**Overdue tasks**:
```
dueDate < now() AND status != Done
```

**High priority bugs**:
```
type = Bug AND priority = High AND status != Done
```

**Recent activity**:
```
updated >= -7d ORDER BY updated DESC
```

## Your Jira Setup

**Instance**: keplercommerce.atlassian.net
**Main Project**: PROD (PORTAL/SAAS)
**Boards**: 8 boards available (IDs: 268, 265, 167, 166, 232, 267, 266, 298)

## Quick Examples

### Example 1: Create Issue in Active Sprint
```javascript
// In Claude Code, just say:
"Create a task in PROD project, summary 'Add login validation',
add it to the active sprint on board 268"
```

The MCP will:
1. Find active sprint on board 268
2. Create the issue
3. Add it to the sprint automatically

### Example 2: Sprint Report
```javascript
"Give me a sprint report for board 268's active sprint"
```

Gets:
- Sprint details (dates, goals)
- All issues in sprint
- Status breakdown
- Who's working on what

### Example 3: Epic Progress
```javascript
"Show me all issues in Epic PROD-100 and their status"
```

## Troubleshooting Quick Fixes

### Server not working?
```bash
# Rebuild
npm run build

# Check it runs
node dist/index.js

# Restart Claude Code (IMPORTANT!)
```

### Can't authenticate?
- Check `.env` has correct credentials
- Verify API token is valid
- Test manually: `curl -u email:token https://keplercommerce.atlassian.net/rest/api/3/myself`

### Tools not showing?
- Verify `claude_desktop_config.json` syntax
- Check absolute path to `dist/index.js`
- Look at Claude logs: `%APPDATA%\Claude\logs\` (Windows)

## Next Steps

📚 **Learn More**:
- [API Reference](API_REFERENCE.md) - All 30+ tools documented
- [Usage Guide](USAGE_GUIDE.md) - Detailed workflows
- [JQL Reference](JQL_REFERENCE.md) - Master JQL queries
- [Boards & Sprints](BOARDS_SPRINTS.md) - Agile management

🔧 **Advanced**:
- [Troubleshooting](TROUBLESHOOTING.md) - Fix common issues
- [Documentation Index](DOCUMENTATION_INDEX.md) - Find anything

💬 **Get Help**: kostyantyn@keplercommerce.com

---

**You're ready to go!** Start by asking Claude to show your Jira projects.
