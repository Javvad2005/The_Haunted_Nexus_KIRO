# The Haunted Nexus - Steering Rules

## Overview

This document contains steering rules and guidelines for AI assistance when working on The Haunted Nexus project. These rules help maintain consistency, quality, and project standards.

## Project Context

### Project Type
Halloween-themed web application with AI-powered features

### Tech Stack
- Frontend: React 18 + Vite
- Backend: Flask 3 + Python
- Deployment: Netlify (frontend) + separate backend hosting

### Key Principles
1. Spooky but accessible
2. Performance-first
3. User experience focused
4. Well-documented
5. Deployment-ready

## Code Style Guidelines

### JavaScript/React

#### Component Structure
```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import styles from './Component.module.css';

// 2. Component definition
const Component = ({ prop1, prop2 }) => {
  // 3. State declarations
  const [state, setState] = useState(initialValue);
  
  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // 5. Event handlers
  const handleEvent = () => {
    // handler logic
  };
  
  // 6. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

#### Naming Conventions
- Components: PascalCase (`GhostChat.jsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- CSS Modules: camelCase (`styles.container`)
- Files: PascalCase for components, camelCase for utilities

#### Best Practices
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use CSS Modules for styling
- Avoid inline styles except for dynamic values
- Always provide prop types or TypeScript types
- Handle loading and error states
- Implement proper cleanup in useEffect

### Python/Flask

#### File Structure
```python
# 1. Standard library imports
import os
from datetime import datetime

# 2. Third-party imports
from flask import Blueprint, request, jsonify

# 3. Local imports
from services.ai_service import generate_response
from utils.cache import cache_response

# 4. Blueprint/app setup
bp = Blueprint('feature', __name__)

# 5. Route definitions
@bp.route('/api/endpoint', methods=['POST'])
def endpoint():
    # Route logic
    pass
```

