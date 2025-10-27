# Boards & Sprints Management Guide

Complete guide to managing Scrum boards and sprints using the Jira MCP Server.

## Table of Contents

- [Understanding Boards & Sprints](#understanding-boards--sprints)
- [Board Operations](#board-operations)
- [Sprint Lifecycle](#sprint-lifecycle)
- [Common Workflows](#common-workflows)
- [Best Practices](#best-practices)

---

## Understanding Boards & Sprints

### What is a Board?

A **board** is a visual representation of work items. There are two types:

1. **Scrum Board**: Uses sprints for time-boxed work
2. **Kanban Board**: Continuous flow without sprints

### What is a Sprint?

A **sprint** is a time-boxed period (typically 1-4 weeks) where a team works on a set of issues.

**Sprint States**:
- **Future**: Created but not started
- **Active**: Currently running
- **Closed**: Completed

### Board-Sprint-Issue Hierarchy

```
Project (PROD)
└── Boards (268, 265, ...)
    └── Sprints (893, 894, ...)
        └── Issues (PROD-123, PROD-124, ...)
```

**Key Concept**: Issues appear on boards through **filters**, not direct assignment. Sprint membership determines which issues appear in which sprint.

---

## Board Operations

### List All Boards

Get all boards in your instance:

```javascript
await mcp__jira__jira_get_boards();
```

### List Project Boards

Get boards for specific project:

```javascript
await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD"
});
```

### Get Board Details

```javascript
await mcp__jira__jira_get_board({
  boardId: 268
});
```

**Response includes**:
- Board name
- Board type (scrum/kanban)
- Project location
- Configuration

### Get Board Configuration

See board settings, columns, and filters:

```javascript
await mcp__jira__jira_get_board_configuration({
  boardId: 268
});
```

**Returns**:
- Column configuration
- Swimlane settings
- Estimation field
- Ranking settings
- Filter JQL

### Query Board Issues

Get issues currently on a board:

```javascript
await mcp__jira__jira_get_board_issues({
  boardId: 268,
  jql: "assignee = currentUser()",
  maxResults: 50
});
```

**Use Cases**:
- See all work on a board
- Filter by assignee
- Find specific issue types
- Check board capacity

---

## Sprint Lifecycle

### 1. Create Sprint

Create a new sprint on a board:

```javascript
await mcp__jira__jira_create_sprint({
  boardId: 268,
  name: "Sprint 24",
  goal: "Implement user authentication and profile management",
  startDate: "2025-02-01T10:00:00.000Z",
  endDate: "2025-02-15T18:00:00.000Z"
});
```

**Tips**:
- Sprint starts in "future" state
- Start/end dates are optional at creation
- Sprint goal helps focus the team

### 2. Plan Sprint (Add Issues)

Add issues from backlog to sprint:

```javascript
// Get backlog first
const backlog = await mcp__jira__jira_get_board_backlog({
  boardId: 268,
  maxResults: 50
});

// Add selected issues to sprint
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-123", "PROD-124", "PROD-125"]
});
```

### 3. Start Sprint

Begin the sprint:

```javascript
await mcp__jira__jira_start_sprint({
  sprintId: 893,
  startDate: "2025-02-01T10:00:00.000Z",
  endDate: "2025-02-15T18:00:00.000Z"
});
```

**Requirements**:
- Sprint must be in "future" state
- Need start and end dates
- Board can only have one active sprint

### 4. During Sprint

**Get sprint issues**:
```javascript
await mcp__jira__jira_get_sprint_issues({
  sprintId: 893
});
```

**Add more issues mid-sprint**:
```javascript
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-130"]
});
```

**Update sprint details**:
```javascript
await mcp__jira__jira_update_sprint({
  sprintId: 893,
  goal: "Updated goal: Complete auth system"
});
```

### 5. Close Sprint

Complete the sprint:

```javascript
// Move incomplete issues to backlog
await mcp__jira__jira_close_sprint({
  sprintId: 893,
  moveToBacklog: true
});

// Or move to next sprint
await mcp__jira__jira_close_sprint({
  sprintId: 893,
  moveToSprintId: 894
});
```

---

## Common Workflows

### Workflow 1: Sprint Planning

```javascript
// Step 1: Get all boards
const boards = await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD"
});
const boardId = boards.values[0].id;

// Step 2: Check current sprints
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: boardId,
  state: "active"
});

// Step 3: Create next sprint
const newSprint = await mcp__jira__jira_create_sprint({
  boardId: boardId,
  name: "Sprint 24",
  goal: "User management features"
});

// Step 4: Get backlog
const backlog = await mcp__jira__jira_get_board_backlog({
  boardId: boardId,
  jql: "priority IN (High, Highest)",
  maxResults: 50
});

// Step 5: Add issues to sprint
const issueKeys = backlog.issues.map(i => i.key).slice(0, 10);
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: newSprint.id,
  issues: issueKeys
});

// Step 6: Start sprint
await mcp__jira__jira_start_sprint({
  sprintId: newSprint.id,
  endDate: "2025-02-15T18:00:00.000Z"
});
```

### Workflow 2: Daily Standup Report

```javascript
// Get active sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});
const activeSprint = sprints.values[0];

// Get my work in sprint
const myWork = await mcp__jira__jira_get_sprint_issues({
  sprintId: activeSprint.id,
  jql: "assignee = currentUser()"
});

// Categorize by status
const inProgress = myWork.issues.filter(i => i.fields.status.name === "In Progress");
const done = myWork.issues.filter(i => i.fields.status.name === "Done");
const toDo = myWork.issues.filter(i => i.fields.status.name === "To Do");

console.log(`Sprint: ${activeSprint.name}`);
console.log(`In Progress (${inProgress.length}):`, inProgress.map(i => i.key));
console.log(`Done (${done.length}):`, done.map(i => i.key));
console.log(`To Do (${toDo.length}):`, toDo.map(i => i.key));
```

### Workflow 3: Sprint Review

```javascript
// Get completed sprint
const sprint = await mcp__jira__jira_get_sprint({
  sprintId: 893
});

// Get all sprint issues
const issues = await mcp__jira__jira_get_sprint_issues({
  sprintId: 893
});

// Calculate metrics
const total = issues.issues.length;
const completed = issues.issues.filter(i => i.fields.status.name === "Done").length;
const incomplete = total - completed;

console.log(`Sprint: ${sprint.name}`);
console.log(`Goal: ${sprint.goal}`);
console.log(`Completion: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
console.log(`Incomplete: ${incomplete}`);
```

### Workflow 4: Backlog Refinement

```javascript
// Get unrefined backlog items
const backlog = await mcp__jira__jira_get_board_backlog({
  boardId: 268,
  jql: "Sprint IS EMPTY AND status = 'To Do'",
  maxResults: 50
});

// Sort by priority and age
const sorted = backlog.issues.sort((a, b) => {
  // Compare priorities
  const priorityOrder = {Highest: 5, High: 4, Medium: 3, Low: 2, Lowest: 1};
  const aDiff = priorityOrder[a.fields.priority.name];
  const bDiff = priorityOrder[b.fields.priority.name];
  return bDiff - aDiff;
});

console.log("Top backlog items for refinement:");
sorted.slice(0, 10).forEach(issue => {
  console.log(`${issue.key}: ${issue.fields.summary} [${issue.fields.priority.name}]`);
});
```

### Workflow 5: Create Issue and Add to Sprint

**Simple approach**:
```javascript
// Create with sprintId
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Add password reset functionality",
  issueType: "Task",
  sprintId: 893  // Automatically adds to sprint
});
```

**Auto-find active sprint**:
```javascript
// Create with boardId (finds active sprint)
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "Fix login validation bug",
  issueType: "Bug",
  priority: "High",
  boardId: 268  // Finds and adds to active sprint on board 268
});
```

### Workflow 6: Sprint Capacity Check

```javascript
// Get active sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});
const sprint = sprints.values[0];

// Get issues by assignee
const issues = await mcp__jira__jira_get_sprint_issues({
  sprintId: sprint.id
});

// Group by assignee
const byAssignee = {};
issues.issues.forEach(issue => {
  const assignee = issue.fields.assignee?.displayName || "Unassigned";
  if (!byAssignee[assignee]) byAssignee[assignee] = [];
  byAssignee[assignee].push(issue);
});

// Show distribution
Object.entries(byAssignee).forEach(([assignee, issues]) => {
  console.log(`${assignee}: ${issues.length} issues`);
});
```

---

## Best Practices

### Sprint Planning

1. **Keep sprints consistent** - Same duration (e.g., 2 weeks)
2. **Set clear goals** - Sprint goal guides prioritization
3. **Don't overcommit** - Leave buffer for unexpected work
4. **Refine beforehand** - Ensure backlog items are ready

### Sprint Execution

1. **Update daily** - Keep issue status current
2. **Monitor scope creep** - Avoid adding too many issues mid-sprint
3. **Address blockers** - Mark and resolve blocked issues quickly
4. **Review regularly** - Daily standups and mid-sprint checks

### Sprint Closure

1. **Complete sprint ceremony** - Review and retrospective
2. **Handle incomplete work** - Don't just roll everything forward
3. **Update velocity** - Track team capacity over time
4. **Document learnings** - Sprint retrospective notes

### Backlog Management

1. **Keep backlog groomed** - Regular refinement sessions
2. **Prioritize ruthlessly** - Top items should be ready to work
3. **Estimate consistently** - Use story points or time estimates
4. **Remove stale items** - Archive or delete outdated issues

---

## Your Board Setup (PROD Project)

You have **8 boards** in keplercommerce.atlassian.net:

| Board ID | Typical Use |
|----------|-------------|
| 268 | Main scrum board |
| 265 | Secondary board |
| 167, 166, 232, 267, 266, 298 | Additional boards |

### Typical Commands for Your Setup

**List your boards**:
```javascript
await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD"
});
```

**Work with main board (268)**:
```javascript
// Get active sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

