# Design Document

## Overview

The Haunted Nexus is a full-stack Halloween-themed web application built with React (frontend) and Flask (backend). The architecture emphasizes reusability through global components (Glitch Transition, Ghost Voice Engine) and maintains a consistent spooky aesthetic across five interactive features. The design prioritizes credit efficiency by avoiding databases, authentication, and heavy resource consumption.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │   Features   │  │    Global    │     │
│  │              │  │  (5 Routes)  │  │  Components  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                     React Router                            │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────┼────────────────────────────────┐
│                     Flask Backend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  API Routes  │  │  AI Service  │  │   External   │     │
│  │  (5 features)│  │   Handler    │  │  API Client  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ with functional components and hooks
- React Router v6 for client-side routing
- CSS Modules for scoped styling
- Web Speech API for ghost voice synthesis

**Backend:**
- Flask 3.x with RESTful API design
- Flask-CORS for cross-origin requests
- Requests library for external API calls
- OpenAI API (or similar) for AI text generation

### Directory Structure

```
haunted-nexus/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       └── sounds/          # Optional ambient sounds
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.module.css
│   │   ├── index.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── GhostChat.jsx
│   │   │   ├── HauntedJournal.jsx
│   │   │   ├── Reanimator.jsx
│   │   │   ├── FrankensteinStitcher.jsx
│   │   │   └── HauntedMap.jsx
│   │   ├── components/
│   │   │   ├── GlitchTransition.jsx
│   │   │   ├── GhostVoiceButton.jsx
│   │   │   ├── SpookyButton.jsx
│   │   │   ├── FogOverlay.jsx
│   │   │   └── Navigation.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── ghostVoice.js
│   │   └── styles/
│   │       ├── theme.css
│   │       └── animations.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── routes/
│   │   ├── ghost_chat.py
│   │   ├── haunted_journal.py
│   │   ├── reanimator.py
│   │   ├── frankenstein_stitcher.py
│   │   └── haunted_map.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── wayback_service.py
│   │   └── external_apis.py
│   ├── utils/
│   │   └── prompts.py
│   ├── requirements.txt
│   └── config.py
└── .kiro/
    └── specs/
        └── haunted-nexus/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## Components and Interfaces

### Frontend Components

#### 1. Global Components

**GlitchTransition Component**
```javascript
// Props interface
{
  isActive: boolean,
  duration: number,        // milliseconds (500-2000)
  intensity: 'low' | 'medium' | 'high',
  onComplete: () => void
}
```
- Renders a full-screen overlay with CSS-based glitch effects
- Uses CSS animations with transform, opacity, and filter properties
- Triggers callback when animation completes

**GhostVoiceButton Component**
```javascript
// Props interface
{
  text: string,
  preset: 'eerie' | 'emotional' | 'storyteller' | 'playful',
  disabled: boolean
}
```
- Renders a themed button with ghost icon
- Calls ghostVoice service with text and preset
- Shows loading state during speech synthesis

**FogOverlay Component**
```javascript
// Props interface
{
  intensity: 'light' | 'medium' | 'heavy'
}
```
- Renders animated fog using CSS gradients and keyframes
- Positioned absolutely to overlay page content
- Pointer-events: none to allow interaction with underlying elements

**SpookyButton Component**
```javascript
// Props interface
{
  children: ReactNode,
  onClick: () => void,
  variant: 'primary' | 'secondary',
  disabled: boolean
}
```
- Themed button with hover effects and neon glow
- Consistent styling across all features

**Navigation Component**
```javascript
// Props interface
{
  currentPath: string
}
```
- Displays links to all five features and landing page
- Highlights current active route
- Sticky or fixed positioning for easy access

#### 2. Page Components

**LandingPage**
- Hero section with project title and spooky tagline
- Grid or list of five feature cards with descriptions
- Each card links to respective feature route
- Animated fog and glitch effects on load

**GhostChat**
- Chat message list (user messages and ghost responses)
- Text input with submit button
- Ghost voice playback button for each response
- Auto-scroll to latest message

**HauntedJournal**
- Large textarea for journal entry
- Submit button to analyze emotions
- Response display area with poetic formatting
- Ghost voice playback button for response

**Reanimator**
- URL input field with submit button
- Split-screen layout: left (original), right (revived)
- Loading state with glitch animation
- Error handling for invalid URLs or missing archives

**FrankensteinStitcher**
- Two dropdown selects for API selection
- Stitch button to trigger combination
- Result display area with spooky formatting
- Glitch effect on result reveal
- Ghost voice playback button

**HauntedMap**
- Map container using Leaflet or similar library
- Dark tile layer (CartoDB Dark Matter or custom)
- Fog overlay component
- Custom marker icons for haunted locations
- Popup/modal for displaying ghost stories
- Ghost voice playback button in story display

### Backend API Endpoints

#### 1. Ghost Chat API
```
POST /api/ghost-chat
Request: { "message": string, "persona_id": string (optional) }
Response: { 
  "reply": string, 
  "timestamp": string,
  "persona": {
    "id": string,
    "name": string,
    "era": string,
    "gender": string,
    "voice_settings": object
  }
}

