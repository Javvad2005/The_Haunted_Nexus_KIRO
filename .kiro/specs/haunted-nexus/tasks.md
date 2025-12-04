# Implementation Plan

- [x] 1. Set up project structure and dependencies



  - Create frontend/ directory with React + Vite setup
  - Create backend/ directory with Flask setup
  - Install and configure all required dependencies
  - Set up CORS configuration for local development
  - Create .gitignore files for both frontend and backend
  - _Requirements: 9.1, 9.2, 10.1_

- [x] 2. Implement global theme and styling system



  - Create theme.css with color palette CSS variables (dark theme, neon purple/cyan accents)
  - Create animations.css with reusable animation keyframes
  - Set up CSS Modules configuration in Vite
  - Create base styles in index.css for body and root elements
  - _Requirements: 1.1, 1.3_

- [x] 3. Build global reusable components





  - [x] 3.1 Create GlitchTransition component with configurable intensity and duration


    - Implement full-screen overlay with CSS glitch effects
    - Add props for isActive, duration, intensity, and onComplete callback
    - Use CSS transforms, clip-path, and filters for glitch animation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 Create FogOverlay component with animated fog effects

    - Implement CSS gradient-based fog animation
    - Add intensity prop (light, medium, heavy)
    - Set pointer-events: none for non-blocking overlay
    - _Requirements: 1.2_

  - [x] 3.3 Create SpookyButton component with themed styling

    - Implement primary and secondary variants
    - Add hover effects with neon glow
    - Include disabled state styling
    - _Requirements: 1.1, 1.3_
  - [x] 3.4 Create Navigation component with route links


    - Display links to landing page and all five features
    - Highlight current active route
    - Apply spooky theme styling
    - _Requirements: 9.2_

- [x] 4. Implement Ghost Voice Engine system



  - [x] 4.1 Create ghostVoice.js service with Web Speech API integration


    - Implement voice preset configurations (eerie, emotional, storyteller, playful)
    - Configure pitch, rate, and volume for each preset
    - Add queue management for sequential speech
    - Include fallback handling if speech synthesis unavailable
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 4.2 Create GhostVoiceButton component


    - Accept text and preset props
    - Integrate with ghostVoice service
    - Show loading state during speech synthesis
    - Add ghost icon and themed styling
    - _Requirements: 3.3_

- [x] 5. Set up routing and landing page



  - [x] 5.1 Configure React Router with routes for all pages


    - Set up BrowserRouter in App.jsx
    - Define routes for landing page and five features
    - _Requirements: 9.2_
  - [x] 5.2 Create LandingPage component


    - Build hero section with project title and spooky tagline
    - Create grid of five feature cards with descriptions and links
    - Add FogOverlay and initial glitch effect on load
    - Apply dark theme styling
    - _Requirements: 1.4_

- [x] 6. Set up backend Flask application and API structure



  - Create app.py with Flask app initialization
  - Configure Flask-CORS for cross-origin requests
  - Create config.py for environment variables and settings
  - Set up route blueprints for each feature
  - Create utils/prompts.py for AI prompt templates
  - _Requirements: 10.1, 10.2, 10.6_

- [x] 7. Create frontend API service layer



  - Create services/api.js with centralized HTTP client using fetch
  - Configure base URL for backend API
  - Implement error handling wrapper for all requests
  - Add request/response helper functions
  - _Requirements: 9.4, 10.6_

- [x] 8. Implement Ghost Chat feature



  - [x] 8.1 Create GhostChat page component


    - Build chat message list UI with user and ghost message styling
    - Create text input with submit button
    - Implement auto-scroll to latest message
    - Add GhostVoiceButton for each ghost response
    - Manage chat state with useState hook
    - _Requirements: 4.1, 4.2, 4.4_
  - [x] 8.2 Create backend Ghost Chat API endpoint


    - Create routes/ghost_chat.py with POST /api/ghost-chat endpoint
    - Accept message in request body
    - Return JSON response with ghost reply and timestamp
    - _Requirements: 4.2, 10.2, 10.6_
  - [x] 8.3 Implement AI service for Ghost Chat


    - Create services/ai_service.py with OpenAI integration
    - Write prompt template for eerie ghost responses with optional jokes
    - Implement function to generate ghost chat replies
    - Add error handling and retry logic
    - _Requirements: 4.3, 4.5, 10.3, 11.4_
  - [x] 8.3.1 Implement Ghost Persona System


    - Define 7 distinct ghost personas with unique personalities
    - Add persona-specific vocabulary, traits, and behavior patterns
    - Include voice settings (pitch, rate, volume, reverb) for each persona
    - Implement persona-based response generation
    - _Requirements: 4.9_
  - [x] 8.3.2 Create Ghost Personas API endpoint


    - Add GET /api/ghost-personas endpoint to ghost_chat.py
    - Return list of all available personas with their details
    - Include persona ID, name, era, traits, tone, and voice settings
    - _Requirements: 4.6, 4.9_
  - [x] 8.3.3 Add Persona Selector UI


    - Create persona selection modal in GhostChat component
    - Display all available personas with their characteristics
    - Implement persona selection and state management
    - Show system message when persona changes
    - Style persona cards with hover effects
    - _Requirements: 4.6, 4.7, 4.8, 4.10_
  - [x] 8.3.4 Integrate Persona with Chat Messages


    - Update chat API to accept optional persona_id parameter
    - Display persona name label on ghost messages
    - Pass persona voice settings to GhostVoiceButton
    - Update API service to handle persona data
    - _Requirements: 4.7, 4.8_
  - [x] 8.4 Connect frontend to backend API


    - Call POST /api/ghost-chat from GhostChat component
    - Handle loading and error states
    - Display AI-generated responses in chat
    - _Requirements: 4.2, 4.3_

