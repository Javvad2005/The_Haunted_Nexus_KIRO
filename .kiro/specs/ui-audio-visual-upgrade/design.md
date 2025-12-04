# Design Document

## Overview

This design document outlines the implementation strategy for a comprehensive UI, audio, and visual enhancement package for the Haunted Nexus application. The upgrade focuses on three main areas: typography improvements with spooky fonts and larger sizes, audio system reorganization with better volume balance and auto-muting, and enhanced visual effects including candle flicker accents and temperature drop overlays. All enhancements are designed to integrate seamlessly with existing features while maintaining performance and responsiveness.

## Architecture

### High-Level Enhancement Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   UI Enhancement Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Typography  │  │ Top Controls │  │    Visual    │     │
│  │   System     │  │   Cluster    │  │   Effects    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                  Audio Enhancement Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Ambient    │  │  AI Voice    │  │   Priority   │     │
│  │   Volume     │  │ Auto-Muting  │  │   Manager    │     │
│  │   Control    │  │              │  │   (Updated)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                 Existing Haunted Nexus System                │
│  (Glitch Transitions, Cursed Mode, Routing, Features)       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend Enhancements:**
- CSS custom properties for typography system
- Google Fonts API for "Creepster" or "Nosifer" fonts
- CSS Modules for component styling
- Web Audio API for enhanced audio control
- CSS animations with GPU acceleration

**Integration Points:**
- Existing ambientAudio.js service (volume adjustments)
- Existing audioPriority.js service (AI voice integration)
- Existing ghostVoice.js service (auto-muting hooks)
- Existing CSS theme system (typography variables)
- Existing component structure (top controls cluster)

## Components and Interfaces

### 1. Typography System

#### CSS Variables Enhancement

```css
/* typography-upgrade.css */
:root {
  /* Font families */
  --font-spooky: 'Creepster', 'Nosifer', cursive;
  --font-heading: var(--font-spooky);
  
  /* Font sizes - Enhanced */
  --font-size-main-title: 3.4rem;
  --font-size-feature-title: 1.9rem;
  --font-size-subtitle: 1.3rem;
  --font-size-nav: 1.1rem;
  --font-size-description: 1rem;
  
  /* Line heights for readability */
  --line-height-title: 1.2;
  --line-height-body: 1.7;
  
  /* Letter spacing */
  --letter-spacing-title: 0.05em;
  --letter-spacing-nav: 0.02em;
}

/* Responsive typography */
@media (max-width: 1200px) {
  :root {
    --font-size-main-title: 2.8rem;
    --font-size-feature-title: 1.6rem;
    --font-size-subtitle: 1.1rem;
  }
}

@media (max-width: 768px) {
  :root {
    --font-size-main-title: 2.2rem;
    --font-size-feature-title: 1.4rem;
    --font-size-subtitle: 1rem;
    --font-size-nav: 1rem;
  }
}

@media (max-width: 480px) {
  :root {
    --font-size-main-title: 1.8rem;
    --font-size-feature-title: 1.2rem;
    --font-size-subtitle: 0.9rem;
    --font-size-nav: 0.95rem;
  }
}
```

#### Main Title Glow Animation

```css
/* Main title only - subtle animated glow */
.mainTitle {
  font-family: var(--font-spooky);
  font-size: var(--font-size-main-title);
  animation: titleGlow 3s ease-in-out infinite;
  will-change: text-shadow;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 
      0 0 10px var(--accent-purple-glow),
      0 0 20px var(--accent-purple-glow),
      0 0 30px var(--accent-purple);
  }
  50% {
    text-shadow: 
      0 0 15px var(--accent-purple-glow),
      0 0 30px var(--accent-purple-glow),
      0 0 45px var(--accent-purple),
      0 0 60px var(--accent-purple);
  }
}
```

#### Typography Application Classes

