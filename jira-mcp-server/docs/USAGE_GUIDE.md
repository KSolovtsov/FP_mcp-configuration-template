# Usage Guide

Practical examples and workflows for using the Jira MCP Server.

## Table of Contents

- [Basic Operations](#basic-operations)
- [Daily Workflows](#daily-workflows)
- [Sprint Management](#sprint-management)
- [Issue Management](#issue-management)
- [Advanced Scenarios](#advanced-scenarios)

---

## Basic Operations

### Check Connection

First, verify your MCP server is connected:

```
List all my Jira projects
```

Expected: You'll see your projects including PROD.

### View Your Work

```
Show me all issues assigned to me
```

This executes:
```javascript
await mcp__jira__jira_search_issues({
  jql: "assignee = currentUser() AND status != Done"
});
```

### Create a Simple Issue

```
Create a task in PROD:
- Summary: Update user documentation
- Priority: Medium
```

---

## Daily Workflows

### Morning Standup Preparation

**Goal**: Understand what you're working on today

```
For board 268:
1. Show me the current sprint
2. Show my issues in the sprint
3. Group them by status
```

**Behind the scenes**:
```javascript
// Get active sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

// Get your work
const issues = await mcp__jira__jira_get_sprint_issues({
  sprintId: sprints.values[0].id,
  jql: "assignee = currentUser()"
});
```

### Update Issue Status

**Start working on a task**:
```
Move PROD-123 to In Progress
```

**Mark as done**:
```
Move PROD-123 to Done
```

**Executes**:
```javascript
await mcp__jira__jira_transition_issue({
  issueKey: "PROD-123",
  transitionName: "In Progress"  // or "Done"
});
```

### Add Work Notes

```
Add a comment to PROD-123:
"Implemented the login validation. Ready for review."
```

---

## Sprint Management

### Sprint Planning Session

**Scenario**: Planning a new 2-week sprint

```
For board 268:
1. Show me the backlog with high priority items
2. Create a new sprint called "Sprint 24"
3. Add issues PROD-120 through PROD-130 to the sprint
4. Start the sprint with end date Feb 15
```

**Detailed workflow**:

```javascript
// 1. Review backlog
const backlog = await mcp__jira__jira_get_board_backlog({
  boardId: 268,
  jql: "priority IN (High, Highest)",
  maxResults: 50
});

console.log("High priority items:", backlog.issues.length);

// 2. Create sprint
const sprint = await mcp__jira__jira_create_sprint({
  boardId: 268,
  name: "Sprint 24",
  goal: "Complete user authentication and profile features"
});

// 3. Add selected issues
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: sprint.id,
  issues: ["PROD-120", "PROD-121", "PROD-122", "PROD-123", "PROD-124"]
});

// 4. Start sprint
await mcp__jira__jira_start_sprint({
  sprintId: sprint.id,
  startDate: "2025-02-01T09:00:00.000Z",
  endDate: "2025-02-15T18:00:00.000Z"
});
```

### Mid-Sprint Check

**Scenario**: Check sprint progress

```
For the active sprint on board 268:
- How many issues are done?
- How many are in progress?
- Are there any blocked issues?
```

**Implementation**:
```javascript
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

const issues = await mcp__jira__jira_get_sprint_issues({
  sprintId: sprints.values[0].id
});

const stats = {
  done: issues.issues.filter(i => i.fields.status.name === "Done").length,
  inProgress: issues.issues.filter(i => i.fields.status.name === "In Progress").length,
  blocked: issues.issues.filter(i => i.fields.status.name === "Blocked").length,
  total: issues.issues.length
};

console.log("Sprint Progress:");
console.log(`Done: ${stats.done}/${stats.total} (${Math.round(stats.done/stats.total*100)}%)`);
console.log(`In Progress: ${stats.inProgress}`);
console.log(`Blocked: ${stats.blocked}`);
```

### Sprint Review

**Scenario**: End-of-sprint review

```
For sprint 893:
1. Show all completed issues
2. Show incomplete issues
3. Calculate completion rate
```

### Sprint Retrospective Preparation

```
Find all issues from Sprint 893 that were:
- Moved back to To Do after being In Progress
- Had status changed more than 5 times
- Were added mid-sprint
```

---

## Issue Management

### Create Issue with Full Details

**Scenario**: Create a well-defined user story

```
Create a story in PROD:
- Summary: User profile edit functionality
- Description: As a user, I want to edit my profile so that I can keep my information up to date
- Priority: High
- Labels: frontend, user-management
- Add to active sprint on board 268
```

**Executes**:
```javascript
await mcp__jira__jira_create_issue({
  project: "PROD",
  summary: "User profile edit functionality",
  description: "As a user, I want to edit my profile so that I can keep my information up to date",
  issueType: "Story",
  priority: "High",
  labels: ["frontend", "user-management"],
  boardId: 268  // Auto-adds to active sprint
});
```

### Bulk Issue Operations

**Scenario**: Update multiple issues

```javascript
// Find issues
const issues = await mcp__jira__jira_search_issues({
  jql: "project = PROD AND status = 'To Do' AND assignee IS EMPTY",
  maxResults: 10
});

// Assign all to yourself
const currentUser = await mcp__jira__jira_get_current_user();

for (const issue of issues.issues) {
  await mcp__jira__jira_assign_issue({
    issueKey: issue.key,
    accountId: currentUser.accountId
  });
}
```

### Link Issues to Epic

**Scenario**: Organize work under an epic

```
Find all authentication-related tasks and link them to Epic PROD-100
```

---

## Advanced Scenarios

### Cross-Sprint Analysis

**Scenario**: Compare velocity across sprints

```javascript
// Get last 5 closed sprints
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "closed",
  maxResults: 5
});

// For each sprint, calculate completion
const velocityData = [];
for (const sprint of sprints.values) {
  const issues = await mcp__jira__jira_get_sprint_issues({
    sprintId: sprint.id
  });

  const completed = issues.issues.filter(i => i.fields.status.name === "Done").length;
  const total = issues.issues.length;

  velocityData.push({
    name: sprint.name,
    completed,
    total,
    rate: Math.round(completed/total*100)
  });
}

console.log("Sprint Velocity:");
velocityData.forEach(d => {
  console.log(`${d.name}: ${d.completed}/${d.total} (${d.rate}%)`);
});
```

### Automated Bug Triage

**Scenario**: Daily bug review workflow

```javascript
// Get new bugs
const newBugs = await mcp__jira__jira_search_issues({
  jql: "project = PROD AND type = Bug AND status = 'To Do' AND created >= -1d",
  maxResults: 50
});

console.log(`${newBugs.total} new bugs found`);

// Categorize by priority
const critical = newBugs.issues.filter(i => i.fields.priority.name === "Highest");
const high = newBugs.issues.filter(i => i.fields.priority.name === "High");

console.log(`Critical: ${critical.length}`);
console.log(`High: ${high.length}`);

// Add critical bugs to current sprint
if (critical.length > 0) {
  const sprints = await mcp__jira__jira_get_board_sprints({
    boardId: 268,
    state: "active"
  });

  await mcp__jira__jira_add_issues_to_sprint({
    sprintId: sprints.values[0].id,
    issues: critical.map(b => b.key)
  });

  console.log(`Added ${critical.length} critical bugs to sprint`);
}
```

### Release Planning

**Scenario**: Plan issues for next release

```javascript
// Get all ready issues
const ready = await mcp__jira__jira_search_issues({
  jql: "project = PROD AND status = 'To Do' AND priority IN (High, Highest)",
  maxResults: 100
});

// Group by epic
const byEpic = {};
ready.issues.forEach(issue => {
  const epic = issue.fields.epicLink || "No Epic";
  if (!byEpic[epic]) byEpic[epic] = [];
  byEpic[epic].push(issue);
});

// Show distribution
console.log("Issues by Epic:");
Object.entries(byEpic).forEach(([epic, issues]) => {
  console.log(`${epic}: ${issues.length} issues`);
});
```

### Capacity Planning

**Scenario**: Check team capacity for next sprint

```javascript
// Get team members from current sprint
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

const issues = await mcp__jira__jira_get_sprint_issues({
  sprintId: sprints.values[0].id
});

// Count by assignee
const capacity = {};
issues.issues.forEach(issue => {
  const assignee = issue.fields.assignee?.displayName || "Unassigned";
  if (!capacity[assignee]) capacity[assignee] = 0;
  capacity[assignee]++;
});

console.log("Current Sprint Capacity:");
Object.entries(capacity).forEach(([person, count]) => {
  console.log(`${person}: ${count} issues`);
});
```

### Dependency Tracking

**Scenario**: Find blocked issues and their blockers

```javascript
// Get all blocked issues
const blocked = await mcp__jira__jira_search_issues({
  jql: "project = PROD AND status = Blocked AND Sprint in openSprints()"
});

console.log(`${blocked.total} blocked issues in active sprints`);

// For each blocked issue, check linked issues
for (const issue of blocked.issues) {
  const details = await mcp__jira__jira_get_issue({
    issueKey: issue.key
  });

  // Check issue links for blockers
  if (details.fields.issuelinks && details.fields.issuelinks.length > 0) {
    console.log(`${issue.key} is blocked by:`);
    details.fields.issuelinks.forEach(link => {
      if (link.type.name === "Blocks") {
        const blocker = link.inwardIssue || link.outwardIssue;
        console.log(`  - ${blocker.key}: ${blocker.fields.summary}`);
      }
    });
  }
}
```

### Sprint Health Check

**Scenario**: Daily sprint health monitoring

```javascript
async function sprintHealthCheck(boardId) {
  // Get active sprint
  const sprints = await mcp__jira__jira_get_board_sprints({
    boardId,
    state: "active"
  });

  if (sprints.values.length === 0) {
    return console.log("No active sprint");
  }

  const sprint = sprints.values[0];
  const issues = await mcp__jira__jira_get_sprint_issues({
    sprintId: sprint.id
  });

  // Calculate metrics
  const total = issues.issues.length;
  const done = issues.issues.filter(i => i.fields.status.name === "Done").length;
  const inProgress = issues.issues.filter(i => i.fields.status.name === "In Progress").length;
  const blocked = issues.issues.filter(i => i.fields.status.name === "Blocked").length;
  const unassigned = issues.issues.filter(i => !i.fields.assignee).length;

  // Calculate days remaining
  const endDate = new Date(sprint.endDate);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  // Health indicators
  const completionRate = done / total;
  const blockedRate = blocked / total;

  console.log(`Sprint: ${sprint.name}`);
  console.log(`Days Remaining: ${daysRemaining}`);
  console.log(`Completion: ${Math.round(completionRate * 100)}%`);
  console.log(`In Progress: ${inProgress}`);
  console.log(`Blocked: ${blocked} (${Math.round(blockedRate * 100)}%)`);
  console.log(`Unassigned: ${unassigned}`);

  // Health warnings
  if (blockedRate > 0.15) {
    console.log("⚠️ WARNING: High number of blocked issues");
  }
  if (unassigned > 0) {
    console.log("⚠️ WARNING: Unassigned issues in sprint");
  }
  if (daysRemaining <= 2 && completionRate < 0.7) {
    console.log("⚠️ WARNING: Sprint completion at risk");
  }
}

// Run health check
await sprintHealthCheck(268);
```

---

## Claude Code Natural Language Examples

With Claude Code, you can use natural language:

### Simple Queries

```
"Show me my open bugs"
"What's in the current sprint?"
"Create a task to fix the login bug"
```

### Complex Workflows

```
"I need to plan Sprint 24. Show me the top 20 backlog items,
create a new sprint, and add the top 10 to it"
```

```
"Give me a sprint report for board 268's active sprint.
Include completion rate and who's working on what"
```

```
"Find all unassigned high-priority bugs and assign them to me"
```

### Analysis Requests

```
"Compare the last 5 sprints and tell me our average completion rate"
```

```
"Show me all authentication-related issues and group them by status"
```

```
"What's blocking our current sprint? List all blocked issues."
```

---

## Best Practices

### Issue Creation

1. **Be descriptive** - Clear summaries help everyone
2. **Use labels** - Enables better filtering
3. **Set priority** - Helps with planning
4. **Add to sprint immediately** - Use `boardId` or `sprintId`

### Sprint Management

1. **Review backlog weekly** - Keep top items ready
2. **Monitor mid-sprint** - Don't wait until the end
3. **Limit WIP** - Don't start too many things
4. **Close properly** - Handle incomplete work thoughtfully

### Search Efficiency

1. **Use specific JQL** - Faster results
2. **Limit maxResults** - Don't fetch more than needed
3. **Filter by project first** - Narrows search space
4. **Save common queries** - As Jira filters

---

## Troubleshooting Common Tasks

### Issue Not in Sprint

**Problem**: Created issue but it's not in the sprint

**Solution**:
```javascript
// Add it manually
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-123"]
});
```

### Can't Transition Issue

**Problem**: Status change fails

**Solution**: Check available transitions first
```javascript
const transitions = await mcp__jira__jira_get_issue_transitions({
  issueKey: "PROD-123"
});
console.log("Available transitions:", transitions.transitions);
```

### Board Empty

**Problem**: Board shows no issues

**Solution**: Check board filter and sprint assignment

---

## Next Steps

- Explore [API Reference](API_REFERENCE.md) for all available tools
- Master [JQL Reference](JQL_REFERENCE.md) for advanced queries
- Deep dive into [Boards & Sprints](BOARDS_SPRINTS.md) for Agile workflows

---

**Questions?** Contact: kostyantyn@keplercommerce.com
