import { useEffect, useState, useCallback, memo } from 'react';
import styles from './ShadowFigure.module.css';

/**
 * ShadowSilhouette Component
 * Displays a tall shadow figure walking behind UI every 30 seconds
 * Requirements: 18.1, 18.2, 18.3
 */
const ShadowFigure = () => {
  const [shadows, setShadows] = useState([]);

  // Memoize showShadow to prevent recreation on every render
  const showShadow = useCallback(() => {
    let shadowCounter = 0;
    
    const createShadow = () => {
      // Random duration (4-6 seconds for walking animation)
      const duration = 4 + Math.random() * 2;
      
      // Random opacity (8-12%)
      const opacity = 0.08 + Math.random() * 0.04;
      
      // Random direction (left to right or right to left)
      const direction = Math.random() > 0.5 ? 'ltr' : 'rtl';
      
      // Random speed variation (0.9-1.1x)
      const speedVariation = 0.9 + Math.random() * 0.2;
      
      const shadowId = `shadow-${Date.now()}-${shadowCounter++}`;
      
      const newShadow = {
        id: shadowId,
        duration: duration * speedVariation,
        opacity,
        direction,
      };

      setShadows(prev => [...prev, newShadow]);

      // Remove shadow after animation completes
      setTimeout(() => {
        setShadows(prev => prev.filter(s => s.id !== shadowId));
      }, (duration * speedVariation * 1000) + 500);

      // Schedule next appearance (30 seconds)
      const nextDelay = 30000;
      return setTimeout(createShadow, nextDelay);
    };
    
    return createShadow;
  }, []);

  useEffect(() => {
    const createShadow = showShadow();
    
    // Initial delay (30 seconds after mount)
    const initialDelay = 30000;
    const timeoutId = setTimeout(createShadow, initialDelay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showShadow]);

  return (
    <>
      {shadows.map(shadow => (
        <div
          key={shadow.id}
          className={`${styles.shadowFigure} ${shadow.direction === 'rtl' ? styles.rtl : ''} candleFlicker`}
          style={{
            opacity: shadow.opacity,
            animationDuration: `${shadow.duration}s`,
          }}
          aria-hidden="true"
        >
          <svg
            className={styles.silhouette}
            viewBox="0 0 100 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <ellipse cx="50" cy="25" rx="12" ry="15" fill="currentColor" />
            
            {/* Neck */}
            <rect x="45" y="38" width="10" height="8" fill="currentColor" />
            
            {/* Torso */}
            <path
              d="M 35 46 Q 30 80, 32 120 L 32 160 L 68 160 L 68 120 Q 70 80, 65 46 Z"
              fill="currentColor"
            />
            
            {/* Left arm */}
            <path
              d="M 35 60 Q 20 70, 18 90 L 15 110 L 22 112 L 25 92 Q 28 75, 38 68 Z"
              fill="currentColor"
            />
            
            {/* Right arm */}
            <path
              d="M 65 60 Q 80 70, 82 90 L 85 110 L 78 112 L 75 92 Q 72 75, 62 68 Z"
              fill="currentColor"
            />
            
            {/* Left leg */}
            <path
              d="M 38 160 L 35 220 Q 33 250, 30 280 L 30 300 L 40 300 L 42 280 Q 44 250, 45 220 L 45 160 Z"
              fill="currentColor"
            />
            
            {/* Right leg */}
            <path
              d="M 62 160 L 65 220 Q 67 250, 70 280 L 70 300 L 60 300 L 58 280 Q 56 250, 55 220 L 55 160 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </>
  );
};

// Memoize component since it has no props and manages its own state
export default memo(ShadowFigure);
