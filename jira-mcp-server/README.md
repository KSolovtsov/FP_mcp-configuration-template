# Jira MCP Server

A comprehensive Model Context Protocol (MCP) server for Jira integration, providing full access to Jira REST API v3 and Agile API v1.0.

## Features

### Core Jira Operations
- **Issue Management**: Create, read, update, transition, and search issues using JQL
- **Project Management**: List and query projects
- **User Management**: List users and get current user information
- **Comments**: Add and retrieve comments on issues

### Board & Sprint Management (NEW!)
- **Board Operations**: List, query, and configure Scrum/Kanban boards
- **Sprint Management**: Create, start, close, and manage sprints
- **Sprint Planning**: Add/remove issues, move between sprints
- **Board Backlog**: Query and manage board backlogs
- **Active Sprint Tracking**: Get current sprint information

### Advanced Features
- **Smart Issue Creation**: Auto-add issues to active sprints when creating
- **JQL Search**: Full JQL query language support with advanced filtering
- **Pagination Support**: Handle large datasets efficiently
- **Error Handling**: Comprehensive error messages and validation

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (`.env`):
   ```
   JIRA_HOST=your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```

3. **Build and run**:
   ```bash
   npm run build
   node dist/index.js
   ```

4. **Configure Claude Code** - Add to `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "jira": {
         "command": "node",
         "args": ["C:/Users/kossa/Projects/Jira/mcp-server/dist/index.js"]
       }
     }
   }
   ```

## Documentation

### Getting Started
- [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions
- [Quick Start Guide](docs/QUICK_START.md) - Get up and running in 5 minutes

### Reference Documentation
- [API Reference](docs/API_REFERENCE.md) - Complete tool reference (30+ tools)
- [JQL Reference](docs/JQL_REFERENCE.md) - JQL syntax and examples
- [Boards & Sprints Guide](docs/BOARDS_SPRINTS.md) - Board/sprint management

### Usage Guides
- [Usage Guide](docs/USAGE_GUIDE.md) - Common workflows and examples
- [Documentation Index](docs/DOCUMENTATION_INDEX.md) - AI-friendly navigation

### Support
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Support](docs/SUPPORT.md) - Get help

## Available Tools (30+)

### Issues (9 tools)
- `jira_search_issues` - Search with JQL
- `jira_get_issue` - Get issue details
- `jira_create_issue` - Create issue (with sprint/board support)
- `jira_update_issue` - Update issue fields
- `jira_transition_issue` - Change status
- `jira_add_comment` - Add comment
- `jira_get_issue_transitions` - Get available transitions
- `jira_assign_issue` - Assign to user
- `jira_get_issue_watchers` - Get watchers

### Boards (4 tools)
- `jira_get_boards` - List all boards
- `jira_get_board` - Get board details
- `jira_get_board_configuration` - Get board settings
- `jira_get_board_issues` - Query board issues

### Sprints (10 tools)
- `jira_get_board_sprints` - List board sprints
- `jira_get_sprint` - Get sprint details
- `jira_create_sprint` - Create new sprint
- `jira_update_sprint` - Update sprint
- `jira_start_sprint` - Start sprint
- `jira_close_sprint` - Complete sprint
- `jira_get_sprint_issues` - Get sprint issues
- `jira_add_issues_to_sprint` - Add issues to sprint
- `jira_move_issues_to_backlog` - Move to backlog
- `jira_get_board_backlog` - Get backlog items

### Projects & Users
- `jira_get_projects` - List projects
- `jira_get_current_user` - Get current user info
- `jira_list_users` - Search users

## Example Usage

### Create Issue and Add to Active Sprint
```javascript
// Search for active sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

// Create issue in active sprint
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Implement user authentication",
  description: "Add JWT-based authentication system",
  issueType: "Task",
  priority: "High",
  sprintId: sprints[0].id  // Auto-adds to sprint
});
```

### Sprint Planning Workflow
```javascript
// Get board backlog
const backlog = await mcp__jira__jira_get_board_backlog({
  boardId: 268,
  maxResults: 50
});

// Add issues to sprint
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-123", "PROD-124", "PROD-125"]
});

// Start sprint
await mcp__jira__jira_start_sprint({
  sprintId: 893
});
```

### Advanced JQL Search
```javascript
await mcp__jira__jira_search_issues({
  jql: "project = PROD AND assignee = currentUser() AND status IN ('In Progress', 'To Do') AND Sprint in openSprints() ORDER BY priority DESC",
  maxResults: 50
});
```

## Your Jira Setup

**Instance**: keplercommerce.atlassian.net
**Project**: PROD (PORTAL/SAAS)
**Boards**: 8 boards (IDs: 268, 265, 167, 166, 232, 267, 266, 298)

## Requirements

- Node.js 18+
- Jira Cloud account with API token
- Claude Code (for MCP integration)

## Tech Stack

- TypeScript
- Jira REST API v3
- Jira Agile API v1.0
- Model Context Protocol SDK

## Support

For issues or questions:
- Email: kostyantyn@keplercommerce.com
- GitHub Issues: [Report a bug](https://github.com/your-org/jira-mcp/issues)

## License

MIT License - See LICENSE file for details

---

**Note**: This MCP server provides full Jira API access. Ensure proper authentication and permissions are configured.
