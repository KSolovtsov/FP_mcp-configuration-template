# JQL Reference Guide

Complete guide to Jira Query Language (JQL) for searching issues.

## What is JQL?

JQL (Jira Query Language) is a powerful query language for searching issues in Jira. Think of it like SQL for Jira.

## Basic Syntax

```
field operator value
```

**Example**:
```
project = PROD
```

### Combining Conditions

Use `AND`, `OR`, and parentheses:

```
project = PROD AND status = "In Progress"
```

```
priority = High OR priority = Highest
```

```
project = PROD AND (status = "In Progress" OR status = "To Do")
```

## Common Fields

### Core Fields

| Field | Description | Example |
|-------|-------------|---------|
| `project` | Project key | `project = PROD` |
| `status` | Issue status | `status = "In Progress"` |
| `assignee` | Assigned user | `assignee = currentUser()` |
| `reporter` | Issue creator | `reporter = "john@example.com"` |
| `priority` | Priority level | `priority = High` |
| `type` | Issue type | `type = Bug` |
| `summary` | Issue title | `summary ~ "authentication"` |
| `description` | Issue description | `description ~ "login"` |
| `created` | Creation date | `created >= -7d` |
| `updated` | Last update date | `updated >= -1w` |
| `resolved` | Resolution date | `resolved >= -30d` |
| `due` | Due date | `due <= now()` |
| `labels` | Issue labels | `labels = urgent` |
| `component` | Component | `component = "Frontend"` |

### Sprint Fields

| Field | Description | Example |
|-------|-------------|---------|
| `Sprint` | Sprint name/ID | `Sprint = 893` |
| `Sprint` | Sprint state | `Sprint in openSprints()` |
| `Sprint` | Sprint query | `Sprint in futureSprints()` |

### Epic Fields

| Field | Description | Example |
|-------|-------------|---------|
| `"Epic Link"` | Parent epic | `"Epic Link" = PROD-100` |
| `"Epic Name"` | Epic name | `"Epic Name" ~ "Authentication"` |

**Note**: Custom fields like Epic Link need quotes.

## Operators

### Equality Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equals | `status = Done` |
| `!=` | Not equals | `status != Done` |
| `IN` | In list | `status IN ("To Do", "In Progress")` |
| `NOT IN` | Not in list | `priority NOT IN (Low, Lowest)` |

### Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `>` | Greater than | `created > "2025-01-01"` |
| `>=` | Greater or equal | `priority >= Medium` |
| `<` | Less than | `due < now()` |
| `<=` | Less or equal | `updated <= -7d` |

### Text Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `~` | Contains | `summary ~ "bug"` |
| `!~` | Not contains | `summary !~ "test"` |

### Null Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `IS EMPTY` | Field is empty | `assignee IS EMPTY` |
| `IS NOT EMPTY` | Field has value | `assignee IS NOT EMPTY` |
| `IS NULL` | Field is null | `dueDate IS NULL` |
| `IS NOT NULL` | Field is not null | `dueDate IS NOT NULL` |

## Functions

### User Functions

| Function | Description |
|----------|-------------|
| `currentUser()` | Currently logged-in user |
| `membersOf("group-name")` | Members of a group |

**Examples**:
```
assignee = currentUser()
assignee IN membersOf("developers")
```

### Date Functions

| Function | Description |
|----------|-------------|
| `now()` | Current time |
| `startOfDay()` | Start of today |
| `endOfDay()` | End of today |
| `startOfWeek()` | Start of this week |
| `endOfWeek()` | End of this week |
| `startOfMonth()` | Start of this month |
| `endOfMonth()` | End of this month |

**Examples**:
```
created >= startOfDay()
due <= endOfWeek()
updated >= startOfMonth()
```

### Sprint Functions

| Function | Description |
|----------|-------------|
| `openSprints()` | All active sprints |
| `futureSprints()` | All future sprints |
| `closedSprints()` | All closed sprints |

**Examples**:
```
Sprint in openSprints()
Sprint in futureSprints() AND priority = High
Sprint NOT IN closedSprints()
```

## Date Formats

### Relative Dates

| Format | Meaning |
|--------|---------|
| `-1d` | 1 day ago |
| `-1w` | 1 week ago |
| `-2w` | 2 weeks ago |
| `-1M` | 1 month ago |
| `-1y` | 1 year ago |
| `1d` | 1 day from now |
| `1w` | 1 week from now |

**Examples**:
```
created >= -7d                  # Last 7 days
updated >= -2w                  # Last 2 weeks
due <= 1w                       # Due within a week
resolved >= -1M AND resolved <= now()  # Resolved last month
```

### Absolute Dates

Use quotes for absolute dates:
```
created >= "2025-01-01"
created >= "2025/01/01"
created >= "2025-01-01 10:00"
```

## Sorting

Use `ORDER BY`:

```
ORDER BY priority DESC
ORDER BY created ASC
ORDER BY updated DESC, priority DESC
```

**Common Sorts**:
```
ORDER BY priority DESC, created DESC
ORDER BY status ASC, assignee ASC
ORDER BY updated DESC
```

## Common Query Patterns

### My Work

**All my open tasks**:
```
assignee = currentUser() AND status != Done
```

**My work in progress**:
```
assignee = currentUser() AND status = "In Progress"
```

**My work this sprint**:
```
assignee = currentUser() AND Sprint in openSprints()
```

### Sprint Queries

**Active sprint issues**:
```
project = PROD AND Sprint in openSprints()
```

