import React, { useEffect, useState } from 'react';
import styles from './BloodSmear.module.css';

/**
 * BloodSmear Component
 * Displays a blood smear animation with red tint and static distortion
 * Used for Cursed Mode transitions and Reanimator in Cursed Mode
 */
const BloodSmear = ({ isActive, onComplete }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      
      // Remove after animation completes (300ms)
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onComplete) {
          onComplete();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className={styles.bloodSmear} aria-hidden="true">
      <div className={styles.smearLayer}></div>
      <div className={styles.staticOverlay}></div>
    </div>
  );
};

export default BloodSmear;