```css
/* Title classes */
.mainTitle {
  font-family: var(--font-spooky);
  font-size: var(--font-size-main-title);
  line-height: var(--line-height-title);
  letter-spacing: var(--letter-spacing-title);
}

.featureTitle {
  font-family: var(--font-spooky);
  font-size: var(--font-size-feature-title);
  line-height: var(--line-height-title);
  letter-spacing: var(--letter-spacing-title);
}

.subtitle {
  font-family: var(--font-spooky);
  font-size: var(--font-size-subtitle);
  line-height: var(--line-height-title);
}

.navText {
  font-size: var(--font-size-nav);
  letter-spacing: var(--letter-spacing-nav);
}

.description {
  font-size: var(--font-size-description);
  line-height: var(--line-height-body);
  letter-spacing: 0.01em;
}
```

### 2. Top Controls Cluster Component

#### TopControlsCluster Component

```javascript
// TopControlsCluster.jsx
import React from 'react';
import styles from './TopControlsCluster.module.css';
import CursedModeToggle from './CursedModeToggle';
import AmbienceMuteButton from './AmbienceMuteButton';
import AmbientVolumeControl from './AmbientVolumeControl';

const TopControlsCluster = () => {
  return (
    <div className={styles.cluster}>
      <CursedModeToggle />
      <AmbienceMuteButton />
      <AmbientVolumeControl />
    </div>
  );
};

export default TopControlsCluster;
```

#### TopControlsCluster Styles

```css
/* TopControlsCluster.module.css */
.cluster {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(10px);
  border: 2px solid var(--border-color);
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.cluster:hover {
  border-color: var(--accent-purple);
  box-shadow: 0 6px 30px rgba(176, 38, 255, 0.4);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cluster {
    top: 1rem;
    right: 1rem;
    gap: 0.5rem;
    padding: 0.5rem;
    flex-wrap: wrap;
    max-width: calc(100vw - 2rem);
  }
}

@media (max-width: 480px) {
  .cluster {
    flex-direction: column;
    align-items: stretch;
    border-radius: 12px;
  }
}
```

### 3. Ambient Volume Control Component

#### AmbientVolumeControl Component

