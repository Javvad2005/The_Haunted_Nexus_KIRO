import { useEffect, useState, useCallback, memo } from 'react';
import styles from './TemperatureDrop.module.css';
import ambientAudio from '../services/ambientAudio';

/**
 * TemperatureDrop Component
 * Creates a paranormal temperature drop effect with blue desaturation,
 * rising fog, edge condensation, and mild slow-motion
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7
 */
const TemperatureDrop = () => {
  const [drops, setDrops] = useState([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isIdle, setIsIdle] = useState(false);

  // Trigger a temperature drop effect
  const triggerDrop = useCallback(() => {
    const dropId = `drop-${Date.now()}-${Math.random()}`;
    const duration = 3000; // 3 seconds effect

    const newDrop = {
      id: dropId,
      duration,
    };

    setDrops(prev => [...prev, newDrop]);

    // Requirement 20.6: Increase wind volume by 10% if ambient audio is not muted
    // Check if ambient is muted before adjusting wind
    const currentVolume = ambientAudio.getVolume();
    
    if (currentVolume > 0 && !ambientAudio.isMuted) {
      // Calculate target volume (10% increase)
      const targetVolume = Math.min(1, currentVolume * 1.1);
      
      // Smoothly fade wind volume up using the audio context
      if (ambientAudio.audioContext && ambientAudio.gainNode) {
        const now = ambientAudio.audioContext.currentTime;
        
        // Cancel any scheduled changes
        ambientAudio.gainNode.gain.cancelScheduledValues(now);
        
        // Smooth ramp to increased volume over 300ms
        ambientAudio.gainNode.gain.setValueAtTime(currentVolume, now);
        ambientAudio.gainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.3);
        
        // Restore original volume after effect with smooth fade
        setTimeout(() => {
          if (ambientAudio.audioContext && ambientAudio.gainNode && !ambientAudio.isMuted) {
            const restoreTime = ambientAudio.audioContext.currentTime;
            
            // Cancel any scheduled changes
            ambientAudio.gainNode.gain.cancelScheduledValues(restoreTime);
            
            // Smooth ramp back to original volume over 500ms
            ambientAudio.gainNode.gain.setValueAtTime(
              ambientAudio.gainNode.gain.value, 
              restoreTime
            );
            ambientAudio.gainNode.gain.linearRampToValueAtTime(
              currentVolume, 
              restoreTime + 0.5
            );
          }
        }, duration);
      }
    }

    // Remove drop after effect completes
    setTimeout(() => {
      setDrops(prev => prev.filter(d => d.id !== dropId));
    }, duration + 500);
  }, []);

  // Idle detection system - 5 seconds of no user interaction
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsIdle(false);
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Check for idle state every second
    const idleCheckInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= 5000 && !isIdle) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(idleCheckInterval);
    };
  }, [lastActivity, isIdle]);

  // Trigger temperature drop on idle
  useEffect(() => {
    if (isIdle) {
      // Random chance (30%) to trigger on idle
      if (Math.random() < 0.3) {
        triggerDrop();
      }
      setIsIdle(false); // Reset idle state after potential trigger
    }
  }, [isIdle, triggerDrop]);

  // Random temperature drops (every 30-60 seconds)
  useEffect(() => {
    let timeoutId;

    const scheduleNextDrop = () => {
      const nextDelay = 30000 + Math.random() * 30000;
      timeoutId = setTimeout(() => {
        triggerDrop();
        scheduleNextDrop();
      }, nextDelay);
    };

    // Initial delay (20-40 seconds after mount)
    const initialDelay = 20000 + Math.random() * 20000;
    timeoutId = setTimeout(() => {
      triggerDrop();
      scheduleNextDrop();
    }, initialDelay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [triggerDrop]);

  // Listen for cursed mode events
  useEffect(() => {
    const handleCursedEvent = () => {
      // Trigger temperature drop on cursed mode activation
      triggerDrop();
    };

    // Listen for cursed mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasCursedMode = document.body.classList.contains('cursed-mode');
          const hadCursedMode = mutation.oldValue?.includes('cursed-mode');
          
          // Trigger when entering cursed mode
          if (hasCursedMode && !hadCursedMode) {
            handleCursedEvent();
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });

    return () => observer.disconnect();
  }, [triggerDrop]);

  return (
    <>
      {drops.map(drop => (
        <div
          key={drop.id}
          className={styles.temperatureDrop}
          style={{
            animationDuration: `${drop.duration}ms`,
          }}
          aria-hidden="true"
        >
          {/* Blue desaturation overlay */}
          <div className={styles.blueOverlay}></div>
          
          {/* Rising fog layers */}
          <div className={styles.risingFog}>
            <div className={styles.fogParticle1}></div>
            <div className={styles.fogParticle2}></div>
            <div className={styles.fogParticle3}></div>
          </div>
          
          {/* Edge condensation effect */}
          <div className={styles.condensation}></div>
        </div>
      ))}
    </>
  );
};

// Memoize component since it has no props and manages its own state
export default memo(TemperatureDrop);
