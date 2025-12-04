# .kiro Directory - Project Documentation

## Overview

This directory contains comprehensive documentation for The Haunted Nexus project, including specifications, design documents, implementation details, and development guidelines.

## Directory Structure

```
.kiro/
├── README.md              # This file
├── tasks.md               # Project tasks and milestones
├── implementation.md      # Technical implementation details
├── design.md              # Design system and guidelines
├── hooks.md               # Automation hooks and workflows
├── steering.md            # Development guidelines and standards
└── specs/                 # Feature specifications
    ├── haunted-nexus/     # Main feature specs
    │   ├── requirements.md
    │   ├── design.md
    │   └── tasks.md
    └── ui-audio-visual-upgrade/
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## Document Descriptions

### Core Documentation

#### `tasks.md`
**Purpose**: Track all project tasks, milestones, and future enhancements

**Contents**:
- Completed tasks (Phases 1-3)
- Current project status
- Pending deployment tasks
- Optional enhancements
- Future feature ideas
- Technical debt tracking

**When to Update**: After completing major features or milestones

---

#### `implementation.md`
**Purpose**: Technical implementation details and architecture

**Contents**:
- Architecture overview
- Technology stack details
- Feature implementations
- Audio and visual systems
- State management approach
- API integration patterns
- Performance optimizations
- Security considerations
- Build configuration
- Testing strategy

**When to Update**: When adding new features or changing architecture

---

#### `design.md`
**Purpose**: Design system, visual guidelines, and UI/UX standards

**Contents**:
- Design philosophy
- Color palette
- Typography system
- Component designs
- Layout structures
- Animation guidelines
- Responsive design rules
- Accessibility standards
- Audio design
- Interaction patterns
- Brand identity

**When to Update**: When changing visual design or adding new components

---

#### `hooks.md`
**Purpose**: Automation hooks and development workflows

**Contents**:
- Available hook types
- Recommended hooks (10+ examples)
- Custom feature hooks
- Workflow automation
- Hook configuration
- Best practices
- Troubleshooting
- Future hook ideas

**When to Update**: When adding new automation or workflows

---

#### `steering.md`
**Purpose**: Development guidelines and coding standards

**Contents**:
- Code style guidelines (JS, Python, CSS)
- Feature development process
- API design patterns
- Testing guidelines
- Performance standards
- Accessibility requirements
- Documentation standards
- Git workflow
- Deployment checklist
- Common patterns
- Troubleshooting guide

**When to Update**: When establishing new standards or best practices

---

### Specs Directory

#### `specs/haunted-nexus/`
Original feature specifications for the six main features:
- Ghost Chat
- Haunted Journal
- Reanimator
- Frankenstein Stitcher
- Haunted Map
- Cursed Atelier

#### `specs/ui-audio-visual-upgrade/`
Specifications for UI/UX enhancements:
- Audio system
- Visual effects
- Animations
- Controls

---

## How to Use This Documentation

### For New Developers

1. **Start Here**: Read this README
2. **Understand the Project**: Read `tasks.md` for overview
3. **Learn the Tech**: Read `implementation.md`
4. **Follow Standards**: Read `steering.md`
5. **Explore Features**: Check `specs/` directory

### For Feature Development

1. **Plan**: Create spec in `specs/` if needed
2. **Design**: Reference `design.md` for guidelines
3. **Implement**: Follow patterns in `implementation.md`
4. **Code**: Follow standards in `steering.md`
5. **Automate**: Set up hooks from `hooks.md`
6. **Track**: Update `tasks.md`

### For Maintenance

1. **Check Tasks**: Review `tasks.md` for pending items
2. **Review Code**: Use `steering.md` as checklist
3. **Update Docs**: Keep all docs current
4. **Monitor**: Use hooks for automation

### For Deployment

1. **Checklist**: Use deployment checklist in `steering.md`
2. **Verify**: Check `implementation.md` for requirements
3. **Test**: Follow testing guidelines
4. **Deploy**: See root `DEPLOYMENT.md`

---

## Documentation Standards

### Markdown Format
- Use clear headings
- Include code examples
- Add tables for comparisons
- Use lists for steps
- Include diagrams when helpful

### Keep Updated
- Update after major changes
- Review quarterly
- Version control all changes
- Document decisions

### Be Specific
- Provide examples
- Explain "why" not just "what"
- Include edge cases
- Add troubleshooting tips

---

## Quick Reference

### File Purposes

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `tasks.md` | Task tracking | After milestones |
| `implementation.md` | Technical details | On architecture changes |
| `design.md` | Design system | On design changes |
| `hooks.md` | Automation | When adding workflows |
| `steering.md` | Dev guidelines | When setting standards |
| `specs/*` | Feature specs | Per feature |

### Common Tasks

**Adding a New Feature**:
1. Create spec in `specs/new-feature/`
2. Update `tasks.md` with new tasks
3. Follow `steering.md` guidelines
4. Update `implementation.md` when complete
5. Update `design.md` if UI changes

**Changing Design**:
1. Update `design.md` with new guidelines
2. Update affected components
3. Test across devices
4. Update screenshots/examples

**Setting Up Automation**:
1. Review `hooks.md` for examples
2. Create hook in Kiro IDE
3. Test hook functionality
4. Document in `hooks.md`

---

## Related Documentation

### Root Level
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `QUICK_START.md` - Quick deployment
- `DEPLOYMENT_SUMMARY.md` - Config summary

### Frontend
- `frontend/package.json` - Dependencies
- `frontend/vite.config.js` - Build config
- `frontend/.env.production` - Prod env vars

### Backend
- `backend/requirements.txt` - Python deps
- `backend/app.py` - Main application
- `backend/.env.example` - Env template

---

## Contributing

When contributing to documentation:

1. **Be Clear**: Write for someone new to the project
2. **Be Specific**: Include examples and code snippets
3. **Be Consistent**: Follow existing format and style
4. **Be Current**: Update related docs when making changes
5. **Be Helpful**: Add troubleshooting and tips

---

## Maintenance

### Regular Reviews
- Monthly: Check for outdated information
- Quarterly: Major documentation review
- After releases: Update all relevant docs
- When onboarding: Get feedback on clarity

### Version Control
- Commit doc changes with code changes
- Use descriptive commit messages
- Review doc changes in PRs
- Keep docs in sync with code

---

## Questions?

If you can't find what you're looking for:

1. Check the specific document's table of contents
2. Search across all `.md` files
3. Review related specs in `specs/`
4. Check root-level documentation
5. Ask the team or create an issue

---

## Document History

- **Created**: November 2024
- **Last Updated**: November 2024
- **Version**: 1.0
- **Status**: Complete and deployment-ready

---

**The Haunted Nexus** 🎃👻
*Where AI meets the supernatural... Enter if you dare.*
