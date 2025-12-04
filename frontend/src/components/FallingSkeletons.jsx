import { useState, useEffect } from 'react';
import styles from './FallingSkeletons.module.css';

const FallingSkeletons = () => {
  const [skeletons, setSkeletons] = useState([]);

  useEffect(() => {
    const createSkeletonSet = () => {
      const timestamp = Date.now();
      
      // Create 3 skeletons: left, right, middle
      const newSkeletons = [
        { id: timestamp + 1, position: 15 + Math.random() * 10, zone: 'left' },
        { id: timestamp + 2, position: 45 + Math.random() * 10, zone: 'middle' },
        { id: timestamp + 3, position: 75 + Math.random() * 10, zone: 'right' }
      ];

      setSkeletons(prev => [...prev, ...newSkeletons]);

      // Remove skeletons after animation (5 seconds)
      setTimeout(() => {
        setSkeletons(prev => prev.filter(s => 
          s.id !== timestamp + 1 && s.id !== timestamp + 2 && s.id !== timestamp + 3
        ));
      }, 5000);
    };

    // First set after 3 seconds
    const initialTimeout = setTimeout(createSkeletonSet, 3000);

    // Create new set every 25 seconds
    const interval = setInterval(createSkeletonSet, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.skeletonsContainer}>
      {skeletons.map(skeleton => (
        <div
          key={skeleton.id}
          className={styles.skeleton}
          style={{ left: `${skeleton.position}%` }}
        >
          <svg width="60" height="100" viewBox="0 0 60 100" className={styles.skeletonSvg}>
            {/* Skull */}
            <ellipse cx="30" cy="15" rx="12" ry="14" fill="#E8E8E8" />
            {/* Eye sockets */}
            <ellipse cx="25" cy="13" rx="3" ry="4" fill="#000000" />
            <ellipse cx="35" cy="13" rx="3" ry="4" fill="#000000" />
            {/* Nose hole */}
            <path d="M28 18 L30 20 L32 18 Z" fill="#000000" />
            {/* Jaw */}
            <path d="M20 22 Q30 26 40 22" stroke="#000000" strokeWidth="1" fill="none" />
            
            {/* Spine/Ribcage */}
            <line x1="30" y1="29" x2="30" y2="55" stroke="#E8E8E8" strokeWidth="3" />
            {/* Ribs */}
            <path d="M30 32 Q25 34 22 32" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            <path d="M30 32 Q35 34 38 32" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            <path d="M30 38 Q24 40 20 38" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            <path d="M30 38 Q36 40 40 38" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            <path d="M30 44 Q24 46 20 44" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            <path d="M30 44 Q36 46 40 44" stroke="#E8E8E8" strokeWidth="2" fill="none" />
            
            {/* Pelvis */}
            <ellipse cx="30" cy="58" rx="10" ry="6" fill="none" stroke="#E8E8E8" strokeWidth="2" />
            
            {/* Left arm */}
            <line x1="28" y1="32" x2="18" y2="45" stroke="#E8E8E8" strokeWidth="2" />
            <line x1="18" y1="45" x2="15" y2="58" stroke="#E8E8E8" strokeWidth="2" />
            {/* Left hand */}
            <circle cx="15" cy="60" r="2" fill="#E8E8E8" />
            
            {/* Right arm */}
            <line x1="32" y1="32" x2="42" y2="45" stroke="#E8E8E8" strokeWidth="2" />
            <line x1="42" y1="45" x2="45" y2="58" stroke="#E8E8E8" strokeWidth="2" />
            {/* Right hand */}
            <circle cx="45" cy="60" r="2" fill="#E8E8E8" />
            
            {/* Left leg */}
            <line x1="25" y1="62" x2="22" y2="85" stroke="#E8E8E8" strokeWidth="2" />
            <line x1="22" y1="85" x2="20" y2="95" stroke="#E8E8E8" strokeWidth="2" />
            {/* Left foot */}
            <ellipse cx="18" cy="96" rx="3" ry="2" fill="#E8E8E8" />
            
            {/* Right leg */}
            <line x1="35" y1="62" x2="38" y2="85" stroke="#E8E8E8" strokeWidth="2" />
            <line x1="38" y1="85" x2="40" y2="95" stroke="#E8E8E8" strokeWidth="2" />
            {/* Right foot */}
            <ellipse cx="42" cy="96" rx="3" ry="2" fill="#E8E8E8" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingSkeletons;
