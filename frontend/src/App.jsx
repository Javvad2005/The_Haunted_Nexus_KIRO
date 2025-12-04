import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import FogOverlay from './components/FogOverlay'
import CursorTrail from './components/CursorTrail'
import TopControlsCluster from './components/TopControlsCluster'
import CursedModeToggle from './components/CursedModeToggle'
import AmbienceMuteButton from './components/AmbienceMuteButton'
import AmbientVolumeControl from './components/AmbientVolumeControl'
import IntensitySelector from './components/IntensitySelector'
import LoadingSpinner from './components/LoadingSpinner'
import GlitchTransition from './components/GlitchTransition'
import ShadowFigure from './components/ShadowFigure' // Enhancement G
import TemperatureDrop from './components/TemperatureDrop' // Task 24
import TemperatureDropFog from './components/TemperatureDropFog' // Task 11: Route navigation fog effect
import SpookySpider from './components/SpookySpider'
import SpookyBats from './components/SpookyBats'
import FallingSkeletons from './components/FallingSkeletons'
import HauntedForest from './components/HauntedForest' // Haunted forest background
// import ambientAudio from './services/ambientAudio' // REMOVED: Ambient sounds disabled
// import ghostFootsteps from './services/ghostFootsteps' // REMOVED: Footsteps disabled
import voiceGreeting from './services/voiceGreeting' // Voice greetings for each page
import introAudio from './services/introAudio' // Intro audio on page load
import './services/visualEffects' // Enhancement E-J
import styles from './App.module.css'

// Lazy load page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const GhostChat = lazy(() => import('./pages/GhostChat'))
const HauntedJournal = lazy(() => import('./pages/HauntedJournal'))
const Reanimator = lazy(() => import('./pages/Reanimator'))
const FrankensteinStitcher = lazy(() => import('./pages/FrankensteinStitcher'))
const HauntedMap = lazy(() => import('./pages/HauntedMap'))
const CursedAtelier = lazy(() => import('./pages/CursedAtelier'))

// Component to handle ambient audio and glitch transitions based on route
function RouteController({ onRouteChange }) {
  const location = useLocation();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // Detect if this is a page reload (first mount)
    const isPageReload = isFirstMount;
    
    // Skip glitch on first mount (initial page load)
    if (isFirstMount) {
      setIsFirstMount(false);
    } else {
      // Trigger glitch transition on route change
      onRouteChange();
    }

    // Stop previous audio
    // ambientAudio.stop(); // REMOVED: Ambient sounds disabled
    // ghostFootsteps.stop(); // REMOVED: Footsteps disabled

    // Play voice greeting for this page
    // Pass isPageReload flag to allow homepage greeting on reload
    voiceGreeting.playGreeting(location.pathname, isPageReload);

    // All audio removed - ambient sounds and footsteps disabled
    // switch (location.pathname) {
    //   case '/ghost-chat':
    //     ghostFootsteps.start();
    //     break;
    //   case '/haunted-journal':
    //     ghostFootsteps.start();
    //     break;
    //   case '/haunted-map':
    //     ghostFootsteps.start();
    //     break;
    //   case '/cursed-atelier':
    //     ghostFootsteps.start();
    //     break;
    //   default:
    //     break;
    // }

    return () => {
      // ambientAudio.stop(); // REMOVED: Ambient sounds disabled
      // ghostFootsteps.stop(); // REMOVED: Footsteps disabled
    };
  }, [location.pathname, onRouteChange, isFirstMount]);

  return null;
}

function App() {
  const [showGlitch, setShowGlitch] = useState(false);

  // Play intro audio on mount
  useEffect(() => {
    const playIntro = async () => {
      const started = await introAudio.play();
      if (!started) {
        console.log('🎵 Intro audio will play after user interaction');
        // Add click listener to start intro on first user interaction
        const startOnInteraction = () => {
          introAudio.play();
          document.removeEventListener('click', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
      }
    };
    
    playIntro();
    
    return () => {
      introAudio.stop();
    };
  }, []);

  const handleRouteChange = () => {
    // Debounce to prevent double-trigger (600ms)
    const now = Date.now();
    if (now - (window.lastGlitchTime || 0) < 600) {
      return;
    }
    window.lastGlitchTime = now;
    
    setShowGlitch(true);
    
    // Auto-remove after 440ms (420ms animation + 20ms buffer)
    setTimeout(() => {
      setShowGlitch(false);
    }, 440);
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
  };

  // Determine glitch intensity based on cursed mode
  const isCursedMode = document.body.classList.contains('cursed-mode');
  const glitchIntensity = isCursedMode ? 'high' : 'medium';

  return (
    <Router>
      <HauntedForest /> {/* Haunted dark spooky forest background */}
      <Navigation />
      <FogOverlay intensity="medium" />
      <CursorTrail />
      <TopControlsCluster>
        <AmbientVolumeControl />
      </TopControlsCluster>
      <CursedModeToggle />
      <SpookySpider />
      <SpookyBats />
      <FallingSkeletons />
      <ShadowFigure /> {/* Enhancement G: Shadow figure passing */}
      <TemperatureDrop /> {/* Task 24: Paranormal temperature drop */}
      <TemperatureDropFog /> {/* Task 11: Temperature drop fog on navigation */}
      <RouteController onRouteChange={handleRouteChange} />
      <GlitchTransition
        isActive={showGlitch}
        duration={420}
        intensity={glitchIntensity}
        onComplete={handleGlitchComplete}
      />
      <div className={styles.app}>
        <Suspense fallback={<LoadingSpinner message="Summoning the spirits..." size="large" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/ghost-chat" element={<GhostChat />} />
            <Route path="/haunted-journal" element={<HauntedJournal />} />
            <Route path="/reanimator" element={<Reanimator />} />
            <Route path="/frankenstein-stitcher" element={<FrankensteinStitcher />} />
            <Route path="/haunted-map" element={<HauntedMap />} />
            <Route path="/cursed-atelier" element={<CursedAtelier />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