- [x] 9. Implement Haunted Journal feature




  - [x] 9.1 Create HauntedJournal page component


    - Build large textarea for journal entry input
    - Create submit button with spooky styling
    - Add response display area with poetic formatting
    - Include GhostVoiceButton for haunted response
    - Manage journal state with useState hook
    - _Requirements: 5.1, 5.3, 5.5_
  - [x] 9.2 Create backend Haunted Journal API endpoint


    - Create routes/haunted_journal.py with POST /api/haunted-journal endpoint
    - Accept journal entry in request body
    - Return JSON response with emotion, haunted reply, and timestamp
    - _Requirements: 5.2, 10.2, 10.6_
  - [x] 9.3 Implement AI service for emotion detection and poetic responses


    - Add prompt template for emotion detection from journal text
    - Write prompt template for 2-4 sentence poetic haunted replies (no jokes)
    - Implement function to analyze emotion and generate response
    - _Requirements: 5.2, 5.3, 5.4, 10.3, 11.4_
  - [x] 9.4 Connect frontend to backend API


    - Call POST /api/haunted-journal from HauntedJournal component
    - Handle loading and error states
    - Display emotion and haunted reply
    - _Requirements: 5.2, 5.3_

- [x] 10. Implement Reanimator feature






  - [x] 10.1 Create Reanimator page component



    - Build URL input field with submit button
    - Create split-screen layout (left: original, right: revived)
    - Add loading state with GlitchTransition animation
    - Display error messages for invalid URLs
    - Manage reanimator state with useState hook
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 10.2 Create backend Reanimator API endpoint


    - Create routes/reanimator.py with POST /api/reanimator endpoint
    - Accept URL in request body
    - Return JSON response with original HTML, revived HTML, archive date, and success flag

    - _Requirements: 6.2, 10.2, 10.6_
  - [x] 10.3 Implement Wayback Machine service


    - Create services/wayback_service.py with Wayback Machine API integration
    - Implement URL validation and sanitization
    - Fetch archived snapshot from Wayback Machine
    - Parse and clean HTML content

    - Add error handling for missing archives
    - _Requirements: 6.2, 10.5_
  - [x] 10.4 Implement AI service for HTML modernization


    - Add prompt template for modernizing archived HTML

    - Implement function to generate revived HTML version
    - Sanitize AI-generated HTML before returning
    - _Requirements: 6.3, 10.3, 11.4_
  - [x] 10.5 Connect frontend to backend API


    - Call POST /api/reanimator from Reanimator component
    - Handle loading state with glitch resurrection animation
    - Display original and revived HTML in split view
    - Handle errors gracefully
    - _Requirements: 6.2, 6.3, 6.5_

