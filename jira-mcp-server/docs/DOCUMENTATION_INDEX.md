# Documentation Index

AI-friendly navigation hub for the Jira MCP Server documentation.

## Quick Navigation

| What You Want | Go To |
|---------------|-------|
| Get started in 5 minutes | [Quick Start](QUICK_START.md) |
| Install the server | [Installation Guide](INSTALLATION.md) |
| Find a specific tool | [API Reference](API_REFERENCE.md) |
| Learn JQL queries | [JQL Reference](JQL_REFERENCE.md) |
| Manage boards/sprints | [Boards & Sprints](BOARDS_SPRINTS.md) |
| See practical examples | [Usage Guide](USAGE_GUIDE.md) |
| Fix problems | [Troubleshooting](TROUBLESHOOTING.md) |
| Get help | [Support](SUPPORT.md) |

---

## By User Intent

### "I want to set up the MCP server"
→ [Installation Guide](INSTALLATION.md)
- Prerequisites
- Step-by-step setup
- Claude Desktop configuration
- Testing installation

### "I want to learn the basics quickly"
→ [Quick Start Guide](QUICK_START.md)
- 3-step installation
- Essential commands
- Common workflows
- Cheat sheet

### "I need to find how to do X"
→ [API Reference](API_REFERENCE.md)
- All 30+ tools documented
- Parameters and examples
- Response formats
- Error handling

### "I want to search for issues"
→ [JQL Reference](JQL_REFERENCE.md)
- JQL syntax
- Common query patterns
- Functions and operators
- Performance tips

### "I need to manage sprints"
→ [Boards & Sprints Guide](BOARDS_SPRINTS.md)
- Board operations
- Sprint lifecycle
- Planning workflows
- Best practices

### "I want practical examples"
→ [Usage Guide](USAGE_GUIDE.md)
- Daily workflows
- Sprint management
- Advanced scenarios
- Natural language examples

### "Something isn't working"
→ [Troubleshooting Guide](TROUBLESHOOTING.md)
- Common errors
- Solutions
- Debug tips
- FAQ

### "I need help"
→ [Support Guide](SUPPORT.md)
- Contact information
- Community resources
- How to report issues

---

## By Tool Category

