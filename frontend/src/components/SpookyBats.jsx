import { useState, useEffect } from 'react';
import styles from './SpookyBats.module.css';

const SpookyBats = () => {
  const [bats, setBats] = useState([]);

  useEffect(() => {
    const createBat = () => {
      const id = Date.now() + Math.random();
      const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
      const verticalPosition = 10 + Math.random() * 60; // 10-70% from top
      const duration = 8 + Math.random() * 4; // 8-12 seconds to cross

      const newBat = {
        id,
        direction,
        verticalPosition,
        duration
      };

      setBats(prev => [...prev, newBat]);

      // Remove bat after animation completes
      setTimeout(() => {
        setBats(prev => prev.filter(b => b.id !== id));
      }, duration * 1000);
    };

    // Create bat group (2-4 bats close together)
    const createBatGroup = () => {
      const groupSize = 2 + Math.floor(Math.random() * 3); // 2-4 bats
      for (let i = 0; i < groupSize; i++) {
        setTimeout(createBat, i * 300); // 300ms apart
      }
    };
    
    // Pattern: single bat, wait, group, wait, single, wait, group
    const batPattern = () => {
      // Single bat
      createBat();
      
      // Group after 4-6 seconds
      setTimeout(createBatGroup, 4000 + Math.random() * 2000);
      
      // Single bat after 8-10 seconds
      setTimeout(createBat, 8000 + Math.random() * 2000);
      
      // Group after 12-15 seconds
      setTimeout(createBatGroup, 12000 + Math.random() * 3000);
      
      // Repeat pattern every 18 seconds
      setTimeout(batPattern, 18000);
    };
    
    // Start first pattern immediately
    batPattern();

    return () => {
      // Cleanup handled by pattern timeouts
    };
  }, []);

  return (
    <div className={styles.batsContainer}>
      {bats.map(bat => (
        <div
          key={bat.id}
          className={`${styles.bat} ${styles[bat.direction]}`}
          style={{
            top: `${bat.verticalPosition}%`,
            animationDuration: `${bat.duration}s`
          }}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" className={styles.batSvg}>
            {/* Bat body */}
            <path
              d="M20 15 Q15 10, 10 12 Q8 14, 5 12 Q2 10, 0 15 L5 20 Q10 18, 15 20 L20 25 L25 20 Q30 18, 35 20 L40 15 Q38 10, 35 12 Q32 14, 30 12 Q25 10, 20 15 Z"
              fill="#000000"
            />
            {/* Left wing */}
            <path
              d="M10 12 Q5 8, 2 10 Q0 12, 0 15 Q2 13, 5 12 Q8 14, 10 12 Z"
              fill="#000000"
            />
            {/* Right wing */}
            <path
              d="M30 12 Q35 8, 38 10 Q40 12, 40 15 Q38 13, 35 12 Q32 14, 30 12 Z"
              fill="#000000"
            />
            {/* Glowing left eye */}
            <circle cx="17" cy="14" r="1.5" className={styles.batEye} />
            {/* Glowing right eye */}
            <circle cx="23" cy="14" r="1.5" className={styles.batEye} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default SpookyBats;