- [x] 11. Implement Frankenstein API Stitcher feature


  - [x] 11.1 Create FrankensteinStitcher page component


    - Build two dropdown selects for API selection (weather, jokes, quotes, advice, cat facts)
    - Create stitch button with spooky styling
    - Add result display area with themed formatting
    - Include GlitchTransition on result reveal
    - Add GhostVoiceButton for stitched output
    - Manage stitcher state with useState hook
    - _Requirements: 7.1, 7.4, 7.5, 7.6_
  - [x] 11.2 Create backend Frankenstein Stitcher API endpoint


    - Create routes/frankenstein_stitcher.py with POST /api/frankenstein-stitch endpoint
    - Accept api1 and api2 selections in request body
    - Return JSON response with stitched output and both API data objects
    - _Requirements: 7.2, 10.2, 10.6_
  - [x] 11.3 Implement external APIs service


    - Create services/external_apis.py with API clients for all five APIs
    - Implement weather API integration (OpenWeatherMap or similar)
    - Implement jokes API integration (JokeAPI or similar)
    - Implement quotes API integration (Quotable or similar)
    - Implement advice API integration (Advice Slip or similar)
    - Implement cat facts API integration
    - Add response normalization and error handling
    - _Requirements: 7.3, 10.4_
  - [x] 11.4 Implement AI service for API stitching


    - Add prompt template for creatively combining two API responses
    - Implement function to generate spooky stitched output
    - _Requirements: 7.4, 10.3, 11.4_
  - [x] 11.5 Connect frontend to backend API


    - Call POST /api/frankenstein-stitch from FrankensteinStitcher component
    - Handle loading and error states
    - Trigger glitch effect when displaying result
    - _Requirements: 7.2, 7.5_

- [x] 12. Implement Haunted Map feature


  - [x] 12.1 Create HauntedMap page component


    - Install and configure Leaflet for React
    - Build map container with dark tile layer (CartoDB Dark Matter)
    - Add FogOverlay component on top of map
    - Create custom marker icons for haunted locations
    - Implement popup/modal for displaying ghost stories
    - Add GhostVoiceButton in story display
    - Manage map state with useState hook
    - _Requirements: 8.1, 8.2, 8.5_
  - [x] 12.2 Create backend Haunted Map API endpoints


    - Create routes/haunted_map.py with GET /api/haunted-locations endpoint
    - Return JSON array of 20-30 haunted locations with id, name, lat, lng, description
    - Create POST /api/ghost-story endpoint that accepts location_id
    - Return JSON response with story and ending_type
    - _Requirements: 8.2, 8.3, 10.2, 10.6_
  - [x] 12.3 Implement AI service for ghost story generation


    - Add prompt templates for four ending types (whisper, suspense, presence, loop)
    - Implement function to generate 2-4 sentence ghost stories
    - Randomly select ending type or accept as parameter
    - _Requirements: 8.4, 10.3, 11.4_
  - [x] 12.4 Connect frontend to backend API


    - Fetch haunted locations on component mount
    - Display markers on map for all locations
    - Call POST /api/ghost-story when marker is clicked
    - Display story in popup/modal with voice playback option
    - Handle loading and error states
    - _Requirements: 8.3, 8.4_

- [x] 13. Implement error handling and loading states



  - Add error boundaries in React for component error catching
  - Implement consistent error message display components
  - Add loading spinners or skeleton screens for async operations
  - Implement retry mechanisms for failed API calls
  - Add input validation on frontend before API calls
  - _Requirements: 10.6, 11.4_

- [x] 14. Optimize for credit efficiency



  - Implement AI prompt optimization to reduce token usage
  - Add response caching for external API calls (5-10 minute TTL)
  - Implement debouncing for user inputs that trigger API calls
  - Optimize CSS animations to reduce CPU usage
  - Use code splitting with React.lazy() for route-based loading
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Final integration and polish



  - Test all five features end-to-end
  - Verify consistent theming across all pages
  - Test ghost voice playback on all features
  - Verify glitch transitions work correctly
  - Test responsive layouts on different screen sizes
  - Fix any remaining bugs or styling issues
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

## Enhancement Package Implementation

- [x] 16. Implement Global Ambient Audio System with Intensity Controls



  - [x] 16.1 Create enhanced ambientAudio.js service with Web Audio API


    - Implement AudioContext with gainNode architecture
    - Set base ambient volume to 20-30%
    - Create three intensity presets: Low (10-15%), Medium (25-30%), High (40-50%)
    - Implement smooth crossfade on intensity change (300ms)
    - Add ducking system that reduces volume by 50% during whispers
    - Add complete mute during footsteps, TTS, and voice recording
    - Implement smooth restore with 600-700ms delay after events
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_
  
  - [x] 16.2 Create IntensitySelector component


    - Build UI with three buttons: Low, Medium, High
    - Highlight currently selected intensity
    - Connect to ambientAudio service to change intensity
    - Apply spooky theme styling
    - _Requirements: 12.7, 12.8_
  

  - [x] 16.3 Integrate intensity selector into UI

    - Add IntensitySelector to Navigation or settings area
    - Persist user's intensity preference in localStorage
    - Initialize ambient audio on app load with saved preference
    - _Requirements: 12.7, 12.8_