### Issue Management
**Documentation**: [API Reference - Issues](API_REFERENCE.md#issue-management)

**Tools**:
- `jira_search_issues` - Search with JQL
- `jira_get_issue` - Get issue details
- `jira_create_issue` - Create new issue
- `jira_update_issue` - Update issue
- `jira_transition_issue` - Change status
- `jira_add_comment` - Add comment

**See Also**:
- [JQL Reference](JQL_REFERENCE.md) for search queries
- [Usage Guide - Issue Management](USAGE_GUIDE.md#issue-management)

### Board Management
**Documentation**: [API Reference - Boards](API_REFERENCE.md#board-management)

**Tools**:
- `jira_get_boards` - List boards
- `jira_get_board` - Get board details
- `jira_get_board_configuration` - Get board settings
- `jira_get_board_issues` - Query board issues

**See Also**:
- [Boards & Sprints Guide](BOARDS_SPRINTS.md#board-operations)
- [Usage Guide - Sprint Management](USAGE_GUIDE.md#sprint-management)

### Sprint Management
**Documentation**: [API Reference - Sprints](API_REFERENCE.md#sprint-management)

**Tools**:
- `jira_get_board_sprints` - List sprints
- `jira_create_sprint` - Create sprint
- `jira_start_sprint` - Start sprint
- `jira_close_sprint` - Close sprint
- `jira_add_issues_to_sprint` - Add issues
- `jira_get_sprint_issues` - Get sprint issues

**See Also**:
- [Boards & Sprints Guide - Sprint Lifecycle](BOARDS_SPRINTS.md#sprint-lifecycle)
- [Usage Guide - Sprint Planning](USAGE_GUIDE.md#sprint-planning-session)

---

## By Use Case

### Daily Standup
1. [Usage Guide - Morning Standup](USAGE_GUIDE.md#morning-standup-preparation)
2. [API Reference - jira_get_sprint_issues](API_REFERENCE.md#jira_get_sprint_issues)
3. [JQL Reference - Sprint Queries](JQL_REFERENCE.md#sprint-queries)

### Sprint Planning
1. [Boards & Sprints - Sprint Planning](BOARDS_SPRINTS.md#workflow-1-sprint-planning)
2. [Usage Guide - Sprint Planning](USAGE_GUIDE.md#sprint-planning-session)
3. [API Reference - Sprint Tools](API_REFERENCE.md#sprint-management)

### Bug Triage
1. [Usage Guide - Bug Triage](USAGE_GUIDE.md#automated-bug-triage)
2. [JQL Reference - Type Queries](JQL_REFERENCE.md#type-queries)
3. [API Reference - Search](API_REFERENCE.md#jira_search_issues)

### Release Planning
1. [Usage Guide - Release Planning](USAGE_GUIDE.md#release-planning)
2. [JQL Reference - Epic Queries](JQL_REFERENCE.md#epic-queries)

### Sprint Review
1. [Boards & Sprints - Sprint Review](BOARDS_SPRINTS.md#workflow-3-sprint-review)
2. [Usage Guide - Sprint Review](USAGE_GUIDE.md#sprint-review)

---

## By Experience Level

### Beginner
Start here:
1. [Quick Start Guide](QUICK_START.md) - Get up and running
2. [Installation Guide](INSTALLATION.md) - If you need detailed setup
3. [Usage Guide - Basic Operations](USAGE_GUIDE.md#basic-operations)

Then explore:
- [API Reference](API_REFERENCE.md) - Learn available tools
- [JQL Reference - Basic Syntax](JQL_REFERENCE.md#basic-syntax)

### Intermediate
You understand the basics, now:
1. [JQL Reference](JQL_REFERENCE.md) - Master queries
2. [Boards & Sprints Guide](BOARDS_SPRINTS.md) - Manage sprints
3. [Usage Guide - Daily Workflows](USAGE_GUIDE.md#daily-workflows)

Advanced topics:
- [Usage Guide - Advanced Scenarios](USAGE_GUIDE.md#advanced-scenarios)
- [Boards & Sprints - Best Practices](BOARDS_SPRINTS.md#best-practices)

### Advanced
Deep dives:
1. [API Reference - All Tools](API_REFERENCE.md) - Complete reference
2. [JQL Reference - Advanced Patterns](JQL_REFERENCE.md#advanced-patterns)
3. [Boards & Sprints - Advanced Topics](BOARDS_SPRINTS.md#advanced-topics)
4. [Usage Guide - Cross-Sprint Analysis](USAGE_GUIDE.md#cross-sprint-analysis)

---

## By Problem Type

### Installation Issues
→ [Troubleshooting - Installation](TROUBLESHOOTING.md#installation-issues)
- Server not showing up
- Authentication errors
- Permission problems
- Module errors

### Authentication Issues
→ [Troubleshooting - Authentication](TROUBLESHOOTING.md#authentication-errors)
- 401 Unauthorized
- Invalid credentials
- Token expired

### Usage Issues
→ [Troubleshooting - Common Errors](TROUBLESHOOTING.md#common-errors)
- Issue not found
- Can't transition issue
- Sprint errors
- JQL syntax errors

### Performance Issues
→ [JQL Reference - Performance Tips](JQL_REFERENCE.md#performance-tips)
- Slow queries
- Timeout errors
- Large result sets

---

## Common Questions & Answers

### "How do I create an issue?"
[API Reference - jira_create_issue](API_REFERENCE.md#jira_create_issue)

### "How do I add an issue to a sprint?"
[API Reference - jira_add_issues_to_sprint](API_REFERENCE.md#jira_add_issues_to_sprint)

### "How do I search for issues?"
[API Reference - jira_search_issues](API_REFERENCE.md#jira_search_issues) + [JQL Reference](JQL_REFERENCE.md)

### "How do I start a sprint?"
[Boards & Sprints - Sprint Lifecycle](BOARDS_SPRINTS.md#3-start-sprint)

### "How do I see my current work?"
[Usage Guide - View Your Work](USAGE_GUIDE.md#view-your-work)

### "How do I plan a sprint?"
[Boards & Sprints - Workflow 1](BOARDS_SPRINTS.md#workflow-1-sprint-planning)

### "What JQL queries can I use?"
[JQL Reference - Common Patterns](JQL_REFERENCE.md#common-query-patterns)

### "How do I close a sprint?"
[API Reference - jira_close_sprint](API_REFERENCE.md#jira_close_sprint)

### "How do I update an issue?"
[API Reference - jira_update_issue](API_REFERENCE.md#jira_update_issue)

### "How do I get help?"
[Support Guide](SUPPORT.md)

---

## Documentation Map

```
Jira MCP Documentation
│
├── Getting Started
│   ├── Quick Start (5 min)
│   └── Installation (15 min)
│
├── Core Reference
│   ├── API Reference (all tools)
│   ├── JQL Reference (queries)
│   └── Boards & Sprints (agile)
│
├── Practical Guides
│   ├── Usage Guide (examples)
│   └── Documentation Index (this file)
│
└── Support
    ├── Troubleshooting
    └── Support Contact
```

---

## File Structure

```
mcp-server/
├── README.md                    # Project overview
├── docs/
│   ├── INSTALLATION.md          # Setup guide
│   ├── QUICK_START.md           # 5-minute start
│   ├── API_REFERENCE.md         # All tools
│   ├── JQL_REFERENCE.md         # Query language
│   ├── BOARDS_SPRINTS.md        # Agile management
│   ├── USAGE_GUIDE.md           # Practical examples
│   ├── DOCUMENTATION_INDEX.md   # This file
│   ├── TROUBLESHOOTING.md       # Fix problems
│   └── SUPPORT.md               # Get help
└── src/
    └── ... (implementation)
```

---

## Search Tips for AI

When searching for information in this documentation:

**For tools**: Search in [API Reference](API_REFERENCE.md)
- Pattern: `jira_` + action (e.g., `jira_create_issue`)

**For queries**: Search in [JQL Reference](JQL_REFERENCE.md)
- Pattern: field + operator + value (e.g., `status = Done`)

**For workflows**: Search in [Usage Guide](USAGE_GUIDE.md)
- Pattern: Look for scenario or workflow names

**For setup**: Search in [Installation](INSTALLATION.md) or [Troubleshooting](TROUBLESHOOTING.md)
- Pattern: Look for error messages or setup steps

---

## Update History

This documentation covers:
- ✅ All 30+ Jira MCP tools
- ✅ Complete JQL reference
- ✅ Board & sprint management
- ✅ Practical workflows
- ✅ Troubleshooting guide
- ✅ AI-friendly navigation

**Last Updated**: October 2025
**Version**: 1.0
**Instance**: keplercommerce.atlassian.net
**Project**: PROD (PORTAL/SAAS)

---

## Need Something Not Here?

1. Check [Troubleshooting](TROUBLESHOOTING.md)
2. Search this index for keywords
3. Contact [Support](SUPPORT.md)

---

**Pro Tip**: Use Ctrl+F (or Cmd+F) to search within documents for specific terms!
