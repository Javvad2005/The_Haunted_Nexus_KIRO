# The Haunted Nexus - Design Document

## Design Philosophy

The Haunted Nexus embraces a dark, atmospheric aesthetic that balances spooky elements with usability. The design creates an immersive Halloween experience while maintaining accessibility and user-friendliness.

## Visual Design

### Color Palette

#### Primary Colors
- **Background**: `#0a0a0a` (Deep black)
- **Surface**: `#1a1a1a` (Dark gray)
- **Accent**: `#ff6b35` (Haunted orange)
- **Secondary**: `#8b5cf6` (Mystic purple)

#### Semantic Colors
- **Success**: `#10b981` (Ghostly green)
- **Warning**: `#f59e0b` (Pumpkin orange)
- **Error**: `#ef4444` (Blood red)
- **Info**: `#3b82f6` (Spirit blue)

#### Text Colors
- **Primary**: `#e5e5e5` (Light gray)
- **Secondary**: `#a0a0a0` (Medium gray)
- **Muted**: `#666666` (Dark gray)

### Typography

#### Font Stack
```css
font-family: 'Creepster', 'Nosifer', 'Courier New', monospace;
```

#### Type Scale
- **Display**: 3.5rem (56px) - Page titles
- **H1**: 2.5rem (40px) - Section headers
- **H2**: 2rem (32px) - Subsections
- **H3**: 1.5rem (24px) - Card titles
- **Body**: 1rem (16px) - Main content
- **Small**: 0.875rem (14px) - Captions

### Spacing System

Based on 8px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Component Design

### Navigation
- Fixed top navigation bar
- Haunted logo/title
- Feature links
- Volume controls
- Cursed mode toggle

### Cards
- Dark background with subtle border
- Hover effects (glow, lift)
- Rounded corners (8px)
- Shadow depth
- Icon + title + description layout

### Buttons
- Primary: Orange gradient
- Secondary: Purple outline
- Ghost: Transparent with border
- Hover: Glow effect
- Active: Scale down slightly

### Forms
- Dark input backgrounds
- Glowing focus states
- Error states with red glow
- Placeholder text in muted color
- Submit buttons with hover effects

### Modals/Popups
- Centered overlay
- Backdrop blur
- Fade in/out animations
- Close button (X)
- Warning popup on entry

## Layout Structure

### Grid System
- 12-column grid
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Page Layouts

#### Landing Page
```
┌─────────────────────────┐
│      Navigation         │
├─────────────────────────┤
│      Hero Section       │
│   (Title + Tagline)     │
├─────────────────────────┤
│   Feature Grid (2x3)    │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │ 👻 │ │ 📖 │ │ ⚡ │  │
│  └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │ 🧪 │ │ 🗺️ │ │ 📸 │  │
│  └────┘ └────┘ └────┘  │
├─────────────────────────┤
│       Footer            │
└─────────────────────────┘
```

#### Feature Pages
```
┌─────────────────────────┐
│      Navigation         │
├─────────────────────────┤
│    Feature Header       │
├─────────────────────────┤
│                         │
│   Main Content Area     │
│   (Feature Specific)    │
│                         │
├─────────────────────────┤
│    Controls/Actions     │
└─────────────────────────┘
```

## Animation & Effects

### Transitions
- Page transitions: 300ms ease
- Hover effects: 200ms ease
- Modal animations: 400ms ease-out
- Loading states: Pulse animation

### Visual Effects
1. **Fog Overlay**: Subtle moving fog
2. **Glitch Effect**: Random screen glitches
3. **Shadow Figures**: Passing shadows
4. **Temperature Drop**: Frost effect
5. **Blood Drips**: Animated blood
6. **Cursor Trail**: Ghost trail
7. **Candle Flicker**: Light variations

### Effect Intensity Levels
- **Low**: Minimal effects, better performance
- **Medium**: Balanced effects
- **High**: Full spooky experience

## Responsive Design

### Mobile (< 640px)
- Single column layout
- Stacked navigation
- Touch-friendly buttons (min 44px)
- Simplified effects
- Reduced animations

### Tablet (640px - 1024px)
- 2-column grid
- Collapsible navigation
- Medium effects
- Optimized images

### Desktop (> 1024px)
- 3-column grid
- Full navigation
- All effects enabled
- High-res images

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratios > 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Alt text for images
- ARIA labels where needed

### Features
- Skip to content link
- Semantic HTML
- Proper heading hierarchy
- Form labels
- Error messages
- Loading states

## Dark Mode

The entire app uses a dark theme by default, optimized for:
- Reduced eye strain
- Halloween atmosphere
- Better contrast for effects
- Energy efficiency (OLED screens)

## Iconography

### Icon Style
- Line icons with 2px stroke
- Emoji for feature cards
- Custom SVG for special elements
- Consistent sizing (24px default)

### Icon Usage
- 👻 Ghost Chat
- 📖 Haunted Journal
- ⚡ Reanimator
- 🧪 Frankenstein Stitcher
- 🗺️ Haunted Map
- 📸 Cursed Atelier

## Audio Design

### Sound Categories
1. **Ambient**: Background music, wind, rain
2. **Effects**: Footsteps, thunder, whispers
3. **Voice**: Ghost speech synthesis
4. **UI**: Button clicks, transitions

### Audio Controls
- Master volume slider
- Ambient volume control
- Mute toggle
- Individual effect volumes

## Interaction Design

### Hover States
- Cards: Lift + glow
- Buttons: Brighten + scale
- Links: Underline + color change
- Images: Zoom + overlay

### Click/Tap Feedback
- Scale down (0.95)
- Ripple effect
- Sound effect (optional)
- Visual confirmation

### Loading States
- Skeleton screens
- Spinner animations
- Progress indicators
- Optimistic UI updates

## Error Handling

### Error Display
- Toast notifications
- Inline form errors
- Error boundaries
- Fallback UI

### Error Messages
- Clear, user-friendly language
- Actionable suggestions
- Retry options
- Contact support link

## Performance Considerations

### Optimization
- Lazy load images
- Code splitting
- CSS modules
- Debounced inputs
- Throttled scroll events

### Loading Strategy
- Critical CSS inline
- Defer non-critical JS
- Preload fonts
- Optimize images
- Cache static assets

## Brand Identity

### Logo
- Haunted Nexus wordmark
- Ghost icon
- Orange/purple color scheme

### Tagline
"Where AI meets the supernatural... Enter if you dare."

### Voice & Tone
- Spooky but playful
- Mysterious yet welcoming
- Dark humor
- Engaging storytelling

## Design Tokens

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(255, 107, 53, 0.5);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Z-Index Scale
```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-modal: 1300;
--z-popover: 1400;
--z-tooltip: 1500;
```

## Future Design Considerations

### Potential Additions
- Light mode option
- Custom themes
- User-selectable color schemes
- More animation options
- Advanced accessibility settings
- Customizable intensity per effect
- Theme marketplace

### Design System
- Component library
- Design tokens
- Pattern library
- Style guide
- Figma/Sketch files