- [x] 17. Implement Audio Priority Engine




  - [x] 17.1 Create AudioPriorityManager class

    - Define priority levels: Footsteps (1), TTS (2), Whisper (3), Ambient (4)
    - Implement priority checking before playing any audio
    - Ensure only one major sound plays at a time
    - Use gainNode ramps for all volume changes (no pops)
    - Track currently playing audio and its priority
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  


  - [x] 17.2 Integrate priority system with all audio sources





    - Update ghostVoice.js to check priority before TTS
    - Update whisper system to check priority
    - Update footstep system to check priority
    - Ensure ambient always yields to higher priority
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 18. Upgrade Footstep System with Room Shake



  - [x] 18.1 Enhance ghostFootsteps.js service


    - Boost footstep volume to 70-80%
    - Add low-frequency thump layer to audio
    - Implement stereo panning: Left → Right → Behind listener
    - Add medium reverb tail effect
    - Integrate with AudioPriorityManager (highest priority)
    - Trigger complete ambient mute during playback
    - Add 700ms safe delay before ambient resume
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 13.7_
  

  - [x] 18.2 Create room shake visual effect

    - Implement shake effect in visualEffects.js
    - Duration: 250-350ms with random variation
    - Apply 2-4px translation shake
    - Apply 0.25-0.5 degree rotation
    - Use GPU transforms (transform3d, translateZ)
    - Trigger shake when footsteps play
    - _Requirements: 13.4, 13.5_
  

  - [x] 18.3 Integrate footsteps with priority and shake

    - Connect footstep playback to room shake trigger
    - Ensure footsteps mute ambient via priority system
    - Test that shake doesn't conflict with other effects
    - _Requirements: 13.6, 13.7_

- [x] 19. Implement Enhanced Whisper System




  - [x] 19.1 Create whisper audio system

    - Replace all old whispers with "Welcome… to Hell…"
    - Set whisper volume to 45-55%
    - Implement double-layer whisper: main + 70ms delayed at 15%
    - Apply stereo panning from left to right
    - Add heavy reverb at 25-30%
    - Integrate with AudioPriorityManager
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  

  - [x] 19.2 Create blur ripple visual effect

    - Implement blur ripple in visualEffects.js
    - Duration: 250-350ms
    - Apply chromatic aberration at edges
    - Trigger when whisper plays
    - _Requirements: 14.5_
  


  - [x] 19.3 Implement whisper timing system





    - Create timer that triggers whisper every 3-5 minutes (random)
    - Trigger whispers during Cursed Mode effects
    - Ensure whispers don't overlap with higher priority audio
    - Connect whisper playback to blur ripple effect
    - _Requirements: 14.6, 14.7_

- [x] 20. Enhance Glitch Transitions for All Route Changes






  - [x] 20.1 Update GlitchTransition component

    - Set default duration to 400-500ms
    - Implement RGB split effect
    - Add static noise overlay
    - Add distortion ripple effect
    - Add light white flash
    - Increase intensity by 20% when Cursed Mode is active
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  

  - [x] 20.2 Apply glitch to all route changes

    - Integrate GlitchTransition with React Router
    - Trigger medium glitch on every route/page change
    - Prevent double-trigger with debouncing
    - Prevent infinite loops
    - Ensure no conflict with footstep shake
    - _Requirements: 16.1, 16.5, 16.6_

- [x] 21. Implement Blood Smear Effect for Cursed Mode
  - [x] 21.1 Create BloodSmear component
    - Implement 300ms blood smear animation
    - Apply red tint overlay
    - Add static distortion effect
    - Create reusable component that can be triggered
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 21.2 Integrate blood smear triggers

    - Trigger when entering Cursed Mode
    - Trigger when opening Reanimator with Cursed Mode active
    - Ensure smooth animation without blocking UI
    - _Requirements: 17.1, 17.2_

- [x] 22. Implement Shadow Silhouette Effect







  - [x] 22.1 Create ShadowSilhouette component

    - Design tall shadow figure SVG or CSS shape
    - Implement walking animation across screen
    - Set opacity to 8-12% with light blur
    - Use pointer-events: none to avoid blocking interactions
    - Apply GPU transforms for smooth animation
    - _Requirements: 18.1, 18.2, 18.3_

  

  - [x] 22.2 Implement shadow timing system

    - Create timer that triggers shadow every 45-90 seconds (random)
    - Randomize shadow direction and speed slightly
    - Ensure shadow doesn't interfere with other effects
    - Add shadow to all pages via App.jsx or layout component
    - _Requirements: 18.1_

