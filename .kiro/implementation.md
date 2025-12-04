# The Haunted Nexus - Implementation Details

## Architecture Overview

### Frontend Architecture
```
React 18 + Vite
├── Pages (Feature Components)
├── Components (Reusable UI)
├── Services (API & Audio)
├── Utils (Helpers)
└── Styles (CSS Modules)
```

### Backend Architecture
```
Flask 3 + Python
├── Routes (API Endpoints)
├── Services (Business Logic)
└── Utils (Prompts & Cache)
```

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **Maps**: Leaflet 1.9.4 + React Leaflet 4.2.1
- **Styling**: CSS Modules
- **Voice**: Web Speech API

### Backend
- **Framework**: Flask 3.x
- **CORS**: Flask-CORS
- **AI**: OpenAI API
- **External APIs**: 
  - Wayback Machine (Internet Archive)
  - Google Maps API
  - Weather API

## Key Features Implementation

### 1. Ghost Chat
**Location**: `frontend/src/pages/GhostChat.jsx`
- Real-time AI conversation
- Multiple ghost personalities
- Voice synthesis integration
- Typing indicators
- Message history

**Backend**: `backend/routes/ghost_chat.py`
- OpenAI GPT integration
- Personality prompt templates
- Response streaming

### 2. Haunted Journal
**Location**: `frontend/src/pages/HauntedJournal.jsx`
- Mood tracking
- Emotional analysis
- Poetic responses
- Entry history
- Export functionality

**Backend**: `backend/routes/haunted_journal.py`
- Sentiment analysis
- Poetry generation
- Entry storage

### 3. Reanimator
**Location**: `frontend/src/pages/Reanimator.jsx`
- URL input validation
- Archive fetching
- Content display
- Screenshot capture

**Backend**: `backend/routes/reanimator.py`
- Wayback Machine API integration
- Content parsing
- Error handling

### 4. Frankenstein Stitcher
**Location**: `frontend/src/pages/FrankensteinStitcher.jsx`
- Dual API input
- Mashup generation
- Result visualization
- Export options

**Backend**: `backend/routes/frankenstein_stitcher.py`
- API combination logic
- Data transformation
- Response formatting

### 5. Haunted Map
**Location**: `frontend/src/pages/HauntedMap.jsx`
- Interactive Leaflet map
- Location markers
- Ghost story generation
- Location search

**Backend**: `backend/routes/haunted_map.py`
- Location database
- Story generation
- Geocoding

### 6. Cursed Atelier
**Location**: `frontend/src/pages/CursedAtelier.jsx`
- Image upload
- Filter application
- Color extraction
- Download functionality

**Backend**: `backend/routes/cursed_image.py`
- Image processing
- Filter algorithms
- Base64 encoding

## Audio System

### Ambient Audio
**Location**: `frontend/src/services/ambientAudio.js`
- Background music management
- Volume control
- Fade in/out effects
- Loop handling

### Voice Synthesis
**Location**: `frontend/src/services/ghostVoice.js`
- Web Speech API integration
- Voice selection
- Pitch/rate control
- Emotional variations

### Audio Effects
**Location**: `frontend/src/services/audioEffects.js`
- Footsteps
- Thunder
- Whispers
- Typing sounds

## Visual Effects

### Implemented Effects
1. **Fog Overlay** - Atmospheric fog layer
2. **Shadow Figures** - Moving shadows
3. **Temperature Drop** - Screen frost effect
4. **Blood Smear** - Dripping blood animation
5. **Glitch Transition** - Page transition effects
6. **Falling Skeletons** - Animated decorations
7. **Cursor Trail** - Ghost trail following cursor

### Effect System
**Location**: `frontend/src/services/visualEffects.js`
- Effect triggering
- Intensity control
- Random timing
- Performance optimization

## State Management

### Approach
- React Hooks (useState, useEffect, useContext)
- Local component state
- No external state library needed

### Key State
- User preferences (volume, intensity)
- Session data (chat history, journal entries)
- UI state (modals, loading, errors)

## API Integration

### Frontend API Service
**Location**: `frontend/src/services/api.js`
- Centralized API calls
- Error handling
- Request/response formatting
- Base URL configuration

### Backend Routes
All routes follow RESTful conventions:
- `POST /api/ghost-chat` - Chat messages
- `POST /api/haunted-journal` - Journal entries
- `POST /api/reanimator` - Website resurrection
- `POST /api/frankenstein-stitch` - API mashup
- `GET /api/haunted-locations` - Location data
- `POST /api/ghost-story` - Story generation
- `POST /api/cursed-image` - Image processing

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization
- CSS module scoping
- Memoization where needed

### Backend
- Response caching
- Request validation
- Error handling
- Rate limiting (recommended for production)

## Security Considerations

### Implemented
- CORS configuration
- Environment variable protection
- Input validation
- XSS prevention (React default)
- Content Security Policy headers

### Recommended for Production
- API rate limiting
- Authentication/Authorization
- HTTPS enforcement
- API key rotation
- Request logging

## Build Configuration

### Vite Config
**Location**: `frontend/vite.config.js`
- React plugin
- Dev server proxy
- Public directory
- Build optimization

### Netlify Config
**Location**: `netlify.toml`
- Build command
- Publish directory
- Redirects for SPA
- Security headers
- Asset caching

## Environment Variables

### Frontend
```
VITE_API_URL - Backend API URL
```

### Backend
```
OPENAI_API_KEY - OpenAI API key
GOOGLE_MAPS_API_KEY - Google Maps key
FLASK_ENV - Environment (development/production)
SECRET_KEY - Flask secret key
```

## Testing Strategy

### Current Status
- Manual testing completed
- All features verified
- Cross-browser tested

### Recommended Additions
- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright/Cypress)
- Performance testing
- Accessibility testing

## Deployment Architecture

### Frontend (Netlify)
```
GitHub → Netlify Build → CDN Distribution
```

### Backend (Separate Hosting)
```
GitHub → Render/Railway/Heroku → API Server
```

## Monitoring & Logging

### Recommended Tools
- Frontend: Sentry for error tracking
- Backend: Application logs
- Analytics: Google Analytics or Plausible
- Performance: Lighthouse CI

## Documentation

### Available Docs
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `QUICK_START.md` - Quick deployment
- `DEPLOYMENT_SUMMARY.md` - Configuration summary
- `.kiro/specs/` - Feature specifications

## Code Quality

### Standards
- ESLint for JavaScript
- Prettier for formatting
- CSS Modules for styling
- PEP 8 for Python

### Best Practices
- Component composition
- DRY principles
- Semantic HTML
- Accessible UI
- Responsive design

## Future Improvements

### Technical
- Add TypeScript
- Implement GraphQL
- Add WebSocket for real-time features
- Progressive Web App (PWA)
- Service Worker for offline support

### Features
- User authentication
- Database integration
- Real-time collaboration
- Mobile app version
- API versioning
