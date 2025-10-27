# API Reference

Complete reference for all Jira MCP Server tools.

## Table of Contents

- [Issue Management](#issue-management) (9 tools)
- [Board Management](#board-management) (4 tools)
- [Sprint Management](#sprint-management) (10 tools)
- [Project Management](#project-management) (2 tools)
- [User Management](#user-management) (2 tools)
- [Comments](#comments) (2 tools)

---

## Issue Management

### jira_search_issues

Search for issues using JQL (Jira Query Language).

**Parameters**:
- `jql` (string, required): JQL query string
- `maxResults` (number, optional): Maximum results to return (default: 50, max: 100)
- `startAt` (number, optional): Pagination offset (default: 0)

**Example**:
```javascript
await mcp__jira__jira_search_issues({
  jql: "project = PROD AND assignee = currentUser() AND status != Done",
  maxResults: 50
});
```

**Response**:
```json
{
  "total": 25,
  "issues": [
    {
      "key": "PROD-123",
      "fields": {
        "summary": "Implement authentication",
        "status": {"name": "In Progress"},
        "assignee": {"displayName": "John Doe"},
        "priority": {"name": "High"}
      }
    }
  ]
}
```

---

### jira_get_issue

Get detailed information about a specific issue.

**Parameters**:
- `issueKey` (string, required): Issue key (e.g., "PROD-123")

**Example**:
```javascript
await mcp__jira__jira_get_issue({
  issueKey: "PROD-123"
});
```

**Response**: Full issue object with all fields, including custom fields, comments, attachments, etc.

---

### jira_create_issue

Create a new issue with optional sprint/board assignment.

**Parameters**:
- `project` (string, required): Project key (e.g., "PROD")
- `summary` (string, required): Issue title
- `issueType` (string, optional): Type (Task, Bug, Story, Epic) - default: "Task"
- `description` (string, optional): Issue description
- `priority` (string, optional): Priority (Highest, High, Medium, Low, Lowest)
- `assignee` (string, optional): Assignee email or account ID
- `labels` (array, optional): Array of label strings
- `components` (array, optional): Array of component names
- `sprintId` (number, optional): Sprint ID to add issue to
- `boardId` (number, optional): Board ID (adds to active sprint on this board)
- `epicKey` (string, optional): Parent epic key

**Example - Simple**:
```javascript
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Fix login bug",
  issueType: "Bug",
  priority: "High"
});
```

**Example - With Sprint**:
```javascript
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Add user profile page",
  description: "Create a profile page with edit capabilities",
  issueType: "Story",
  priority: "Medium",
  sprintId: 893,  // Directly adds to sprint
  labels: ["frontend", "ui"]
});
```

**Example - Auto-add to Active Sprint**:
```javascript
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Implement JWT auth",
  boardId: 268  // Finds and adds to active sprint on board 268
});
```

**Response**: Created issue object with key, id, and self URL.

---

### jira_update_issue

Update fields of an existing issue.

**Parameters**:
- `issueKey` (string, required): Issue key
- `summary` (string, optional): New summary
- `description` (string, optional): New description
- `assignee` (string, optional): New assignee email
- `priority` (string, optional): New priority
- `labels` (array, optional): New labels (replaces existing)

**Example**:
```javascript
await mcp__jira__jira_update_issue({
  issueKey: "PROD-123",
  summary: "Updated: Fix login bug",
  priority: "Highest",
  assignee: "john@example.com"
});
```

---

### jira_transition_issue

Change the status of an issue (e.g., To Do → In Progress → Done).

**Parameters**:
- `issueKey` (string, required): Issue key
- `transitionName` (string, required): Target status name

**Common Transitions**:
- "To Do"
- "In Progress"
- "In Review"
- "Done"
- "Blocked"

**Example**:
```javascript
await mcp__jira__jira_transition_issue({
  issueKey: "PROD-123",
  transitionName: "In Progress"
});
```

**Tip**: Use `jira_get_issue_transitions` to see available transitions for an issue.

---

### jira_get_issue_transitions

Get available status transitions for an issue.

**Parameters**:
- `issueKey` (string, required): Issue key

**Example**:
```javascript
await mcp__jira__jira_get_issue_transitions({
  issueKey: "PROD-123"
});
```

**Response**:
```json
{
  "transitions": [
    {"id": "11", "name": "In Progress"},
    {"id": "21", "name": "Done"},
    {"id": "31", "name": "Blocked"}
  ]
}
```

---

### jira_assign_issue

Assign an issue to a user.

**Parameters**:
- `issueKey` (string, required): Issue key
- `accountId` (string, required): User account ID

**Example**:
```javascript
// Get user first
const users = await mcp__jira__jira_list_users({query: "john"});
const accountId = users[0].accountId;

// Assign issue
await mcp__jira__jira_assign_issue({
  issueKey: "PROD-123",
  accountId: accountId
});
```

---

### jira_add_comment

Add a comment to an issue.

**Parameters**:
- `issueKey` (string, required): Issue key
- `comment` (string, required): Comment text (supports Atlassian Document Format)

**Example**:
```javascript
await mcp__jira__jira_add_comment({
  issueKey: "PROD-123",
  comment: "This is now fixed and ready for review."
});
```

---

### jira_get_issue_watchers

Get list of users watching an issue.

**Parameters**:
- `issueKey` (string, required): Issue key

**Example**:
```javascript
await mcp__jira__jira_get_issue_watchers({
  issueKey: "PROD-123"
});
```

---

## Board Management

### jira_get_boards

List all boards, optionally filtered by project.

**Parameters**:
- `projectKeyOrId` (string, optional): Filter by project
- `type` (string, optional): Board type ("scrum" or "kanban")
- `maxResults` (number, optional): Max results (default: 50)

**Example**:
```javascript
await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD",
  type: "scrum"
});
```

**Response**:
```json
{
  "values": [
    {
      "id": 268,
      "name": "PROD Scrum Board",
      "type": "scrum",
      "location": {
        "projectKey": "PROD"
      }
    }
  ]
}
```

---

### jira_get_board

Get details of a specific board.

**Parameters**:
- `boardId` (number, required): Board ID

**Example**:
```javascript
await mcp__jira__jira_get_board({
  boardId: 268
});
```

---

### jira_get_board_configuration

Get board configuration (columns, filters, card layout).

**Parameters**:
- `boardId` (number, required): Board ID

**Example**:
```javascript
await mcp__jira__jira_get_board_configuration({
  boardId: 268
});
```

**Response**: Board configuration including column settings, estimation, ranking, and filter details.

---

### jira_get_board_issues

Get issues from a board with filtering.

**Parameters**:
- `boardId` (number, required): Board ID
- `jql` (string, optional): Additional JQL filter
- `maxResults` (number, optional): Max results

**Example**:
```javascript
await mcp__jira__jira_get_board_issues({
  boardId: 268,
  jql: "assignee = currentUser()",
  maxResults: 50
});
```

---

## Sprint Management

### jira_get_board_sprints

Get all sprints for a board.

**Parameters**:
- `boardId` (number, required): Board ID
- `state` (string, optional): Filter by state ("active", "future", "closed")
- `maxResults` (number, optional): Max results

**Example**:
```javascript
// Get active sprint
await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

// Get all sprints
await mcp__jira__jira_get_board_sprints({
  boardId: 268
});
```

**Response**:
```json
{
  "values": [
    {
      "id": 893,
      "name": "Sprint 23",
      "state": "active",
      "startDate": "2025-01-15T10:00:00.000Z",
      "endDate": "2025-01-29T18:00:00.000Z",
      "goal": "Complete authentication system"
    }
  ]
}
```

---

### jira_get_sprint

Get details of a specific sprint.

**Parameters**:
- `sprintId` (number, required): Sprint ID

**Example**:
```javascript
await mcp__jira__jira_get_sprint({
  sprintId: 893
});
```

---

### jira_create_sprint

Create a new sprint on a board.

**Parameters**:
- `boardId` (number, required): Board ID
- `name` (string, required): Sprint name
- `startDate` (string, optional): ISO 8601 date string
- `endDate` (string, optional): ISO 8601 date string
- `goal` (string, optional): Sprint goal

**Example**:
```javascript
await mcp__jira__jira_create_sprint({
  boardId: 268,
  name: "Sprint 24",
  goal: "Implement user management features",
  startDate: "2025-02-01T10:00:00.000Z",
  endDate: "2025-02-15T18:00:00.000Z"
});
```

---

### jira_update_sprint

Update sprint details.

**Parameters**:
- `sprintId` (number, required): Sprint ID
- `name` (string, optional): New name
- `goal` (string, optional): New goal
- `startDate` (string, optional): New start date
- `endDate` (string, optional): New end date
- `state` (string, optional): New state ("active", "closed", "future")

**Example**:
```javascript
await mcp__jira__jira_update_sprint({
  sprintId: 893,
  goal: "Updated: Complete auth system and add tests"
});
```

---

### jira_start_sprint

Start a sprint (must be in "future" state).

**Parameters**:
- `sprintId` (number, required): Sprint ID
- `startDate` (string, optional): Start date (defaults to now)
- `endDate` (string, optional): End date (required if not set)

**Example**:
```javascript
await mcp__jira__jira_start_sprint({
  sprintId: 893,
  endDate: "2025-02-15T18:00:00.000Z"
});
```

---

### jira_close_sprint

Complete/close a sprint.

**Parameters**:
- `sprintId` (number, required): Sprint ID
- `moveToBacklog` (boolean, optional): Move incomplete issues to backlog (default: true)
- `moveToSprintId` (number, optional): Move incomplete issues to another sprint

**Example**:
```javascript
// Close and move incomplete to backlog
await mcp__jira__jira_close_sprint({
  sprintId: 893,
  moveToBacklog: true
});

// Close and move incomplete to next sprint
await mcp__jira__jira_close_sprint({
  sprintId: 893,
  moveToSprintId: 894
});
```

---

### jira_get_sprint_issues

Get all issues in a sprint.

**Parameters**:
- `sprintId` (number, required): Sprint ID
- `jql` (string, optional): Additional JQL filter
- `maxResults` (number, optional): Max results

**Example**:
```javascript
await mcp__jira__jira_get_sprint_issues({
  sprintId: 893,
  jql: "status != Done",
  maxResults: 100
});
```

---

### jira_add_issues_to_sprint

Add issues to a sprint.

**Parameters**:
- `sprintId` (number, required): Sprint ID
- `issues` (array, required): Array of issue keys

**Example**:
```javascript
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-123", "PROD-124", "PROD-125"]
});
```

---

### jira_move_issues_to_backlog

Move issues from sprint back to backlog.

**Parameters**:
- `issues` (array, required): Array of issue keys

**Example**:
```javascript
await mcp__jira__jira_move_issues_to_backlog({
  issues: ["PROD-123", "PROD-124"]
});
```

---

### jira_get_board_backlog

Get backlog issues for a board.

**Parameters**:
- `boardId` (number, required): Board ID
- `jql` (string, optional): Additional JQL filter
- `maxResults` (number, optional): Max results

**Example**:
```javascript
await mcp__jira__jira_get_board_backlog({
  boardId: 268,
  jql: "priority = High",
  maxResults: 50
});
```

---

## Project Management

### jira_get_projects

List all accessible projects.

**Parameters**: None

**Example**:
```javascript
await mcp__jira__jira_get_projects();
```

**Response**:
```json
[
  {
    "key": "PROD",
    "name": "PORTAL/SAAS",
    "id": "10001",
    "projectTypeKey": "software"
  }
]
```

---

### jira_get_project

Get details of a specific project.

**Parameters**:
- `projectKeyOrId` (string, required): Project key or ID

**Example**:
```javascript
await mcp__jira__jira_get_project({
  projectKeyOrId: "PROD"
});
```

---

## User Management

### jira_get_current_user

Get information about the authenticated user.

**Parameters**: None

**Example**:
```javascript
await mcp__jira__jira_get_current_user();
```

**Response**:
```json
{
  "accountId": "557058:f5a7e9e0-...",
  "displayName": "Kostyantyn",
  "emailAddress": "kostyantyn@keplercommerce.com",
  "active": true
}
```

---

### jira_list_users

Search for users.

**Parameters**:
- `query` (string, optional): Search query
- `maxResults` (number, optional): Max results

**Example**:
```javascript
await mcp__jira__jira_list_users({
  query: "john",
  maxResults: 10
});
```

---

## Error Handling

All tools return structured error messages:

**Authentication Error** (401):
```json
{
  "error": "Unauthorized - Check your API token"
}
```

**Permission Error** (403):
```json
{
  "error": "Forbidden - You don't have permission"
}
```

**Not Found** (404):
```json
{
  "error": "Issue PROD-999 not found"
}
```

**Validation Error** (400):
```json
{
  "error": "Invalid parameters: summary is required"
}
```

---

## Rate Limiting

Jira Cloud API has rate limits:
- **Standard**: ~100 requests per minute
- **Premium**: Higher limits available

The MCP server doesn't implement rate limiting - handle it in your usage patterns.

---

## Next Steps

- See [Usage Guide](USAGE_GUIDE.md) for practical workflows
- Check [JQL Reference](JQL_REFERENCE.md) for advanced queries
- Read [Boards & Sprints Guide](BOARDS_SPRINTS.md) for Agile management

---

**Note**: All examples assume use within Claude Desktop with the Jira MCP server configured.