**Specific sprint**:
```
Sprint = 893
```

**Sprint incomplete issues**:
```
Sprint = 893 AND status != Done
```

**Sprint by assignee**:
```
Sprint in openSprints() AND assignee = currentUser()
```

### Status Queries

**All open issues**:
```
project = PROD AND status NOT IN (Done, Closed)
```

**Blocked issues**:
```
status = Blocked
```

**In review**:
```
status = "In Review"
```

### Priority Queries

**High priority open issues**:
```
project = PROD AND priority IN (High, Highest) AND status != Done
```

**Urgent bugs**:
```
type = Bug AND priority = Highest AND status != Done
```

### Time-based Queries

**Created recently**:
```
created >= -7d ORDER BY created DESC
```

**Updated today**:
```
updated >= startOfDay()
```

**Overdue**:
```
due < now() AND status != Done
```

**Resolved this week**:
```
resolved >= startOfWeek() ORDER BY resolved DESC
```

### Type Queries

**All bugs**:
```
project = PROD AND type = Bug
```

**Stories and tasks**:
```
type IN (Story, Task)
```

**Open bugs**:
```
type = Bug AND status NOT IN (Done, Closed)
```

### Team Queries

**Unassigned issues**:
```
project = PROD AND assignee IS EMPTY AND status != Done
```

**Team's work**:
```
assignee IN membersOf("developers") AND status = "In Progress"
```

### Epic Queries

**Issues in an epic**:
```
"Epic Link" = PROD-100
```

**Issues without epic**:
```
project = PROD AND "Epic Link" IS EMPTY
```

### Label Queries

**Specific label**:
```
labels = urgent
```

**Multiple labels**:
```
labels IN (urgent, critical)
```

**Has any label**:
```
labels IS NOT EMPTY
```

## Advanced Patterns

### Complex Sprint Planning

```
project = PROD
AND Sprint IS EMPTY
AND status = "To Do"
AND priority IN (High, Highest)
ORDER BY priority DESC, created ASC
```

### Release Planning

```
project = PROD
AND fixVersion = "2.0.0"
AND status IN ("In Progress", "To Do")
ORDER BY priority DESC
```

### Bug Triage

```
type = Bug
AND status = "To Do"
AND assignee IS EMPTY
AND created >= -7d
ORDER BY priority DESC, created DESC
```

### Sprint Retrospective

```
Sprint = 893
AND resolved >= startOfSprint(893)
ORDER BY type ASC, priority DESC
```

### Capacity Planning

```
assignee = currentUser()
AND Sprint in openSprints()
AND status != Done
ORDER BY priority DESC
```

## Reserved Words

These words need quotes when used as values:
- `AND`
- `OR`
- `NOT`
- `EMPTY`
- `NULL`
- `ORDER`
- `BY`

**Example**:
```
project = "AND Project"  # Project named "AND"
```

## Special Characters

Values with special characters need quotes:
```
status = "In Progress"    # Has space
summary ~ "bug-fix"       # Has hyphen is ok
labels = "v2.0"           # Has dot
```

## Performance Tips

1. **Specify project first** - Narrows search quickly:
   ```
   project = PROD AND ...
   ```

2. **Use indexed fields** - Faster queries:
   - ✅ `status`, `assignee`, `priority`, `type`
   - ❌ Custom fields (slower)

3. **Limit results** - Use `maxResults` parameter in API:
   ```javascript
   jira_search_issues({
     jql: "project = PROD",
     maxResults: 50
   })
   ```

4. **Avoid text searches** - When possible:
   - ✅ `status = Done`
   - ⚠️ `summary ~ "something"` (slower)

## Common Mistakes

### ❌ Wrong
```
status = In Progress     # Missing quotes (has space)
Sprint = "893"           # Sprint ID shouldn't be quoted
assignee = me            # Use currentUser()
created > 7d             # Use -7d for "7 days ago"
```

### ✅ Correct
```
status = "In Progress"
Sprint = 893
assignee = currentUser()
created >= -7d
```

## Testing JQL Queries

You can test JQL queries in:
1. **Jira Web UI**: Use the issue search with "Advanced" mode
2. **MCP Server**: Use `jira_search_issues` tool
3. **Jira REST API**: Direct API calls

**Example with MCP**:
```javascript
await mcp__jira__jira_search_issues({
  jql: "project = PROD AND status = 'In Progress'",
  maxResults: 10
});
```

## Your Project-Specific Queries

For **PROD** project (keplercommerce.atlassian.net):

**All active work**:
```
project = PROD AND Sprint in openSprints() AND status != Done
```

**Backlog prioritization**:
```
project = PROD AND Sprint IS EMPTY AND status = "To Do"
ORDER BY priority DESC, created ASC
```

**Current sprint by board 268**:
```
project = PROD AND Sprint in openSprints() AND board = 268
```

## Resources

- [Official Jira JQL Documentation](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
- [JQL Field Reference](https://support.atlassian.com/jira-software-cloud/docs/jql-fields/)
- [JQL Functions Reference](https://support.atlassian.com/jira-software-cloud/docs/jql-functions/)

## Next Steps

- Try queries in [Usage Guide](USAGE_GUIDE.md)
- Explore [API Reference](API_REFERENCE.md) for search tools
- Learn [Boards & Sprints](BOARDS_SPRINTS.md) management

---

**Pro Tip**: Save frequently-used queries as filters in Jira for quick access!