#### Naming Conventions
- Files: snake_case (`ghost_chat.py`)
- Functions: snake_case (`generate_response`)
- Classes: PascalCase (`AIService`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`)

#### Best Practices
- Follow PEP 8 style guide
- Use type hints where appropriate
- Handle exceptions properly
- Validate input data
- Return consistent response formats
- Use blueprints for route organization
- Implement proper error handling
- Add docstrings to functions

### CSS

#### Organization
```css
/* 1. Layout */
.container { }

/* 2. Typography */
.title { }

/* 3. Colors */
.primary { }

/* 4. States */
.active { }
.hover { }

/* 5. Responsive */
@media (max-width: 768px) { }
```

#### Best Practices
- Use CSS Modules
- Follow BEM-like naming in modules
- Use CSS variables for theme values
- Mobile-first responsive design
- Avoid !important
- Use semantic class names
- Group related properties
- Comment complex styles

## Feature Development

### Adding New Features

1. **Plan First**
   - Define requirements
   - Design UI/UX
   - Plan API endpoints
   - Consider edge cases

2. **Frontend Development**
   - Create page component
   - Add to routing
   - Implement UI
   - Add error handling
   - Test responsiveness

3. **Backend Development**
   - Create route blueprint
   - Implement business logic
   - Add validation
   - Handle errors
   - Test endpoints

4. **Integration**
   - Connect frontend to backend
   - Test full flow
   - Handle loading states
   - Add error messages

5. **Polish**
   - Add animations
   - Optimize performance
   - Update documentation
   - Test accessibility

### Modifying Existing Features

1. **Understand Current Implementation**
   - Read existing code
   - Check related files
   - Review documentation

2. **Make Changes**
   - Follow existing patterns
   - Maintain consistency
   - Update related code

3. **Test Thoroughly**
   - Test changed functionality
   - Test related features
   - Check for regressions

4. **Update Documentation**
   - Update comments
   - Update README if needed
   - Update API docs

## API Design

### Endpoint Structure
```
POST /api/feature-name
```

### Request Format
```json
{
  "data": "value",
  "options": {}
}
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Testing Guidelines

### What to Test
- Core functionality
- Edge cases
- Error handling
- User interactions
- API endpoints
- Responsive design

### Testing Approach
- Write tests for new features
- Update tests for changes
- Run tests before committing
- Fix failing tests immediately

## Performance Guidelines

### Frontend
- Lazy load routes
- Optimize images
- Minimize bundle size
- Use code splitting
- Debounce/throttle events
- Memoize expensive calculations

### Backend
- Cache responses
- Validate early
- Use efficient queries
- Limit response size
- Implement rate limiting

## Accessibility Guidelines

### Requirements
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Alt text for images
- Color contrast compliance
- Screen reader support

### Testing
- Test with keyboard only
- Test with screen reader
- Check color contrast
- Verify focus order

## Documentation Standards

### Code Comments
```javascript
// Brief description of what the code does
// Why it's done this way (if not obvious)
// Any gotchas or important notes
```

### Function Documentation
```javascript
/**
 * Brief description of function
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
```

### README Updates
- Update when adding features
- Document new dependencies
- Update setup instructions
- Add troubleshooting tips

## Git Workflow

### Commit Messages
```
type: Brief description

Longer description if needed
- Bullet points for details
- Reference issues: #123
```

Types: feat, fix, docs, style, refactor, test, chore

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/name` - New features
- `fix/name` - Bug fixes

## Deployment Checklist

### Before Deploying
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Environment variables set
- [ ] Documentation updated
- [ ] Changes committed

### After Deploying
- [ ] Test live site
- [ ] Check all features
- [ ] Verify API connections
- [ ] Monitor for errors
- [ ] Update changelog

## Common Patterns

### API Calls
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.post('/endpoint', data);
    setData(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Form Handling
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  await submitData();
};
```

### Error Boundaries
```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <Component />
</ErrorBoundary>
```

## Troubleshooting

### Common Issues

#### Build Fails
1. Check for syntax errors
2. Verify imports
3. Check dependencies
4. Clear cache and rebuild

#### API Not Working
1. Check backend is running
2. Verify API URL
3. Check CORS settings
4. Review request/response

#### Styling Issues
1. Check CSS Module imports
2. Verify class names
3. Check specificity
4. Review responsive breakpoints

## Resources

### Documentation
- React: https://react.dev
- Vite: https://vitejs.dev
- Flask: https://flask.palletsprojects.com
- Leaflet: https://leafletjs.com

### Tools
- ESLint for linting
- Prettier for formatting
- Chrome DevTools for debugging
- React DevTools for component inspection

## Project-Specific Notes

### API Configuration
- Frontend API URL should NOT include `/api` suffix (routes already include it)
- Development: `VITE_API_URL=http://localhost:5000`
- Production: Set in Netlify environment variables
- Backend routes use `/api/` prefix (e.g., `/api/ghost-chat`)

### Ghost Chat System
- 7 distinct ghost personas with unique personalities
- Each persona has custom voice settings (pitch, rate, volume, reverb)
- Persona selection persists during chat session
- System messages indicate persona changes
- Voice synthesis uses persona-specific settings

### Audio System
- Always check audio file existence
- Handle browser autoplay policies
- Provide volume controls
- Test across browsers

### Visual Effects
- Respect user preferences
- Provide intensity controls
- Optimize for performance
- Test on different devices

### AI Integration
- Handle API failures gracefully
- Show loading states
- Implement retry logic
- Cache responses when appropriate
- Support persona-based responses in Ghost Chat

### Map Features
- Handle location permissions
- Provide fallback for no location
- Optimize marker rendering
- Test on mobile devices

## Updates and Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and fix security issues
- Optimize performance
- Update documentation
- Clean up unused code

### Monitoring
- Check error logs
- Monitor performance
- Track user feedback
- Review analytics

## Questions?

When in doubt:
1. Check existing code for patterns
2. Review documentation
3. Test thoroughly
4. Ask for clarification
5. Document your decisions
