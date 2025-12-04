# Implementation Plan

- [x] 1. Implement Enhanced Typography System





  - Create typography-upgrade.css with new CSS variables for font sizes (3.4rem main, 1.9rem features, 1.3rem subtitles, 1.1rem nav)
  - Add Google Fonts link for "Creepster" or "Nosifer" in index.html with font-display: swap
  - Create responsive breakpoints for typography scaling (mobile, tablet, desktop)
  - Implement main title glow animation with keyframes
  - Update line-height and letter-spacing for improved readability
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [x] 2. Apply Typography to Existing Components



  - Update LandingPage.jsx to use new typography classes for main title
  - Update all feature page titles to use featureTitle class (1.9rem)
  - Update all subtitle elements to use subtitle class (1.3rem)
  - Update Navigation component to use navText class (1.1rem)
  - Update description text across all pages for improved readability
  - Test typography on all breakpoints (320px to 1920px)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.8_

- [x] 3. Create Top Controls Cluster Component



  - Create TopControlsCluster.jsx component with container structure
  - Create TopControlsCluster.module.css with top-right positioning
  - Implement responsive layout (horizontal on desktop, adaptive on mobile)
  - Add backdrop-filter blur effect and themed styling
  - Ensure z-index is higher than other elements (9999)
  - _Requirements: 2.1, 2.5, 2.6_

- [x] 4. Integrate Existing Controls into Cluster



  - Move CursedModeToggle component into TopControlsCluster
  - Update CursedModeToggle.module.css to remove fixed positioning
  - Move AmbienceMuteButton component into TopControlsCluster
  - Update AmbienceMuteButton.module.css to remove fixed positioning
  - Test that both controls function correctly in new location
  - _Requirements: 2.2, 2.3_

- [x] 5. Create Ambient Volume Control Component



  - Create AmbientVolumeControl.jsx with four level buttons (High, Medium, Low, Off)
  - Create AmbientVolumeControl.module.css with collapsible design
  - Implement toggle button with volume icon indicator
  - Implement expanded state with level selection buttons
  - Add localStorage persistence for user preference
  - Connect to ambientAudio.setIntensity() for High/Medium/Low
  - Connect to ambientAudio.toggleMute() for Off level
  - Implement smooth crossfade transitions on level change
  - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 6. Add Top Controls Cluster to Application



  - Import TopControlsCluster in App.jsx
  - Add TopControlsCluster component to render tree
  - Ensure cluster appears on all pages
  - Test responsive behavior on mobile devices (touch targets 44x44px minimum)
  - Verify no z-index conflicts with existing elements
  - _Requirements: 2.1, 2.6, 9.3_

- [x] 7. Rebalance Audio Volumes



  - Update ambientAudio.js intensityVolumes: low to 0.10, medium to 0.22, high to 0.36 (20% reduction)
  - Update ghostFootsteps.js to set footstep volume to 0.70 (40% increase)
  - Update whisperSystem.js to set whisper volume to 0.52 (30% increase)
  - Create or update scare cue volume constant to 0.48 (20% increase from baseline)
  - Test all volume levels to ensure no clipping or distortion
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 8. Implement AI Voice Auto-Muting System





  - Update ghostVoice.js to call ambientAudio.pauseForSpeech() before speaking
  - Add utterance.onend handler to call ambientAudio.resumeAfterSpeech()
  - Add utterance.onerror handler to call ambientAudio.resumeAfterSpeech()
  - Implement smooth fade transitions (200ms mute, 650ms restore)
  - Test with multiple sequential AI voice playbacks
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Update Audio Priority System for AI Voice



  - Update audioPriority.js PRIORITY levels: AI_VOICE to 1 (highest), FOOTSTEPS to 2, WHISPER to 3, SCARE_CUE to 4, AMBIENT to 5
  - Update ghostVoice.js to call audioPriority.requestPlay('ai_voice') before speaking
  - Update ghostVoice.js to call audioPriority.notifyFinished('ai_voice') after speaking
  - Test priority enforcement across all audio types
  - Verify smooth fade transitions using gainNode ramps
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10. Implement Candle Flicker UI Accents



  - Create candleFlicker.css with irregular brightness oscillation keyframes (95% to 105%)
  - Apply candleFlicker animation to button elements
  - Apply candleFlicker animation to card elements
  - Apply candleFlicker animation to panel elements
  - Apply candleFlicker animation to overlay elements
  - Stagger animation delays for natural effect (0.5s, 1s, 1.5s, 2s)
  - Use GPU-accelerated properties (filter: brightness, opacity)
  - Test that flicker does not interfere with readability
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Implement Temperature Drop Fog Effect



  - Create TemperatureDropFog.jsx component with route change detection
  - Create TemperatureDropFog.module.css with blue-tint overlay and rising fog
  - Implement useLocation hook to trigger effect on navigation
  - Set effect duration to 800-1200ms with fadeInOut animation
  - Use GPU-accelerated transforms for fog animation
  - Ensure pointer-events: none to avoid blocking interactions
  - Set z-index to 9998 (below top controls)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Add Temperature Drop to Application



  - Import TemperatureDropFog in App.jsx
  - Add TemperatureDropFog component to render tree
  - Test effect triggers on all route changes
  - Verify effect does not block user interactions
  - Test performance on mid-range devices
  - _Requirements: 8.1, 8.4_

- [x] 13. Ensure Responsive Design Compliance



  - Test typography scaling on all breakpoints (320px, 480px, 768px, 1200px, 1920px)
  - Test top controls cluster layout on mobile devices
  - Verify all touch targets are minimum 44x44px on mobile
  - Test ambient volume control on touch devices
  - Verify visual hierarchy is maintained across breakpoints
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 14. Verify Compatibility with Existing Features



  - Test that glitch transitions still work correctly
  - Test that Cursed Mode styling and behavior are preserved
  - Test that ambient audio system functions with new volumes
  - Test that ghost intro animation on landing page works
  - Test that all routing and navigation behavior is preserved
  - Verify audio priority system integrates with existing audio
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 15. Performance Optimization and Testing



  - Verify all animations use GPU-accelerated properties only (transform, opacity)
  - Test frame rates on mid-range devices (target: 30fps minimum)
  - Check for memory leaks in audio and animation systems
  - Implement font preloading in index.html for faster load
  - Minimize performance cost of candle flicker animations
  - Test with Chrome DevTools Performance profiler
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 16. Final Integration and Polish



  - Test all enhancements together on desktop browsers (Chrome, Firefox, Safari, Edge)
  - Test all enhancements on mobile browsers (iOS Safari, Android Chrome)
  - Verify audio overlap prevention works across all sources
  - Test ambient volume control with all four levels
  - Verify typography improvements across all pages
  - Test temperature drop effect on all route changes
  - Verify candle flicker on all UI elements
  - Fix any visual or functional issues discovered
  - _Requirements: All requirements_