GET /api/ghost-personas
Response: {
  "personas": [
    {
      "id": string,
      "name": string,
      "era": string,
      "traits": array,
      "tone": string,
      "gender": string,
      "voice_settings": object
    }
  ]
}
```

#### 2. Haunted Journal API
```
POST /api/haunted-journal
Request: { "entry": string }
Response: { 
  "emotion": string,
  "haunted_reply": string,
  "timestamp": string 
}
```

#### 3. Reanimator API
```
POST /api/reanimator
Request: { "url": string }
Response: { 
  "original_html": string,
  "revived_html": string,
  "archive_date": string,
  "success": boolean
}
```

#### 4. Frankenstein Stitcher API
```
POST /api/frankenstein-stitch
Request: { 
  "api1": string,  // e.g., "weather"
  "api2": string   // e.g., "jokes"
}
Response: { 
  "stitched_output": string,
  "api1_data": object,
  "api2_data": object
}
```

#### 5. Haunted Map API
```
GET /api/haunted-locations
Response: { 
  "locations": [
    {
      "id": string,
      "name": string,
      "lat": number,
      "lng": number,
      "description": string
    }
  ]
}

POST /api/ghost-story
Request: { "location_id": string }
Response: { 
  "story": string,
  "ending_type": "whisper" | "suspense" | "presence" | "loop"
}
```

### Services

#### Frontend Services

**api.js**
- Centralized HTTP client using fetch API
- Base URL configuration
- Error handling wrapper
- Request/response interceptors

**ghostVoice.js**
- Wrapper around Web Speech API (SpeechSynthesis)
- Voice preset configurations:
  - `eerie`: Lower pitch, slower rate, mysterious tone
  - `emotional`: Medium pitch, moderate rate, expressive
  - `storyteller`: Clear pitch, measured rate, dramatic pauses
  - `playful`: Higher pitch, faster rate, energetic
- Queue management for sequential speech
- Fallback handling if speech synthesis unavailable

#### Backend Services

**ai_service.py**
- OpenAI API integration (or alternative AI service)
- Ghost Persona System with 7 distinct personalities:
  - The Weeping Bride (Victorian Era, 1890s) - Tragic, fragile, heartbroken
  - The Hollow Soldier (WWI, 1917) - Disciplined, hollow, commanding
  - The Shadow Child (Unknown) - Playful, creepy, sinister
  - The Forgotten Nun (Medieval, 1300s) - Corrupted, religious, zealous
  - The Butcher of Nightfall (Victorian London, 1888) - Violent, menacing
  - The Lost Scientist (Cold War, 1960s) - Analytical, cold, robotic
  - The Collector (Timeless/Demonic) - Calm, terrifying, ancient
- Each persona includes:
  - Unique personality traits and vocabulary
  - Era-specific context and behavior patterns
  - Custom voice settings (pitch, rate, volume, reverb)
  - Gender specification for voice synthesis
- Prompt templates for each feature:
  - Ghost Chat: Persona-specific responses with character consistency
  - Haunted Journal: Emotion detection + poetic 2-4 sentence replies
  - Reanimator: HTML modernization instructions
  - Frankenstein Stitcher: Creative API data combination
  - Haunted Map: Short ghost stories with specific ending types
- Token optimization strategies
- Error handling and retry logic

**wayback_service.py**
- Wayback Machine API integration
- URL validation and sanitization
- Archive snapshot retrieval
- HTML parsing and cleaning

**external_apis.py**
- API client for external services:
  - Weather API (e.g., OpenWeatherMap)
  - Jokes API (e.g., JokeAPI)
  - Quotes API (e.g., Quotable)
  - Advice API (e.g., Advice Slip)
  - Cat Facts API
- Response normalization
- Rate limiting and caching

## Data Models

### Frontend State Management

**Chat Message**
```javascript
{
  id: string,
  sender: 'user' | 'ghost',
  text: string,
  timestamp: Date
}
```

**Journal Entry**
```javascript
{
  entry: string,
  emotion: string | null,
  reply: string | null,
  timestamp: Date
}
```

**Reanimator Result**
```javascript
{
  url: string,
  originalHtml: string | null,
  revivedHtml: string | null,
  archiveDate: string | null,
  loading: boolean,
  error: string | null
}
```

**Stitcher Result**
```javascript
{
  api1: string,
  api2: string,
  output: string | null,
  loading: boolean,
  error: string | null
}
```

**Haunted Location**
```javascript
{
  id: string,
  name: string,
  lat: number,
  lng: number,
  description: string,
  story: string | null,
  endingType: string | null
}
```

### Backend Data Structures

**AI Prompt Template**
```python
{
  'system_prompt': str,
  'user_template': str,
  'max_tokens': int,
  'temperature': float
}
```

**API Response Wrapper**
```python
{
  'success': bool,
  'data': dict | list | str,
  'error': str | None,
  'timestamp': str
}
```

## Error Handling

### Frontend Error Handling

1. **Network Errors**: Display user-friendly error messages with retry options
2. **API Errors**: Parse backend error responses and show specific messages
3. **Voice Synthesis Errors**: Gracefully disable voice button if unsupported
4. **Map Loading Errors**: Show fallback message if map tiles fail to load
5. **Input Validation**: Client-side validation before API calls

### Backend Error Handling

1. **AI Service Failures**: Return fallback responses or cached content
2. **External API Timeouts**: Implement timeout limits (5-10 seconds)
3. **Wayback Machine Unavailable**: Return error with suggestion to try different URL
4. **Invalid Requests**: Return 400 with validation error details
5. **Server Errors**: Log errors and return 500 with generic message

### Error Response Format
```python
{
  'success': False,
  'error': {
    'code': str,  # e.g., 'AI_SERVICE_ERROR'
    'message': str,  # User-friendly message
    'details': str | None  # Technical details for debugging
  }
}
```

## Testing Strategy

### Frontend Testing

1. **Component Testing**
   - Test GlitchTransition animation triggers and callbacks
   - Test GhostVoiceButton with mocked speech synthesis
   - Test form submissions and input validation
   - Test routing and navigation

2. **Integration Testing**
   - Test API service calls with mocked responses
   - Test error handling flows
   - Test voice synthesis integration

3. **Visual Testing**
   - Verify consistent theming across pages
   - Test responsive layouts
   - Verify fog and glitch effects render correctly

### Backend Testing

1. **Unit Testing**
   - Test AI prompt generation
   - Test external API response parsing
   - Test Wayback Machine URL construction
   - Test error handling logic

2. **Integration Testing**
   - Test API endpoints with sample requests
   - Test AI service integration
   - Test external API calls with mocked responses

3. **End-to-End Testing**
   - Test complete user flows for each feature
   - Test error scenarios (network failures, invalid inputs)

## Styling and Theme

### Color Palette

```css
:root {
  /* Base colors */
  --bg-primary: #0a0a0f;
  --bg-secondary: #1a1a2e;
  --bg-tertiary: #16213e;
  
  /* Accent colors */
  --accent-purple: #b026ff;
  --accent-cyan: #00f0ff;
  --accent-purple-glow: rgba(176, 38, 255, 0.5);
  --accent-cyan-glow: rgba(0, 240, 255, 0.5);
  
  /* Text colors */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --text-ghost: #b026ff;
  
  /* UI elements */
  --border-color: rgba(176, 38, 255, 0.3);
  --shadow-glow: 0 0 20px var(--accent-purple-glow);
}
```

### Typography

- **Headings**: "Creepster" or "Nosifer" (Google Fonts) for spooky titles
- **Body**: "Roboto" or "Inter" for readability
- **Monospace**: "Fira Code" for code/technical content

### Animation Principles

1. **Glitch Effect**: Use CSS transforms, clip-path, and filters
2. **Fog Animation**: Slow-moving gradients with opacity changes
3. **Hover Effects**: Subtle glow and scale transforms
4. **Transitions**: 200-300ms for smooth interactions
5. **Loading States**: Pulsing or shimmer effects

## Enhancement Package Design

### Audio System Architecture

**Ambient Audio Manager**
- Base volume: 20-30% (configurable via intensity setting)
- Three intensity modes: Low (10-15%), Medium (25-30%), High (40-50%)
- Smooth crossfade on intensity change (300ms)
- Auto-ducking system for higher-priority audio

**Audio Priority System**
```javascript
Priority Levels:
1. Footsteps (highest) - 70-80% volume
2. TTS Speaking - mutes ambient
3. Whisper - 45-55% volume
4. Ambient (lowest) - 20-30% base
```

**Footstep Enhancement**
- Volume: 70-80% with low-frequency thump layer
- Stereo panning: L → R → Behind
- Medium reverb tail
- Room shake: 250-350ms, 2-4px + 0.25-0.5° rotation
- Complete ambient mute during playback
- 700ms safe delay before ambient resume

**Whisper System**
- Text: "Welcome… to Hell…"
- Double-layer: Main + 70ms delayed at 15% volume
- Stereo panning L → R
- Heavy reverb: 25-30%
- Trigger: Every 3-5 minutes + during Cursed Mode
- Visual: Blur ripple 250-350ms with chromatic aberration

### Visual Effects Architecture

**Glitch Transition Enhancement**
- Duration: 400-500ms
- Effects: RGB split, static noise, distortion ripple, light white flash
- Cursed Mode: +20% intensity
- Applied to ALL route/page changes
- Conflict prevention with footstep shake

**Blood Smear Effect**
- Trigger: Entering Cursed Mode OR opening Reanimator in Cursed Mode
- Duration: 300ms
- Effects: Blood smear animation, red tint, static distortion

**Shadow Silhouette**
- Frequency: Every 45-90 seconds
- Appearance: Tall shadow walking behind UI
- Opacity: 8-12% with light blur
- Non-blocking: pointer-events: none

**Candle Flicker**
- Targets: Buttons, cards, panels, overlays
- Intensity: 90% → 105% oscillation
- Pattern: Irregular
- Implementation: GPU-accelerated transforms

**Temperature Drop Effect**
- Triggers: 5 seconds idle OR cursed events
- Visual: Blue desaturation overlay, rising fog, edge condensation
- Audio: +10% wind volume (if not muted)
- Motion: Mild slow-motion effect

**Reanimator Visual Upgrade**
- Electric surge animation during generation
- Digital distortion stripes
- Power-down sweep on completion
- Enhanced CSS theme with cinematic colors

### Service Layer Updates

**audioEffects.js**
```javascript
class AudioManager {
  constructor() {
    this.ambientGain = null;
    this.masterGain = null;
    this.currentPriority = 0;
    this.intensity = 'medium';
  }
  
