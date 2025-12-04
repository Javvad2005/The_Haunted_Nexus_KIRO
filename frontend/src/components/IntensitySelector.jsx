import React, { useState, useEffect, useCallback, memo } from 'react';
import styles from './IntensitySelector.module.css';
import ambientAudio from '../services/ambientAudio';

/**
 * IntensitySelector Component
 * Allows users to select ambient audio intensity: Low / Medium / High
 * Collapses after selection
 */
const IntensitySelector = () => {
  const [intensity, setIntensity] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Get current intensity from service
    const currentIntensity = ambientAudio.getIntensity();
    setIntensity(currentIntensity);
  }, []);

  const handleIntensityChange = useCallback((level) => {
    setIntensity(level);
    ambientAudio.setIntensity(level);
    
    // Hide after selection with a small delay for visual feedback
    setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const getIntensityLabel = useCallback(() => {
    return intensity.charAt(0).toUpperCase() + intensity.slice(1);
  }, [intensity]);

  return (
    <div className={`${styles.intensitySelector} ${isExpanded ? styles.expanded : ''}`}>
      {!isExpanded ? (
        <button 
          className={styles.toggleButton}
          onClick={toggleExpanded}
          aria-label="Open intensity selector"
          title={`Current: ${getIntensityLabel()}`}
        >
          <span className={styles.icon}>🎚️</span>
          <span className={styles.currentLevel}>{getIntensityLabel()}</span>
        </button>
      ) : (
        <>
          <div className={styles.header}>
            <label className={styles.label}>Ambient Intensity</label>
            <button 
              className={styles.closeButton}
              onClick={toggleExpanded}
              aria-label="Close intensity selector"
            >
              ✕
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${intensity === 'low' ? styles.active : ''}`}
              onClick={() => handleIntensityChange('low')}
              aria-label="Low intensity"
              title="Low (10-15%)"
            >
              Low
            </button>
            <button
              className={`${styles.button} ${intensity === 'medium' ? styles.active : ''}`}
              onClick={() => handleIntensityChange('medium')}
              aria-label="Medium intensity"
              title="Medium (25-30%)"
            >
              Medium
            </button>
            <button
              className={`${styles.button} ${intensity === 'high' ? styles.active : ''}`}
              onClick={() => handleIntensityChange('high')}
              aria-label="High intensity"
              title="High (40-50%)"
            >
              High
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Memoize component since it manages its own state
export default memo(IntensitySelector);