```javascript
// AmbientVolumeControl.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './AmbientVolumeControl.module.css';
import ambientAudio from '../services/ambientAudio';

const AmbientVolumeControl = () => {
  const [level, setLevel] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('ambientVolumeLevel') || 'medium';
    setLevel(saved);
    applyLevel(saved);
  }, []);

  const applyLevel = (newLevel) => {
    const volumeMap = {
      high: 0.45,    // 45% (current High preset)
      medium: 0.275, // 27.5% (current Medium preset)
      low: 0.125,    // 12.5% (current Low preset)
      off: 0         // Muted
    };

    if (newLevel === 'off') {
      ambientAudio.toggleMute();
    } else {
      // Ensure not muted
      if (ambientAudio.isMuted) {
        ambientAudio.toggleMute();
      }
      // Set intensity
      ambientAudio.setIntensity(newLevel);
    }
  };

  const handleLevelChange = useCallback((newLevel) => {
    setLevel(newLevel);
    localStorage.setItem('ambientVolumeLevel', newLevel);
    applyLevel(newLevel);
    
    // Collapse after selection
    setTimeout(() => setIsExpanded(false), 300);
  }, []);

  const getLevelIcon = () => {
    switch (level) {
      case 'high': return '🔊';
      case 'medium': return '🔉';
      case 'low': return '🔈';
      case 'off': return '🔇';
      default: return '🔉';
    }
  };

  return (
    <div className={`${styles.control} ${isExpanded ? styles.expanded : ''}`}>
      {!isExpanded ? (
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(true)}
          aria-label="Ambient volume control"
          title={`Ambient: ${level.charAt(0).toUpperCase() + level.slice(1)}`}
        >
          <span className={styles.icon}>{getLevelIcon()}</span>
        </button>
      ) : (
        <div className={styles.expandedContent}>
          <div className={styles.header}>
            <span className={styles.label}>Ambient</span>
            <button
              className={styles.closeButton}
              onClick={() => setIsExpanded(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.levelButton} ${level === 'high' ? styles.active : ''}`}
              onClick={() => handleLevelChange('high')}
              title="High volume"
            >
              High
            </button>
            <button
              className={`${styles.levelButton} ${level === 'medium' ? styles.active : ''}`}
              onClick={() => handleLevelChange('medium')}
              title="Medium volume"
            >
              Med
            </button>
            <button
              className={`${styles.levelButton} ${level === 'low' ? styles.active : ''}`}
              onClick={() => handleLevelChange('low')}
              title="Low volume"
            >
              Low
            </button>
            <button
              className={`${styles.levelButton} ${level === 'off' ? styles.active : ''}`}
              onClick={() => handleLevelChange('off')}
              title="Mute ambient"
            >
              Off
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbientVolumeControl;
```

### 4. Audio System Enhancements

#### Volume Rebalancing Strategy

Current volumes (from existing code):
- Ambient: 27.5% (medium), 12.5% (low), 45% (high)
- Footsteps: ~50% (estimated from code)
- Whispers: ~40% (estimated from code)
- Scare cues: Not explicitly defined

New volumes (20% reduction ambient, increases for others):
- Ambient: 22% (medium), 10% (low), 36% (high) - **20% reduction**
- Footsteps: 70% - **40% increase**
- Whispers: 52% - **30% increase**
- Scare cues: 48% - **20% increase** (new)

```javascript
// Updated volume constants in ambientAudio.js
this.intensityVolumes = {
  low: 0.10,     // 10% (was 12.5%, -20%)
  medium: 0.22,  // 22% (was 27.5%, -20%)
  high: 0.36     // 36% (was 45%, -20%)
};
```

```javascript
// Updated footstep volume in ghostFootsteps.js
const FOOTSTEP_VOLUME = 0.70; // 70% (was ~50%, +40%)
```

```javascript
// Updated whisper volume in whisperSystem.js
const WHISPER_VOLUME = 0.52; // 52% (was ~40%, +30%)
```

```javascript
// New scare cue volume constant
const SCARE_CUE_VOLUME = 0.48; // 48% (new, +20% from baseline)
```

#### AI Voice Auto-Muting Integration

```javascript
// Enhancement to ghostVoice.js service
class GhostVoiceService {
  speak(text, preset = 'eerie') {
    // Request priority from audio manager
    audioPriority.requestPlay('tts', () => {
      // Mute ambient audio
      ambientAudio.pauseForSpeech();
      
      // Start speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      this.applyPreset(utterance, preset);
      
      // Handle speech end
      utterance.onend = () => {
        // Restore ambient audio
        ambientAudio.resumeAfterSpeech();
        audioPriority.notifyFinished('tts');
      };
      
      // Handle speech error
      utterance.onerror = () => {
        ambientAudio.resumeAfterSpeech();
        audioPriority.notifyFinished('tts');
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }
}
```

#### Audio Priority Manager Update

```javascript
// Updated priority levels in audioPriority.js
this.PRIORITY = {
  AI_VOICE: 1,    // Highest (was TTS: 2)
  FOOTSTEPS: 2,   // (was 1)
  WHISPER: 3,     // (unchanged)
  SCARE_CUE: 4,   // New
  AMBIENT: 5      // Lowest (was 4)
};
```

### 5. Visual Effects Enhancements

#### Candle Flicker Accent Animation

```css
/* candleFlicker.css */
@keyframes candleFlicker {
  0%, 100% {
    filter: brightness(0.95);
    opacity: 0.98;
  }
  10% {
    filter: brightness(1.02);
    opacity: 1;
  }
  20% {
    filter: brightness(0.97);
    opacity: 0.99;
  }
  35% {
    filter: brightness(1.05);
    opacity: 1;
  }
  50% {
    filter: brightness(0.96);
    opacity: 0.98;
  }
  65% {
    filter: brightness(1.03);
    opacity: 1;
  }
  80% {
    filter: brightness(0.98);
    opacity: 0.99;
  }
  90% {
    filter: brightness(1.01);
    opacity: 1;
  }
}

.candleFlicker {
  animation: candleFlicker 4s ease-in-out infinite;
  will-change: filter, opacity;
}

/* Apply to UI elements */
.button,
.card,
.panel,
.overlay {
  animation: candleFlicker 4s ease-in-out infinite;
}

/* Stagger animations for natural effect */
.card:nth-child(2) {
  animation-delay: 0.5s;
}

.card:nth-child(3) {
  animation-delay: 1s;
}

.card:nth-child(4) {
  animation-delay: 1.5s;
}

.card:nth-child(5) {
  animation-delay: 2s;
}
```

#### Temperature Drop Fog Overlay

```javascript
// TemperatureDropFog.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TemperatureDropFog.module.css';

const TemperatureDropFog = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Trigger on route change
    setIsActive(true);
    
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 1000); // 800-1200ms duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.fog} />
      <div className={styles.blueTint} />
    </div>
  );
};