// Get my work
await mcp__jira__jira_get_sprint_issues({
  sprintId: sprints.values[0].id,
  jql: "assignee = currentUser()"
});
```

---

## Troubleshooting

### Issue Not Appearing on Board

**Cause**: Issue doesn't match board's filter
**Solution**:
1. Check board configuration filter
2. Ensure issue project/type matches filter
3. Add issue to sprint to force visibility

### Can't Start Sprint

**Possible causes**:
- Board already has active sprint
- Sprint missing start/end dates
- Insufficient permissions

**Solution**:
```javascript
// Check for active sprints first
const active = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

if (active.values.length > 0) {
  console.log("Close active sprint first");
}
```

### Issues in Multiple Sprints

**Issue**: Issue appears in wrong sprint
**Solution**: Issues can only be in one sprint at a time. Use `jira_add_issues_to_sprint` to move them.

---

## Advanced Topics

### Custom Filters for Boards

Boards use JQL filters. To see a board's filter:

```javascript
const config = await mcp__jira__jira_get_board_configuration({
  boardId: 268
});
console.log("Board filter:", config.filter.query);
```

### Sprint Reports

For detailed sprint metrics, query issues and calculate:
- Velocity (story points completed)
- Burndown (remaining work over time)
- Cycle time (time from start to done)

### Multi-Board Workflows

If you use multiple boards:
```javascript
// Get all boards
const boards = await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD"
});

// Check each board's active sprint
for (const board of boards.values) {
  const sprints = await mcp__jira__jira_get_board_sprints({
    boardId: board.id,
    state: "active"
  });
  console.log(`${board.name}: ${sprints.values.length} active sprint(s)`);
}
```

---

## Next Steps

- See [Usage Guide](USAGE_GUIDE.md) for more workflow examples
- Check [API Reference](API_REFERENCE.md) for detailed tool parameters
- Read [JQL Reference](JQL_REFERENCE.md) for advanced queries

---

**Need help?** Contact: kostyantyn@keplercommerce.com