  setIntensity(level) // 'low' | 'medium' | 'high'
  playFootsteps()
  playWhisper(text)
  duckAmbient(amount)
  muteAmbient()
  restoreAmbient(delay)
  checkPriority(requestedPriority)
}
```

**visualEffects.js**
```javascript
class VisualEffectsManager {
  triggerGlitch(intensity, duration)
  triggerBloodSmear()
  startShadowSilhouette()
  applyCandle Flicker(element)
  triggerTemperatureDrop()
  triggerRoomShake(duration)
  triggerBlurRipple(duration)
}
```

### Component Updates

**New Components**
- `IntensitySelector.jsx` - Audio intensity control
- `ShadowSilhouette.jsx` - Passing shadow effect
- `TemperatureDrop.jsx` - Cold effect overlay
- `BloodSmear.jsx` - Cursed Mode transition

**Updated Components**
- `GlitchTransition.jsx` - Enhanced with new effects
- `FogOverlay.jsx` - Temperature drop integration
- `Reanimator.jsx` - Electric surge animations
- All page components - Candle flicker integration

### Performance Optimization Strategy

1. **GPU Acceleration**: All animations use transform and opacity only
2. **Audio Optimization**: 
   - Use Web Audio API gainNode for smooth volume changes
   - Prevent audio clipping with proper gain staging
   - Implement audio sprite system for footsteps
3. **Visual Optimization**:
   - Use will-change CSS property sparingly
   - Implement requestAnimationFrame for custom animations
   - Debounce shadow silhouette triggers
4. **Mobile Compatibility**:
   - Test audio on iOS Safari (requires user interaction)
   - Reduce particle effects on mobile
   - Use matchMedia for responsive adjustments

## Performance Considerations

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Asset Optimization**: Compress images and use WebP format
3. **CSS Optimization**: Use CSS Modules to avoid global style conflicts
4. **API Caching**: Cache external API responses for 5-10 minutes
5. **Debouncing**: Debounce user inputs to reduce API calls
6. **Lazy Loading**: Load map markers and stories on demand
7. **GPU Transforms**: Use transform3d and translateZ(0) for hardware acceleration
8. **Audio Efficiency**: Preload audio buffers, use Web Audio API for precise control
9. **Animation Throttling**: Limit concurrent animations to prevent frame drops

## Security Considerations

1. **Input Sanitization**: Sanitize all user inputs on backend
2. **CORS Configuration**: Restrict origins in production
3. **API Rate Limiting**: Implement rate limiting on backend endpoints
4. **HTML Sanitization**: Sanitize HTML from Wayback Machine before rendering
5. **Environment Variables**: Store API keys in environment variables
6. **Error Messages**: Avoid exposing sensitive information in error responses

## Deployment Considerations

1. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
2. **Backend**: Deploy to Heroku, Railway, or Render
3. **Environment Variables**: Configure API keys and base URLs
4. **CORS**: Update allowed origins for production
5. **Build Process**: Optimize production builds with minification