export default TemperatureDropFog;
```

```css
/* TemperatureDropFog.module.css */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  animation: fadeInOut 1s ease-in-out;
}

.blueTint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 100, 200, 0.15) 0%,
    rgba(0, 150, 255, 0.1) 50%,
    rgba(0, 100, 200, 0.15) 100%
  );
  animation: bluePulse 1s ease-in-out;
}

.fog {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    to top,
    rgba(200, 220, 255, 0.3) 0%,
    rgba(200, 220, 255, 0.1) 50%,
    transparent 100%
  );
  animation: fogRise 1s ease-out;
  will-change: transform, opacity;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  20%, 80% {
    opacity: 1;
  }
}

@keyframes bluePulse {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fogRise {
  from {
    transform: translate3d(0, 20%, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
```

## Data Models

### Audio State Management

```javascript
// Enhanced audio state
{
  ambient: {
    level: 'high' | 'medium' | 'low' | 'off',
    volume: number,        // 0-1 range
    isMuted: boolean,
    isPlaying: boolean
  },
  priority: {
    current: 'ai_voice' | 'footsteps' | 'whisper' | 'scare_cue' | 'ambient',
    queue: Array<AudioRequest>
  },
  volumes: {
    ambient: {
      high: 0.36,
      medium: 0.22,
      low: 0.10
    },
    footsteps: 0.70,
    whispers: 0.52,
    scareCues: 0.48
  }
}
```

### Typography Configuration

```javascript
// Typography system configuration
{
  fonts: {
    spooky: ['Creepster', 'Nosifer', 'cursive'],
    body: ['Inter', 'Roboto', 'sans-serif']
  },
  sizes: {
    mainTitle: '3.4rem',
    featureTitle: '1.9rem',
    subtitle: '1.3rem',
    nav: '1.1rem',
    description: '1rem'
  },
  responsive: {
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1200px'
    }
  }
}
```

## Error Handling

### Font Loading Errors

1. **Font Load Failure**: Fallback to system cursive fonts
2. **Font Display Strategy**: Use `font-display: swap` to prevent FOIT
3. **Preload Critical Fonts**: Add `<link rel="preload">` for main font

### Audio System Errors

1. **Volume Adjustment Failures**: Log error and maintain current volume
2. **Auto-Mute Failures**: Ensure ambient resumes after timeout
3. **Priority Conflicts**: Queue audio requests instead of dropping

### Visual Effect Errors

1. **Animation Performance**: Disable effects on low-end devices
2. **CSS Support**: Provide fallbacks for unsupported properties
3. **Z-Index Conflicts**: Ensure proper layering with existing elements

## Testing Strategy

### Typography Testing

1. **Font Loading**: Verify fonts load correctly across browsers
2. **Responsive Scaling**: Test all breakpoints (320px to 1920px)
3. **Readability**: Verify line-height and letter-spacing improvements
4. **Glow Animation**: Test performance on low-end devices

### Audio Testing

1. **Volume Levels**: Verify all new volume levels are correct
2. **Auto-Muting**: Test AI voice triggers ambient mute/restore
3. **Priority System**: Test all priority combinations
4. **Crossfading**: Verify smooth transitions without pops

### UI Testing

1. **Top Controls Cluster**: Test positioning on all screen sizes
2. **Ambient Volume Control**: Test all four levels (High/Med/Low/Off)
3. **Touch Targets**: Verify 44x44px minimum on mobile
4. **Hover States**: Test all interactive elements

### Integration Testing

1. **Existing Features**: Verify no breaking changes
2. **Cursed Mode**: Test compatibility with new enhancements
3. **Routing**: Verify temperature drop on navigation
4. **Performance**: Monitor FPS and memory usage

## Performance Considerations

### Typography Optimization

1. **Font Subsetting**: Load only required characters
2. **Font Display**: Use `font-display: swap` for faster rendering
3. **Preload**: Preload critical fonts in HTML head
4. **Fallback Fonts**: Ensure similar metrics to prevent layout shift

### Audio Optimization

1. **Gain Staging**: Prevent clipping with proper gain structure
2. **Smooth Ramps**: Use `linearRampToValueAtTime` for all changes
3. **Cleanup**: Properly disconnect audio nodes when done
4. **Memory**: Monitor AudioContext memory usage

### Visual Effects Optimization

1. **GPU Acceleration**: Use only `transform` and `opacity`
2. **Will-Change**: Apply sparingly to animated elements
3. **Animation Throttling**: Limit concurrent animations
4. **Reduced Motion**: Respect `prefers-reduced-motion` media query

### Bundle Size

1. **CSS**: Minimize and compress all stylesheets
2. **Fonts**: Use woff2 format for best compression
3. **Components**: Code-split non-critical components
4. **Tree Shaking**: Remove unused code

## Responsive Design Strategy

### Breakpoints

```css
/* Mobile First Approach */
/* Base: 320px - 479px (small mobile) */
/* Tablet: 480px - 767px */
/* Desktop: 768px - 1199px */
/* Large Desktop: 1200px+ */
```

### Typography Scaling

- Main title: 1.8rem → 2.2rem → 2.8rem → 3.4rem
- Feature titles: 1.2rem → 1.4rem → 1.6rem → 1.9rem
- Subtitles: 0.9rem → 1rem → 1.1rem → 1.3rem
- Nav: 0.95rem → 1rem → 1rem → 1.1rem

### Top Controls Cluster Adaptation

- Desktop: Horizontal row with gaps
- Tablet: Horizontal row with smaller gaps
- Mobile: Vertical stack or wrapped row
- Touch targets: Minimum 44x44px on all devices

## Security Considerations

1. **Font Loading**: Use HTTPS for Google Fonts
2. **Audio Context**: Require user interaction before creating
3. **LocalStorage**: Validate stored preferences before applying
4. **CSS Injection**: Sanitize any dynamic styles

## Deployment Considerations

1. **Font Preloading**: Add to HTML head for faster load
2. **CSS Optimization**: Minify and combine stylesheets
3. **Audio Files**: Ensure proper MIME types if using files
4. **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge
5. **Mobile Testing**: Test on iOS Safari and Android Chrome

## Integration with Existing Systems

### Compatibility Matrix

| Existing Feature | Integration Point | Changes Required |
|-----------------|-------------------|------------------|
| Glitch Transitions | None | No changes |
| Cursed Mode | CSS variables | Update toggle position |
| Ambient Audio | ambientAudio.js | Update volume constants |
| Audio Priority | audioPriority.js | Add AI voice priority |
| Ghost Voice | ghostVoice.js | Add auto-mute hooks |
| Routing | App.jsx | Add temperature drop component |
| Navigation | Navigation component | Update font sizes |
| Landing Page | LandingPage.jsx | Update typography classes |

### Migration Strategy

1. **Phase 1**: Typography system (CSS variables and fonts)
2. **Phase 2**: Top controls cluster (UI reorganization)
3. **Phase 3**: Audio volume rebalancing
4. **Phase 4**: AI voice auto-muting
5. **Phase 5**: Visual effects (candle flicker, temperature drop)
6. **Phase 6**: Testing and optimization

