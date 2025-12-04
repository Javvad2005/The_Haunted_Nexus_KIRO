import { useEffect, useState } from 'react';
import styles from './GhostIntro.module.css';

const GhostIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('approaching'); // approaching, glitch, fadeOut, complete
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      setPhase('glitch');
    }, 2800);

    const fadeOutTimer = setTimeout(() => {
      setPhase('fadeOut');
    }, 3500);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setPhase('complete');
      if (onComplete) onComplete();
    }, 4000); // Extra 500ms for fade out

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.introOverlay} ${phase === 'fadeOut' ? styles.fadeOut : ''}`}>
      <div className={styles.fogParallax}>
        <div className={styles.fogLayer1}></div>
        <div className={styles.fogLayer2}></div>
        <div className={styles.fogLayer3}></div>
      </div>
      
      {phase === 'approaching' && (
        <div className={styles.ghostSilhouette}>
          {/* Shadow beneath ghost */}
          <div className={styles.ghostShadow}></div>
          
          {/* Fog around ghost */}
          <div className={styles.ghostFog}></div>
          
          <svg viewBox="0 0 300 400" className={styles.ghostSvg}>
            <defs>
              {/* Lantern glow gradient */}
              <radialGradient id="lanternGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255, 200, 100, 0.9)" />
                <stop offset="40%" stopColor="rgba(255, 150, 50, 0.5)" />
                <stop offset="100%" stopColor="rgba(255, 100, 0, 0)" />
              </radialGradient>
              
              {/* Purple eye glow */}
              <radialGradient id="eyeGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                <stop offset="30%" stopColor="rgba(176, 38, 255, 0.9)" />
                <stop offset="100%" stopColor="rgba(176, 38, 255, 0)" />
              </radialGradient>
              
              {/* Ethereal glow filter */}
              <filter id="etherealGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Strong glow filter */}
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Lantern light glow (large ambient) */}
            <circle 
              cx="200" 
              cy="220" 
              r="90" 
              fill="url(#lanternGlow)" 
              className={styles.lanternGlow}
              opacity="0.5"
            />
            
            {/* Ghost main body - ethereal flowing robe with irregular silhouette */}
            <path
              d="M150 60 Q110 80 105 140 Q100 180 105 220 L105 300 Q112 312 120 305 Q128 298 135 308 Q142 318 150 308 Q158 298 165 308 Q172 318 180 305 Q188 298 195 300 L195 220 Q200 180 195 140 Q190 80 150 60 Z"
              fill="rgba(200, 200, 230, 0.25)"
              className={styles.ghostBody}
              filter="url(#etherealGlow)"
            />
            
            {/* Hooded/hollow head area - no face details */}
            <path
              d="M150 60 Q130 70 125 90 Q120 110 125 130 Q130 145 150 150 Q170 145 175 130 Q180 110 175 90 Q170 70 150 60 Z"
              fill="rgba(200, 200, 230, 0.3)"
              className={styles.ghostHood}
              filter="url(#etherealGlow)"
            />
            
            {/* Inner hood darkness */}
            <ellipse
              cx="150"
              cy="105"
              rx="25"
              ry="30"
              fill="rgba(20, 20, 40, 0.6)"
              className={styles.hoodDarkness}
            />
            
            {/* Hollow glowing eyes - no pupils, just glow */}
            <ellipse 
              cx="140" 
              cy="100" 
              rx="6" 
              ry="8" 
              fill="url(#eyeGlow)" 
              className={styles.ghostEyeCore}
              filter="url(#strongGlow)"
            />
            <ellipse 
              cx="160" 
              cy="100" 
              rx="6" 
              ry="8" 
              fill="url(#eyeGlow)" 
              className={styles.ghostEyeCore}
              filter="url(#strongGlow)"
            />
            
            {/* Eye glow halos */}
            <circle cx="140" cy="100" r="12" fill="rgba(176, 38, 255, 0.3)" className={styles.ghostEyeGlow} />
            <circle cx="160" cy="100" r="12" fill="rgba(176, 38, 255, 0.3)" className={styles.ghostEyeGlow} />
            
            {/* Cloth ripple edges - supernatural fabric effect */}
            <path
              d="M105 300 Q112 308 120 303 Q128 298 135 306 Q142 314 150 306 Q158 298 165 306 Q172 314 180 303 Q188 298 195 300"
              fill="none"
              stroke="rgba(180, 180, 220, 0.4)"
              strokeWidth="2"
              className={styles.clothEdge1}
            />
            <path
              d="M107 280 Q114 288 122 283 Q130 278 137 286 Q144 294 152 286 Q160 278 167 286 Q174 294 182 283 Q190 278 193 280"
              fill="none"
              stroke="rgba(180, 180, 220, 0.3)"
              strokeWidth="1.5"
              className={styles.clothEdge2}
            />
            <path
              d="M109 260 Q116 268 124 263 Q132 258 139 266 Q146 274 154 266 Q162 258 169 266 Q176 274 184 263 Q192 258 191 260"
              fill="none"
              stroke="rgba(180, 180, 220, 0.25)"
              strokeWidth="1"
              className={styles.clothEdge3}
            />
            
            {/* Flowing cloth extension holding lantern - no arm/hand */}
            <path
              d="M150 150 Q165 170 180 190 Q190 205 195 215"
              stroke="rgba(200, 200, 230, 0.25)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className={styles.clothExtension}
              filter="url(#etherealGlow)"
            />
            
            {/* Wispy cloth tendrils */}
            <path
              d="M180 190 Q185 195 188 205"
              stroke="rgba(200, 200, 230, 0.2)"
              strokeWidth="3"
              fill="none"
              className={styles.clothTendril1}
            />
            <path
              d="M185 195 Q192 200 195 210"
              stroke="rgba(200, 200, 230, 0.15)"
              strokeWidth="2"
              fill="none"
              className={styles.clothTendril2}
            />
            
            {/* Small antique lantern floating near cloth */}
            <rect
              x="190"
              y="210"
              width="14"
              height="22"
              rx="1"
              fill="rgba(70, 50, 30, 0.8)"
              stroke="rgba(110, 90, 70, 0.9)"
              strokeWidth="1.5"
              className={styles.lanternFrame}
            />
            
            {/* Lantern top handle */}
            <path
              d="M190 210 L194 202 Q197 200 200 202 L204 210"
              fill="none"
              stroke="rgba(110, 90, 70, 0.9)"
              strokeWidth="1.5"
              className={styles.lanternTop}
            />
            
            {/* Lantern flame - animated flicker */}
            <ellipse
              cx="197"
              cy="221"
              rx="4"
              ry="7"
              fill="rgba(255, 200, 100, 0.95)"
              className={styles.lanternFlame}
              filter="url(#etherealGlow)"
            />
            
            {/* Flame inner bright core */}
            <ellipse
              cx="197"
              cy="221"
              rx="2.5"
              ry="5"
              fill="rgba(255, 255, 220, 1)"
              className={styles.flameCore}
            />
            
            {/* Lantern light rays */}
            <line x1="197" y1="221" x2="235" y2="205" stroke="rgba(255, 200, 100, 0.4)" strokeWidth="2" className={styles.lightRay1} />
            <line x1="197" y1="221" x2="245" y2="221" stroke="rgba(255, 200, 100, 0.4)" strokeWidth="2" className={styles.lightRay2} />
            <line x1="197" y1="221" x2="235" y2="237" stroke="rgba(255, 200, 100, 0.4)" strokeWidth="2" className={styles.lightRay3} />
          </svg>
          
          {/* Screen brightness overlay from lantern */}
          <div className={styles.lanternBrightness}></div>
        </div>
      )}

      {phase === 'glitch' && (
        <div className={styles.glitchFlash}></div>
      )}
    </div>
  );
};

export default GhostIntro;
