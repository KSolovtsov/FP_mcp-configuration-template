# Contributing to Slack MCP Server

First off, thank you for considering contributing to Slack MCP Server! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [Go Style Guide](#go-style-guide)
  - [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Great Bug Reports** include:

- A clear and descriptive title
- Steps to reproduce the problem
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Go version, Slack workspace type)
- Relevant logs from `~/Library/Logs/Claude/mcp*.log`

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- Detailed description of the proposed functionality
- Why this enhancement would be useful
- Possible implementation approach

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Update documentation as needed
5. Issue that pull request!

**Pull Request Process:**

1. Update the README.md or docs/ with details of changes if applicable
2. Update the CHANGELOG.md with notes on your changes
3. The PR will be merged once you have the sign-off of maintainers

## Development Setup

### Prerequisites

- Go 1.21 or higher
- Node.js 18+ (for npm packages)
- Slack workspace for testing
- Claude Code or MCP Inspector for testing

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/slack-mcp-server.git
cd slack-mcp-server

# Install dependencies
go mod download

# Copy environment template
cp .env.dist .env

# Edit .env with your Slack tokens
# See docs/01-authentication-setup.md for how to get tokens

# Build the project
make build

# Run tests
make test
```

### Running Locally

```bash
# Run with stdio transport
go run cmd/slack-mcp-server/main.go --transport stdio

# Run with SSE transport
go run cmd/slack-mcp-server/main.go --transport sse

# Run with MCP Inspector
npx @modelcontextprotocol/inspector go run cmd/slack-mcp-server/main.go --transport stdio
```

### Project Structure

```
slack-mcp-server/
├── cmd/                    # Application entry points
│   └── slack-mcp-server/  # Main server binary
├── pkg/                    # Reusable packages
├── internal/               # Private application code
├── docs/                   # Documentation
├── npm/                    # NPM package files
├── build/                  # Build artifacts
├── Makefile               # Build automation
└── go.mod                 # Go dependencies
```

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

**Examples:**

```
Add support for Enterprise Grid organizations

- Implement admin API methods
- Add Enterprise workspace detection
- Update documentation

Fixes #123
```

### Go Style Guide

Follow the [Effective Go](https://golang.org/doc/effective_go.html) guidelines and use `gofmt`:

```bash
# Format all Go files
gofmt -s -w .

# Run linter
golangci-lint run
```

**Key Points:**

- Use meaningful variable and function names
- Add comments for exported functions
- Keep functions small and focused
- Handle errors explicitly
- Use context for cancellation

### Documentation

- Update docs/ for user-facing changes
- Add inline code comments for complex logic
- Update API reference for new MCP tools
- Include examples for new features

**Documentation Structure:**

- `docs/README.md` - Documentation index
- `docs/01-authentication-setup.md` - Auth setup
- `docs/02-installation.md` - Installation guide
- `docs/03-configuration-and-usage.md` - Configuration
- `docs/Slack_API_Complete_Reference.md` - Complete API reference
- `docs/Slack_Admin_API_Complete_Guide.md` - Admin guide

## Testing

### Unit Tests

```bash
# Run all tests
make test

# Run tests with coverage
go test -cover ./...

# Run specific test
go test -run TestFunctionName ./pkg/...
```

### Integration Tests

```bash
# Run integration tests (requires real Slack workspace)
INTEGRATION_TEST=true go test ./...
```

### Manual Testing

Use MCP Inspector for manual testing:

```bash
npx @modelcontextprotocol/inspector go run cmd/slack-mcp-server/main.go --transport stdio
```

## Building and Releasing

### Build for All Platforms

```bash
# Build for current platform
make build

# Build for all platforms
make build-all

# Build Docker image
make docker-build
```

### Creating a Release

Releases are automated via GitHub Actions. To create a release:

1. Update version in relevant files
2. Update CHANGELOG.md
3. Create and push a git tag: `git tag v1.x.x && git push origin v1.x.x`
4. GitHub Actions will build and publish automatically

## Questions?

Feel free to:

- Open an issue for questions
- Join discussions in issues
- Reach out to maintainers

## Recognition

Contributors will be recognized in:

- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

Thank you for contributing! 🎉
