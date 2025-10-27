# Troubleshooting Guide

Solutions to common problems with the Jira MCP Server.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Authentication Errors](#authentication-errors)
- [Common Errors](#common-errors)
- [Performance Issues](#performance-issues)
- [Debug Tips](#debug-tips)
- [FAQ](#faq)

---

## Installation Issues

### Server Not Showing Up in Claude Code

**Symptoms**: MCP server doesn't appear in Claude Code tools

**Possible Causes**:
1. Configuration file path incorrect
2. JSON syntax error in config
3. Server path wrong
4. Claude Code not restarted

**Solutions**:

**Step 1**: Verify configuration file location

**Windows**:
```bash
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**macOS**:
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Step 2**: Validate JSON syntax

Use [JSONLint](https://jsonlint.com) to check for syntax errors.

**Common mistakes**:
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [
        "/path/to/FP_mcp-configuration-template/jira-mcp-server/dist/index.js"  // ✅ Forward slashes on Windows
      ]
    }
  }
}
```

**Wrong**:
```json
"args": ["C:\Users\kossa\..."]  // ❌ Backslashes without escaping
"args": ["~/Projects/..."]      // ❌ Tilde may not work
```

**Step 3**: Verify server builds

```bash
cd ~/FP_mcp-configuration-template/jira-mcp-server
npm run build
node dist/index.js  # Should start without errors
```

**Step 4**: Completely restart Claude Code

- Windows: Right-click taskbar icon → Quit
- macOS: Cmd+Q (not just close window)
- Then restart Claude Code

**Step 5**: Check Claude logs

**Windows**:
```
%APPDATA%\Claude\logs\mcp*.log
```

**macOS**:
```
~/Library/Logs/Claude/mcp*.log
```

Look for error messages related to your MCP server.

---

### Module Not Found Error

**Error**:
```
Cannot find module '@modelcontextprotocol/sdk'
```

**Solution**:
```bash
cd ~/FP_mcp-configuration-template/jira-mcp-server
rm -rf node_modules package-lock.json
npm install
npm run build
```

Then restart Claude Code.

---

### Build Errors

**Error**:
```
TS2307: Cannot find module 'axios'
```

**Solution**: Install missing dependencies
```bash
npm install axios dotenv @modelcontextprotocol/sdk
npm run build
```

---

## Authentication Errors

### 401 Unauthorized

**Error**:
```
401 Unauthorized - Authentication failed
```

**Possible Causes**:
1. Invalid API token
2. Incorrect email address
3. Token expired
4. Wrong Jira host

**Solutions**:

**Step 1**: Verify credentials in `.env`

```bash
cat .env
```

Should look like:
```env
JIRA_HOST=keplercommerce.atlassian.net
JIRA_EMAIL=kostyantyn@keplercommerce.com
JIRA_API_TOKEN=ATATT3xF...
```

**Step 2**: Test credentials manually

```bash
curl -u "your-email@example.com:your-api-token" \
  https://keplercommerce.atlassian.net/rest/api/3/myself
```

If this fails, credentials are wrong.

**Step 3**: Regenerate API token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Revoke old token
3. Create new token
4. Update `.env` file
5. Rebuild and restart

```bash
npm run build
# Restart Claude Code
```

---

### 403 Forbidden

**Error**:
```
403 Forbidden - You don't have permission
```

**Possible Causes**:
1. User doesn't have permission for the project
2. Project settings restrict access
3. Board/Sprint permissions limited

**Solutions**:

**Step 1**: Verify project access

Try accessing the project in Jira web UI.

**Step 2**: Check role in project

You need at least "Developer" role for most operations.

**Step 3**: Contact Jira admin

Ask admin to grant appropriate permissions.

---

## Common Errors

### Issue Not Found (404)

**Error**:
```
404 Not Found - Issue PROD-999 does not exist
```

**Possible Causes**:
1. Issue key typo
2. Issue doesn't exist
3. No permission to view issue

**Solutions**:

**Step 1**: Verify issue key format

Correct format: `PROJECT-NUMBER` (e.g., `PROD-123`)

**Step 2**: Search for issue

```javascript
await mcp__jira__jira_search_issues({
  jql: "key = PROD-123"
});
```

**Step 3**: Check permissions

Try viewing issue in Jira web UI.

---

### Can't Transition Issue

**Error**:
```
Transition 'Done' not available for issue PROD-123
```

**Cause**: The transition isn't valid from current status

**Solution**: Check available transitions

```javascript
const transitions = await mcp__jira__jira_get_issue_transitions({
  issueKey: "PROD-123"
});

console.log("Available transitions:");
transitions.transitions.forEach(t => console.log(`- ${t.name}`));
```

Use one of the available transition names.

---

### JQL Syntax Error (400)

**Error**:
```
400 Bad Request - Error in JQL query
```

**Common JQL Mistakes**:

**1. Missing quotes for multi-word values**
```
❌ status = In Progress
✅ status = "In Progress"
```

**2. Wrong date format**
```
❌ created > 7d
✅ created >= -7d
```

**3. Reserved words without quotes**
```
❌ labels = ORDER
✅ labels = "ORDER"
```

**4. Invalid field names**
```
❌ Sprint = "Sprint 24"
✅ Sprint = 893  (use ID, not name)
```

**Solution**: Test JQL in Jira web UI first

Go to Issues → Search → Advanced and test your query.

See [JQL Reference](JQL_REFERENCE.md) for correct syntax.

---

### Sprint Already Active

**Error**:
```
Cannot start sprint - Board already has an active sprint
```

**Cause**: Scrum boards can only have one active sprint

**Solution**: Close the current sprint first

```javascript
// Get active sprints
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268,
  state: "active"
});

// Close the active sprint
if (sprints.values.length > 0) {
  await mcp__jira__jira_close_sprint({
    sprintId: sprints.values[0].id,
    moveToBacklog: true
  });
}

// Now start new sprint
await mcp__jira__jira_start_sprint({
  sprintId: 894
});
```

---

### Issue Not in Sprint

**Problem**: Created issue doesn't appear in sprint

**Possible Causes**:
1. Issue wasn't added to sprint
2. Issue doesn't match board filter
3. Board cache not updated

**Solutions**:

**Step 1**: Manually add to sprint

```javascript
await mcp__jira__jira_add_issues_to_sprint({
  sprintId: 893,
  issues: ["PROD-123"]
});
```

**Step 2**: Check board filter

```javascript
const config = await mcp__jira__jira_get_board_configuration({
  boardId: 268
});
console.log("Board filter:", config.filter.query);
```

Ensure issue matches the filter criteria.

**Step 3**: Refresh board in Jira UI

Sometimes board needs manual refresh.

---

## Performance Issues

### Slow Queries

**Symptom**: JQL searches take too long

**Solutions**:

**1. Limit results**
```javascript
await mcp__jira__jira_search_issues({
  jql: "project = PROD",
  maxResults: 50  // Don't fetch more than needed
});
```

**2. Use specific filters**
```javascript
// ✅ Good - specific
"project = PROD AND status = Done AND updated >= -7d"

// ❌ Bad - too broad
"status = Done"
```

**3. Avoid text searches**
```javascript
// ✅ Fast
"status = Done"

// ⚠️ Slower
"summary ~ 'something'"
```

See [JQL Reference - Performance Tips](JQL_REFERENCE.md#performance-tips)

---

### Timeout Errors

**Error**:
```
Request timeout
```

**Solutions**:

**1. Reduce maxResults**

```javascript
// Instead of
maxResults: 1000

// Use
maxResults: 100
```

**2. Use pagination**

```javascript
let startAt = 0;
const maxResults = 50;
let allIssues = [];

while (true) {
  const results = await mcp__jira__jira_search_issues({
    jql: "project = PROD",
    maxResults,
    startAt
  });

  allIssues = allIssues.concat(results.issues);

  if (results.issues.length < maxResults) break;
  startAt += maxResults;
}
```

---

## Debug Tips

### Enable Verbose Logging

Add debug output to see what's happening:

**In your code**:
```javascript
console.log("Searching for issues...");
const results = await mcp__jira__jira_search_issues({
  jql: "project = PROD"
});
console.log(`Found ${results.total} issues`);
```

### Test API Directly

Use curl to test Jira API without MCP:

```bash
curl -X GET \
  -H "Content-Type: application/json" \
  -u "your-email@example.com:your-api-token" \
  "https://keplercommerce.atlassian.net/rest/api/3/project"
```

### Check MCP Server Status

```bash
cd ~/FP_mcp-configuration-template/jira-mcp-server
node dist/index.js
```

Should start without errors. Press Ctrl+C to stop.

### Verify Build Output

```bash
ls -la dist/
```

Should contain `index.js` and other compiled files.

### Check Node Version

```bash
node --version
```

Should be 18.0.0 or higher.

### Inspect Configuration

```bash
# Windows
type %APPDATA%\Claude\claude_desktop_config.json

# macOS/Linux
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

---

## FAQ

### Q: Why can't Claude see my Jira boards?

**A**: Check that:
1. Your API token has correct permissions
2. You're searching the right project
3. Boards exist in the project

Test:
```javascript
await mcp__jira__jira_get_boards({
  projectKeyOrId: "PROD"
});
```

---

### Q: How do I update the MCP server?

**A**:
1. Make code changes
2. Rebuild: `npm run build`
3. **Completely restart Claude Code** (important!)

Changes won't take effect until Claude restarts.

---

### Q: Can I use multiple Jira instances?

**A**: Yes! Create multiple server entries in config:

```json
{
  "mcpServers": {
    "jira-prod": {
      "command": "node",
      "args": ["path/to/server1/dist/index.js"]
    },
    "jira-dev": {
      "command": "node",
      "args": ["path/to/server2/dist/index.js"]
    }
  }
}
```

---

### Q: Why do I get "Sprint not found"?

**A**: Sprint IDs are numeric. Don't use sprint names:

```javascript
// ❌ Wrong
Sprint = "Sprint 24"

// ✅ Correct
Sprint = 893
```

Get sprint ID first:
```javascript
const sprints = await mcp__jira__jira_get_board_sprints({
  boardId: 268
});
console.log(sprints.values[0].id);  // Use this ID
```

---

### Q: How do I handle rate limits?

**A**: Jira has rate limits (~100 req/min). If you hit them:

1. Add delays between requests
2. Use pagination instead of large queries
3. Cache results when possible

```javascript
// Add delay
await new Promise(resolve => setTimeout(resolve, 1000));
```

---

### Q: Why are custom fields showing as null?

**A**: Custom fields may not be set for all issues. Check if field exists:

```javascript
const issue = await mcp__jira__jira_get_issue({
  issueKey: "PROD-123"
});

if (issue.fields.customfield_10020) {
  console.log("Sprint:", issue.fields.customfield_10020);
} else {
  console.log("No sprint assigned");
}
```

---

### Q: Can I undo a closed sprint?

**A**: No, once closed, a sprint cannot be reopened. You can:
1. Create a new sprint
2. Move issues back to the new sprint

```javascript
await mcp__jira__jira_create_sprint({
  boardId: 268,
  name: "Sprint 24 (Reopened)"
});
```

---

## Still Having Issues?

If you can't find a solution:

1. **Check Claude logs** for error messages
2. **Test Jira API directly** with curl
3. **Verify all credentials** are correct
4. **Search existing issues** on GitHub
5. **Contact support** (see [Support Guide](SUPPORT.md))

---

## Common Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid JQL or parameters |
| 401 | Unauthorized | Wrong credentials |
| 403 | Forbidden | No permission |
| 404 | Not Found | Issue/Board/Sprint doesn't exist |
| 429 | Too Many Requests | Rate limit hit |
| 500 | Server Error | Jira server issue |

---

## Useful Commands

**Rebuild server**:
```bash
cd ~/FP_mcp-configuration-template/jira-mcp-server
npm run build
```

**Test credentials**:
```bash
curl -u "email:token" https://keplercommerce.atlassian.net/rest/api/3/myself
```

**Check logs** (Windows):
```cmd
type %APPDATA%\Claude\logs\mcp*.log
```

**Check logs** (macOS):
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Validate JSON config**:
```bash
# macOS/Linux
python3 -m json.tool ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Windows PowerShell
Get-Content $env:APPDATA\Claude\claude_desktop_config.json | ConvertFrom-Json
```

---

**Need more help?** See [Support Guide](SUPPORT.md)
