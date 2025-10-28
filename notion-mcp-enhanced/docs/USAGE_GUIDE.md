# Usage Guide - Notion MCP

Practical examples and workflows for common Notion tasks.

## Table of Contents

- [Task Management](#task-management)
- [Meeting Notes](#meeting-notes)
- [Project Tracking](#project-tracking)
- [Team Collaboration](#team-collaboration)
- [Advanced Workflows](#advanced-workflows)

---

## Task Management

### View Your Tasks

**Natural Language**:
```
"Show me all my tasks that are not done"
```

**What Claude does**:
```javascript
// 1. Get your user ID
const self = await get_self();
const userId = self.bot.owner.user.id;

// 2. Query tasks database
await query_database({
  database_id: "tasks-db-id",
  filter: {
    "and": [
      {"property": "Assignee", "people": {"contains": userId}},
      {"property": "Status", "status": {"does_not_equal": "Done"}}
    ]
  },
  page_size: 20
});
```

---

### Create New Task

**Natural Language**:
```
"Create a task: Fix login bug
Status: To Do
Priority: High
Assign to: Kostyantyn"
```

**What Claude does**:
```javascript
await create_page({
  title: "Fix login bug",
  parent_database_id: "tasks-db-id",
  properties: {
    "Status": {"status": {"name": "To Do"}},
    "Priority": {"select": {"name": "High"}},
    "Assignee": {"people": [{"id": "user-id"}]}
  }
});
```

---

### Update Task Status

**Natural Language**:
```
"Mark task TASK-123 as done"
```

**What Claude does**:
```javascript
await update_page_status({
  page_id: "task-123-id",
  property_name: "Status",
  status_value: "Done"
});
```

---

### Batch Update Tasks

**Natural Language**:
```
"Update these tasks to In Progress: task1, task2, task3"
```

**What Claude does**:
```javascript
await update_pages_batch({
  pages: [
    {page_id: "task1-id", properties: {"Status": {"status": {"name": "In Progress"}}}},
    {page_id: "task2-id", properties: {"Status": {"status": {"name": "In Progress"}}}},
    {page_id: "task3-id", properties: {"Status": {"status": {"name": "In Progress"}}}}
  ]
});
```

---

### Filter by Priority and Status

**Natural Language**:
```
"Show high priority tasks that are in progress"
```

**What Claude does**:
```javascript
await query_database({
  database_id: "tasks-db-id",
  filter: {
    "and": [
      {"property": "Priority", "select": {"equals": "High"}},
      {"property": "Status", "status": {"equals": "In Progress"}}
    ]
  },
  sorts: [
    {"property": "Due Date", "direction": "ascending"}
  ],
  page_size: 20
});
```

---

## Meeting Notes

### Create Meeting Notes Page

**Natural Language**:
```
"Create meeting notes for Product Sync - October 28"
```

**What Claude does**:
```javascript
// 1. Create page
const page = await create_page({
  title: "Product Sync - October 28, 2025",
  parent_page_id: "meetings-folder-id",
  icon: {"type": "emoji", "emoji": "📝"}
});

// 2. Add structure
await append_rich_content({
  block_id: page.id,
  content_type: "heading_2",
  text: "Attendees"
});

await append_rich_content({
  block_id: page.id,
  content_type: "heading_2",
  text: "Discussion Points"
});

await append_rich_content({
  block_id: page.id,
  content_type: "heading_2",
  text: "Action Items"
});
```

---

### Add Meeting Action Items

**Natural Language**:
```
"Add these action items to the meeting notes:
- Review design mockups
- Update API documentation
- Schedule follow-up meeting"
```

**What Claude does**:
```javascript
await append_blocks({
  block_id: "meeting-page-id",
  children: [
    {
      "type": "to_do",
      "to_do": {
        "rich_text": [{"type": "text", "text": {"content": "Review design mockups"}}],
        "checked": false
      }
    },
    {
      "type": "to_do",
      "to_do": {
        "rich_text": [{"type": "text", "text": {"content": "Update API documentation"}}],
        "checked": false
      }
    },
    {
      "type": "to_do",
      "to_do": {
        "rich_text": [{"type": "text", "text": {"content": "Schedule follow-up meeting"}}],
        "checked": false
      }
    }
  ]
});
```

---

## Project Tracking

### View Project Status

**Natural Language**:
```
"Show all projects, sorted by last edited"
```

**What Claude does**:
```javascript
await query_database({
  database_id: "projects-db-id",
  sorts: [
    {"timestamp": "last_edited_time", "direction": "descending"}
  ],
  page_size: 25
});
```

---

### Find Overdue Tasks

**Natural Language**:
```
"Find tasks with due date before today that aren't done"
```

**What Claude does**:
```javascript
const today = new Date().toISOString().split('T')[0];

await query_database({
  database_id: "tasks-db-id",
  filter: {
    "and": [
      {"property": "Due Date", "date": {"before": today}},
      {"property": "Status", "status": {"does_not_equal": "Done"}}
    ]
  },
  page_size: 20
});
```

---

### Create Weekly Report

**Natural Language**:
```
"Create a page summarizing this week's completed tasks"
```

**What Claude does**:
```javascript
// 1. Query completed tasks from this week
const tasks = await query_database({
  database_id: "tasks-db-id",
  filter: {
    "and": [
      {"property": "Status", "status": {"equals": "Done"}},
      {"property": "Completed Date", "date": {"this_week": {}}}
    ]
  },
  page_size: 50
});

// 2. Create report page
const report = await create_page({
  title: "Weekly Report - Week of Oct 28",
  parent_page_id: "reports-folder-id"
});

// 3. Add completed tasks
for (const task of tasks.results) {
  await append_rich_content({
    block_id: report.id,
    content_type: "bulleted_list_item",
    text: task.properties.Name.title[0].plain_text
  });
}
```

---

## Team Collaboration

### Assign Tasks to Team

**Natural Language**:
```
"Assign these tasks to John: task1, task2, task3"
```

**What Claude does**:
```javascript
// 1. Find John's user ID
const users = await list_users();
const john = users.results.find(u =>
  u.name.includes("John") || u.person.email.includes("john")
);

// 2. Update tasks
await update_pages_batch({
  pages: [
    {page_id: "task1-id", properties: {"Assignee": {"people": [{"id": john.id}]}}},
    {page_id: "task2-id", properties: {"Assignee": {"people": [{"id": john.id}]}}},
    {page_id: "task3-id", properties: {"Assignee": {"people": [{"id": john.id}]}}}
  ]
});
```

---

### Add Review Comments

**Natural Language**:
```
"Add comment to page: Looks great, approved for deployment"
```

**What Claude does**:
```javascript
await create_comment({
  page_id: "page-id",
  text: "Looks great, approved for deployment"
});
```

---

## Advanced Workflows

### Multi-Database Query

**Natural Language**:
```
"Find all high priority items across Projects and Tasks databases"
```

**What Claude does**:
```javascript
// Query multiple databases
const projectsResults = await query_database({
  database_id: "projects-db-id",
  filter: {"property": "Priority", "select": {"equals": "High"}},
  page_size: 20
});

const tasksResults = await query_database({
  database_id: "tasks-db-id",
  filter: {"property": "Priority", "select": {"equals": "High"}},
  page_size: 20
});

// Combine results
const allHighPriority = [
  ...projectsResults.results,
  ...tasksResults.results
];
```

---

### Create Template and Duplicate

**Natural Language**:
```
"Create 5 copies of the project template page"
```

**What Claude does**:
```javascript
for (let i = 1; i <= 5; i++) {
  await duplicate_page({
    page_id: "template-page-id"
  });
}
```

---

### Archive Completed Tasks

**Natural Language**:
```
"Archive all tasks with status Done"
```

**What Claude does**:
```javascript
// 1. Find completed tasks
const completed = await query_database({
  database_id: "tasks-db-id",
  filter: {"property": "Status", "status": {"equals": "Done"}},
  page_size: 50
});

// 2. Archive them
for (const task of completed.results) {
  await update_page({
    page_id: task.id,
    archived: true
  });
}
```

---

### Move Pages to Archive Folder

**Natural Language**:
```
"Move all pages from Inbox to Archive"
```

**What Claude does**:
```javascript
// 1. Get pages from Inbox
const inboxPages = await get_block_children({
  block_id: "inbox-page-id",
  page_size: 50
});

// 2. Move to Archive
const pageIds = inboxPages.results.map(p => p.id);

await move_pages({
  page_ids: pageIds,
  target_parent_id: "archive-page-id"
});
```

---

## Pagination in Practice

### Safe Database Query

**Natural Language**:
```
"Get all tasks from my large database (safely)"
```

**What Claude does**:
```javascript
async function getAllTasksSafely(database_id) {
  let allTasks = [];
  let cursor = undefined;
  let hasMore = true;
  let pageCount = 0;

  while (hasMore) {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const response = await query_database({
      database_id: database_id,
      page_size: 25,  // Safe size
      start_cursor: cursor
    });

    allTasks.push(...response.results);
    cursor = response.next_cursor;
    hasMore = response.has_more;

    console.log(`Loaded ${allTasks.length} tasks so far`);
  }

  console.log(`✅ Complete! Total: ${allTasks.length} tasks`);
  return allTasks;
}
```

---

## Natural Language Tips

### Good Prompts

✅ **Specific and clear**:
- "Query Tasks database with status = In Progress"
- "Create page in Meeting Notes folder with title 'Standup Oct 28'"
- "Update task ABC-123 priority to High"

✅ **Mentions pagination for large data**:
- "Query large database with page_size 20"
- "Get first 30 tasks, then next 30"

✅ **Includes all required info**:
- "Create task with Status=To Do, Assignee=John, Priority=Medium"

### Prompts to Avoid

❌ **Too vague**:
- "Show me stuff" (What stuff? Where?)
- "Update the thing" (Which thing? Update what?)

❌ **No pagination for large databases**:
- "Get all 500 tasks" (Will exceed token limit!)
- Better: "Get all tasks with page_size 20"

❌ **Missing required parameters**:
- "Create page" (Where? What parent? What properties?)

---

## Combining Tools

### Example: Full Task Creation Workflow

**Natural Language**:
```
"Create a task for fixing the login bug,
assign it to me,
add it to Sprint 24 project relation,
and add a comment about urgency"
```

**What Claude does**:
```javascript
// 1. Create task
const task = await create_page({
  title: "Fix login bug",
  parent_database_id: "tasks-db-id",
  properties: {
    "Status": {"status": {"name": "To Do"}},
    "Priority": {"select": {"name": "High"}},
    "Assignee": {"people": [{"id": "your-user-id"}]},
    "Related Project": {"relation": [{"id": "sprint-24-page-id"}]}
  }
});

// 2. Add urgency comment
await create_comment({
  page_id: task.id,
  text: "URGENT: This is blocking user logins in production!"
});
```

---

## Next Steps

- Review [API Reference](API_REFERENCE.md) for all available tools
- Study [Pagination Guide](PAGINATION.md) to avoid errors
- Check [Troubleshooting](TROUBLESHOOTING.md) if you encounter issues

---

**Happy automating with Notion MCP!** 🚀
