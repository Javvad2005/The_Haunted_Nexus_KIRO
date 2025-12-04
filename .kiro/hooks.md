# The Haunted Nexus - Hooks & Automation

## Overview

This document describes potential hooks and automation workflows for The Haunted Nexus project using Kiro IDE's hook system.

## Available Hook Types

### 1. On Message Send
Triggers when a message is sent to the agent.

### 2. On Agent Complete
Triggers when an agent execution completes.

### 3. On Session Create
Triggers on first message send in a new session.

### 4. On File Save
Triggers when a code file is saved.

## Recommended Hooks

### Hook 1: Auto-Test on Save
**Trigger**: On File Save (*.jsx, *.js, *.py)
**Action**: Run relevant tests

```yaml
name: "Auto-Test on Save"
trigger: file_save
pattern: "**/*.{jsx,js,py}"
action: shell_command
command: |
  if [[ $FILE == *.jsx ]] || [[ $FILE == *.js ]]; then
    cd frontend && npm test -- --related $FILE
  elif [[ $FILE == *.py ]]; then
    cd backend && pytest tests/
  fi
```

### Hook 2: Build Check on Frontend Changes
**Trigger**: On File Save (frontend/src/**)
**Action**: Verify build still works

```yaml
name: "Build Check"
trigger: file_save
pattern: "frontend/src/**/*"
action: shell_command
command: |
  cd frontend && npm run build
```

### Hook 3: Lint on Save
**Trigger**: On File Save (*.jsx, *.js)
**Action**: Run ESLint

```yaml
name: "Lint on Save"
trigger: file_save
pattern: "**/*.{jsx,js}"
action: shell_command
command: |
  cd frontend && npx eslint $FILE --fix
```

### Hook 4: Format on Save
**Trigger**: On File Save (*.jsx, *.js, *.py)
**Action**: Auto-format code

```yaml
name: "Format on Save"
trigger: file_save
pattern: "**/*.{jsx,js,py}"
action: shell_command
command: |
  if [[ $FILE == *.jsx ]] || [[ $FILE == *.js ]]; then
    cd frontend && npx prettier --write $FILE
  elif [[ $FILE == *.py ]]; then
    cd backend && black $FILE
  fi
```

### Hook 5: Deployment Reminder
**Trigger**: On Agent Complete
**Action**: Remind about deployment steps

```yaml
name: "Deployment Reminder"
trigger: agent_complete
action: send_message
message: |
  Remember to:
  1. Test changes locally
  2. Commit to Git
  3. Push to GitHub
  4. Verify Netlify auto-deploy
```

### Hook 6: Documentation Update
**Trigger**: On File Save (src/**/*)
**Action**: Remind to update docs

```yaml
name: "Documentation Reminder"
trigger: file_save
pattern: "src/**/*"
action: send_message
message: |
  Don't forget to update documentation if you:
  - Added new features
  - Changed API endpoints
  - Modified component props
```

### Hook 7: Environment Check
**Trigger**: On Session Create
**Action**: Verify environment setup

```yaml
name: "Environment Check"
trigger: session_create
action: shell_command
command: |
  echo "Checking environment..."
  if [ ! -f "frontend/.env.development" ]; then
    echo "⚠️ Missing frontend/.env.development"
  fi
  if [ ! -f "backend/.env" ]; then
    echo "⚠️ Missing backend/.env"
  fi
  echo "✅ Environment check complete"
```

### Hook 8: Dependency Update Check
**Trigger**: On Session Create
**Action**: Check for outdated dependencies

```yaml
name: "Dependency Check"
trigger: session_create
action: shell_command
command: |
  cd frontend && npm outdated
  cd ../backend && pip list --outdated
```

### Hook 9: Git Status on Session Start
**Trigger**: On Session Create
**Action**: Show git status

```yaml
name: "Git Status"
trigger: session_create
action: shell_command
command: |
  git status --short
  echo ""
  echo "Current branch: $(git branch --show-current)"
```

### Hook 10: Pre-Commit Validation
**Trigger**: Manual (button click)
**Action**: Run all checks before commit

```yaml
name: "Pre-Commit Validation"
trigger: manual
action: shell_command
command: |
  echo "Running pre-commit checks..."
  cd frontend
  npm run build
  npm test
  cd ../backend
  pytest
  echo "✅ All checks passed!"
```

## Custom Hooks for Features

### Ghost Chat Hook
**Trigger**: On File Save (GhostChat.jsx)
**Action**: Test ghost personality responses

```yaml
name: "Test Ghost Personalities"
trigger: file_save
pattern: "**/GhostChat.jsx"
action: send_message
message: "Test all ghost personalities after changes"
```

### Audio System Hook
**Trigger**: On File Save (audio services)
**Action**: Verify audio files exist

```yaml
name: "Audio File Check"
trigger: file_save
pattern: "**/services/audio*.js"
action: shell_command
command: |
  if [ ! -d "frontend/public/audio" ]; then
    echo "⚠️ Audio directory missing!"
  fi
```

### API Route Hook
**Trigger**: On File Save (backend routes)
**Action**: Update API documentation

```yaml
name: "API Doc Update"
trigger: file_save
pattern: "backend/routes/*.py"
action: send_message
message: "Update API documentation in DEPLOYMENT.md"
```

## Workflow Automation

### Development Workflow
1. **Start Session** → Environment check
2. **Edit File** → Auto-format on save
3. **Save File** → Run tests
4. **Complete Feature** → Deployment reminder

### Deployment Workflow
1. **Manual Hook** → Pre-commit validation
2. **Git Commit** → Push to GitHub
3. **GitHub Push** → Netlify auto-deploy
4. **Deploy Complete** → Test live site

### Testing Workflow
1. **Save Test File** → Run tests
2. **Tests Pass** → Update coverage
3. **Tests Fail** → Show error details
4. **Fix & Save** → Re-run tests

## Hook Configuration

### Setup Instructions
1. Open Kiro IDE
2. Go to Command Palette
3. Search "Open Kiro Hook UI"
4. Create new hooks using the UI
5. Configure triggers and actions

### Hook File Location
Hooks are stored in: `.kiro/hooks/`

### Hook Syntax
```json
{
  "name": "Hook Name",
  "trigger": "file_save|agent_complete|session_create|manual",
  "pattern": "glob pattern (for file_save)",
  "action": "shell_command|send_message",
  "command": "shell command to run",
  "message": "message to send to agent"
}
```

## Best Practices

### Do's
- ✅ Keep hooks fast (< 5 seconds)
- ✅ Use specific file patterns
- ✅ Provide clear feedback
- ✅ Handle errors gracefully
- ✅ Test hooks before enabling

### Don'ts
- ❌ Don't run long-running processes
- ❌ Don't modify files without confirmation
- ❌ Don't spam messages
- ❌ Don't break the development flow
- ❌ Don't ignore hook errors

## Troubleshooting

### Hook Not Triggering
- Check file pattern matches
- Verify trigger type is correct
- Check hook is enabled
- Review Kiro logs

### Hook Fails
- Check command syntax
- Verify paths are correct
- Check permissions
- Review error messages

### Hook Too Slow
- Optimize command
- Reduce scope
- Use async execution
- Consider manual trigger

## Future Hook Ideas

### Advanced Automation
- Auto-generate component tests
- Update changelog on commit
- Sync design tokens
- Generate API documentation
- Create component screenshots
- Update dependency graphs
- Monitor bundle size
- Track performance metrics

### AI-Powered Hooks
- Suggest code improvements
- Generate commit messages
- Review code changes
- Suggest refactoring
- Find potential bugs
- Optimize performance

### Integration Hooks
- Slack notifications
- GitHub issue creation
- Jira ticket updates
- Discord webhooks
- Email notifications
- Analytics tracking

## Resources

- [Kiro Hook Documentation](https://docs.kiro.ai/hooks)
- [Hook Examples](https://github.com/kiro-ai/examples)
- [Community Hooks](https://community.kiro.ai/hooks)