- [x] 23. Implement Candle Flicker Lighting Effects




  - [x] 23.1 Create candle flicker CSS animation

    - Define keyframes with irregular intensity oscillation (90% → 105%)
    - Use GPU-accelerated properties (opacity, filter: brightness)
    - Create multiple animation variations for natural randomness
    - _Requirements: 19.1, 19.2, 19.3_
  

  - [x] 23.2 Apply flicker to UI elements

    - Add flicker class to buttons
    - Add flicker class to cards
    - Add flicker class to panels
    - Add flicker class to overlays
    - Ensure flicker is subtle and doesn't distract from content
    - _Requirements: 19.1_

- [x] 24. Implement Paranormal Temperature Drop Effect




  - [x] 24.1 Create TemperatureDrop component

    - Implement blue desaturation overlay
    - Create rising fog layer animation
    - Add edge condensation effect (CSS gradient borders)
    - Apply mild slow-motion effect (animation-duration adjustments)
    - _Requirements: 20.3, 20.4, 20.5, 20.7_
  

  - [x] 24.2 Implement temperature drop triggers

    - Create idle detection system (5 seconds of no user interaction)
    - Trigger on cursed events
    - Increase wind volume by 10% if ambient not muted
    - Ensure effect doesn't block user interactions
    - _Requirements: 20.1, 20.2, 20.6_
  

  - [x] 24.3 Integrate with audio system





    - Connect to ambient audio to increase wind layer
    - Check if ambient is muted before adjusting wind
    - Smoothly fade wind volume changes
    - _Requirements: 20.6_

- [x] 25. Enhance Reanimator Visual Effects





  - [x] 25.1 Create electric surge animation
    - Design electric bolt/surge SVG or CSS animation
    - Trigger during content generation
    - Apply to Reanimator page borders or background
    - _Requirements: 21.1_

  
  - [x] 25.2 Add digital distortion stripes

    - Create horizontal distortion stripe effect
    - Animate during generation process
    - Use CSS transforms and clip-path
    - _Requirements: 21.2_
  


  - [x] 25.3 Create power-down sweep animation
    - Implement sweep effect that plays on completion
    - Simulate power-down with fade and scale
    - Trigger after generation completes
    - _Requirements: 21.3_

  
  - [x] 25.4 Improve auto-generated CSS theme


    - Enhance color palette with more cinematic colors
    - Improve contrast ratios for better readability
    - Add subtle gradients and shadows
    - _Requirements: 21.4_

- [x] 26. UI Polish and Layout Improvements



  - [x] 26.1 Expand Reanimator layout


    - Increase layout width to accommodate both panels properly
    - Adjust panel sizing for better content display
    - Improve responsive breakpoints
    - _Requirements: 22.1_
  

  - [x] 26.2 Improve spacing and readability

    - Review and adjust padding across all pages
    - Improve line-height and letter-spacing for text
    - Increase spacing between interactive elements
    - Reduce visual clutter by simplifying layouts
    - _Requirements: 22.2, 22.4_
  


  - [x] 26.3 Add hover glows and transitions
    - Apply glow effects to all interactive elements on hover
    - Smooth out all transitions (200-300ms)
    - Add subtle scale transforms on hover
    - _Requirements: 22.3_

  

  - [x] 26.4 Ensure mobile responsiveness

    - Test all layouts on mobile viewports
    - Adjust font sizes for mobile
    - Ensure touch targets are at least 44x44px
    - Test audio controls on mobile browsers
    - _Requirements: 22.5_

- [-] 27. Performance Optimization and Testing





  - [ ] 27.1 Optimize all animations for GPU
    - Audit all animations to use only transform and opacity
    - Add will-change hints where appropriate
    - Use transform3d and translateZ(0) for hardware acceleration
    - Remove any animations causing layout thrashing
    - _Requirements: 23.1_

  
  - [x] 27.2 Prevent re-render loops

    - Audit React components for unnecessary re-renders
    - Use React.memo where appropriate
    - Optimize useEffect dependencies
    - Implement proper cleanup in effects
    - _Requirements: 23.2_
  

  - [x] 27.3 Optimize audio system

    - Ensure smooth audio transitions without clipping
    - Implement proper gain staging to prevent over-amplification
    - Test audio on multiple browsers and devices
    - Ensure mobile browser compatibility (especially iOS Safari)
    - _Requirements: 23.3, 23.4, 23.5_
  
  - [x] 27.4 Final integration testing



    - Test all enhancements work together without conflicts
    - Verify audio priority system prevents overlaps
    - Test performance on low-end devices
    - Verify all effects work in Cursed Mode
    - Test that homepage ghost intro is disabled
    - _Requirements: All enhancement requirements_
