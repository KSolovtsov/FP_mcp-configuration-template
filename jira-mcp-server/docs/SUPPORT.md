# Support Guide

How to get help with the Jira MCP Server.

## Quick Links

- **Email Support**: kostyantyn@keplercommerce.com
- **Documentation**: [Documentation Index](DOCUMENTATION_INDEX.md)
- **Troubleshooting**: [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## Before Asking for Help

Please try these steps first:

### 1. Check Documentation

- [Documentation Index](DOCUMENTATION_INDEX.md) - Find the right guide
- [Troubleshooting](TROUBLESHOOTING.md) - Common problems and solutions
- [API Reference](API_REFERENCE.md) - Tool documentation
- [FAQ](#faq) - Frequently asked questions

### 2. Verify Installation

```bash
# Test server runs
cd ~/Projects/Jira/mcp-server
node dist/index.js

# Check build is current
npm run build

# Verify credentials
curl -u "your-email:your-token" \
  https://keplercommerce.atlassian.net/rest/api/3/myself
```

### 3. Check Claude Logs

**Windows**:
```cmd
type %APPDATA%\Claude\logs\mcp*.log
```

**macOS**:
```bash
cat ~/Library/Logs/Claude/mcp*.log
```

Look for error messages related to the Jira MCP server.

### 4. Review Recent Changes

Did you:
- Update Node.js version?
- Change configuration files?
- Modify the MCP server code?
- Update dependencies?

Try reverting recent changes.

---

## How to Report Issues

When contacting support, please include:

### 1. Problem Description

- What were you trying to do?
- What happened instead?
- When did this start happening?

### 2. Environment Information

```bash
# Node version
node --version

# NPM version
npm --version

# OS
# Windows: systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
# macOS: sw_vers
# Linux: lsb_release -a

# MCP server version
cd ~/Projects/Jira/mcp-server
npm list @modelcontextprotocol/sdk
```

### 3. Error Messages

Include:
- Complete error message
- Stack trace (if available)
- Claude Desktop logs
- Console output

### 4. Configuration

**Sanitize sensitive data first!**

Share (with credentials removed):
- `.env` file content
- `claude_desktop_config.json` MCP section
- `package.json`

### 5. Steps to Reproduce

List exact steps to reproduce the issue:
1. First I did...
2. Then I...
3. Error occurred when...

---

## Contact Methods

### Email Support

**Primary Contact**: kostyantyn@keplercommerce.com

**When to use**:
- Technical issues
- Bug reports
- Feature requests
- General questions

**Response time**: Usually within 1-2 business days

**Email Template**:
```
Subject: [Jira MCP] Brief description of issue

Environment:
- OS: Windows 11 / macOS 14 / etc.
- Node: v18.x.x
- Claude Desktop: version

Problem:
[Describe what's wrong]

Steps to Reproduce:
1. ...
2. ...
3. ...

Error Message:
[Paste error here]

What I've tried:
- Checked documentation
- Restarted Claude Desktop
- Rebuilt MCP server
- [Other steps]

Logs:
[Paste relevant logs]
```

---

## Self-Service Resources

### Documentation

| Resource | Purpose |
|----------|---------|
| [Quick Start](QUICK_START.md) | Get started in 5 minutes |
| [Installation](INSTALLATION.md) | Setup guide |
| [API Reference](API_REFERENCE.md) | Tool documentation |
| [JQL Reference](JQL_REFERENCE.md) | Query language |
| [Boards & Sprints](BOARDS_SPRINTS.md) | Agile management |
| [Usage Guide](USAGE_GUIDE.md) | Practical examples |
| [Troubleshooting](TROUBLESHOOTING.md) | Fix problems |

### External Resources

**Jira Documentation**:
- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Jira Agile API](https://developer.atlassian.com/cloud/jira/software/rest/)
- [JQL Documentation](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/)

**MCP Documentation**:
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/anthropics/modelcontextprotocol)

**Claude Code**:
- [Claude Desktop Docs](https://docs.anthropic.com/claude/docs)

---

## FAQ

### General Questions

**Q: Is the Jira MCP Server free?**

A: Yes, this MCP server is open source. However, you need a Jira Cloud subscription.

**Q: What Jira plans are supported?**

A: All Jira Cloud plans (Free, Standard, Premium, Enterprise).

**Q: Can I use with Jira Server/Data Center?**

A: No, currently only Jira Cloud is supported. Server/Data Center has different APIs.

**Q: Do I need admin access?**

A: No, regular user access is sufficient. Some operations require specific permissions.

### Installation Questions

**Q: Which Node.js version do I need?**

A: Node.js 18 or higher.

**Q: Do I need to install anything globally?**

A: No, all dependencies are local to the project.

**Q: Can I install on multiple machines?**

A: Yes! Just copy the project and run `npm install`.

### Usage Questions

**Q: How many boards can I have?**

A: Unlimited. Your PROD project currently has 8 boards.

**Q: Can I create custom JQL queries?**

A: Yes! See [JQL Reference](JQL_REFERENCE.md) for syntax.

**Q: How do I handle custom fields?**

A: Custom fields use IDs like `customfield_10020`. Check field IDs in Jira settings.

**Q: Can I automate workflows?**

A: Yes! You can script workflows using the MCP tools. See [Usage Guide](USAGE_GUIDE.md) for examples.

### Troubleshooting Questions

**Q: Why isn't my server showing in Claude?**

A: See [Troubleshooting - Server Not Showing](TROUBLESHOOTING.md#server-not-showing-up-in-claude-desktop)

**Q: Why do I get authentication errors?**

A: See [Troubleshooting - Authentication Errors](TROUBLESHOOTING.md#authentication-errors)

**Q: My queries are slow, what can I do?**

A: See [Troubleshooting - Performance Issues](TROUBLESHOOTING.md#performance-issues)

---

## Feature Requests

Have an idea for a new feature? We'd love to hear it!

**Before requesting**:
1. Check if feature already exists in [API Reference](API_REFERENCE.md)
2. Search existing issues/requests
3. Consider if it's MCP-specific or a Jira limitation

**Submit via**:
- Email: kostyantyn@keplercommerce.com

**Include**:
- Use case description
- Expected behavior
- Example usage
- Why this is valuable

---

## Contributing

Want to contribute to the MCP server?

**Ways to contribute**:
- Report bugs
- Suggest features
- Improve documentation
- Submit code changes

**Development setup**:
```bash
cd ~/Projects/Jira/mcp-server

# Install dependencies
npm install

# Make changes
# ...

# Build
npm run build

# Test
node dist/index.js
```

**Code standards**:
- TypeScript for all code
- Clear function names
- Comments for complex logic
- Error handling for all API calls

---

## Security Issues

Found a security vulnerability?

**Do NOT**:
- Post publicly
- Share details in regular support channels

**Do**:
- Email kostyantyn@keplercommerce.com with subject: [SECURITY]
- Include detailed description
- Allow time for fix before disclosure

---

## Community

### Discussion Topics

Share:
- Interesting workflows
- JQL query patterns
- Automation scripts
- Tips and tricks

### Best Practices

Learn from others:
- Sprint management strategies
- Issue organization
- Board configurations
- Team workflows

---

## Useful Snippets

### Test Connection Script

Save as `test-connection.js`:
```javascript
const https = require('https');
require('dotenv').config();

const options = {
  hostname: process.env.JIRA_HOST,
  path: '/rest/api/3/myself',
  method: 'GET',
  auth: `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
};

https.get(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    console.log(JSON.parse(d));
  });
}).on('error', (e) => {
  console.error(e);
});
```

Run with: `node test-connection.js`

### Debug Logger

Add to your code:
```javascript
function debug(message, data = null) {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

debug("Starting sprint query", { boardId: 268 });
```

---

## Version Information

**Current Version**: 1.0.0
**Last Updated**: October 2025
**Node Version**: 18+
**MCP SDK**: Latest

**Your Setup**:
- **Jira Instance**: keplercommerce.atlassian.net
- **Project**: PROD (PORTAL/SAAS)
- **Boards**: 8 boards (IDs: 268, 265, 167, 166, 232, 267, 266, 298)

---

## Response Times

**Email Support**:
- Initial response: 1-2 business days
- Follow-up: 2-3 business days
- Complex issues: May take longer

**Emergency Issues**:
For production-critical issues, mark email with [URGENT] in subject.

---

## Feedback

We value your feedback!

**What we want to know**:
- Is documentation clear?
- Are tools working as expected?
- What features would help you?
- What's confusing or difficult?

**Send feedback to**: kostyantyn@keplercommerce.com

---

## Support Hours

**Email Support**: 24/7 (responses during business hours)
**Business Hours**: Monday-Friday, 9 AM - 6 PM (your timezone may vary)

---

## Thank You

Thank you for using the Jira MCP Server! We're here to help make your Jira workflow more efficient.

**Quick Resources**:
- 📧 Email: kostyantyn@keplercommerce.com
- 📚 Docs: [Documentation Index](DOCUMENTATION_INDEX.md)
- 🔧 Fixes: [Troubleshooting](TROUBLESHOOTING.md)
- 🚀 Examples: [Usage Guide](USAGE_GUIDE.md)

---

**Need immediate help?** Start with [Troubleshooting Guide](TROUBLESHOOTING.md)
