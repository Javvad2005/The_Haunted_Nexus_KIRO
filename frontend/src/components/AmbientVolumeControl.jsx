import { useState, useEffect } from 'react';
import introAudio from '../services/introAudio';
import voiceGreeting from '../services/voiceGreeting';
import ghostVoice from '../services/ghostVoice';
import styles from './AmbientVolumeControl.module.css';

const AmbientVolumeControl = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('medium');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load saved preference
    const savedLevel = localStorage.getItem('masterVolume') || 'medium';
    setCurrentLevel(savedLevel);
    
    // Apply saved volume level to ALL audio sources
    if (savedLevel !== 'off') {
      const volumeMap = {
        low: 0.3,
        medium: 0.6,
        high: 1.0
      };
      const volume = volumeMap[savedLevel] || 0.6;
      
      // Set volume for background music (reduced to 25% of master)
      introAudio.setVolume(volume * 0.25);
      
      // Set volume for voice greetings and TTS (increased to 120% of master, capped at 1.0)
      const voiceVolume = Math.min(volume * 1.2, 1.0);
      voiceGreeting.setMasterVolume(voiceVolume);
      ghostVoice.setMasterVolume(voiceVolume);
    }
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const setLevel = (level) => {
    if (level === 'off') {
      // Pause all audio
      introAudio.pause();
      voiceGreeting.setMasterVolume(0);
      ghostVoice.setMasterVolume(0);
      setCurrentLevel('off');
      setIsMuted(true);
      localStorage.setItem('masterVolume', 'off');
    } else {
      // Resume if currently paused
      if (isMuted || currentLevel === 'off') {
        introAudio.resume();
        setIsMuted(false);
      }
      
      // Set master volume level for ALL audio
      const volumeMap = {
        low: 0.3,    // 30% master volume
        medium: 0.6, // 60% master volume
        high: 1.0    // 100% master volume
      };
      const volume = volumeMap[level];
      
      // Apply to all audio sources
      introAudio.setVolume(volume * 0.25); // Music at 25% of master (reduced)
      
      // Voice at 120% of master, capped at 1.0 (increased)
      const voiceVolume = Math.min(volume * 1.2, 1.0);
      voiceGreeting.setMasterVolume(voiceVolume);
      ghostVoice.setMasterVolume(voiceVolume);
      
      setCurrentLevel(level);
      localStorage.setItem('masterVolume', level);
    }
    setIsExpanded(false);
  };

  const getVolumeIcon = () => {
    if (currentLevel === 'off' || isMuted) return '🔇';
    if (currentLevel === 'low') return '🔈';
    if (currentLevel === 'medium') return '🔉';
    if (currentLevel === 'high') return '🔊';
    return '🔉';
  };

  const getLevelLabel = () => {
    if (currentLevel === 'off') return 'Off';
    return currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpanded}
        title={`Master Volume: ${getLevelLabel()}`}
        aria-label={`Master Volume: ${getLevelLabel()}`}
        aria-expanded={isExpanded}
      >
        <span className={styles.icon}>{getVolumeIcon()}</span>
      </button>

      {isExpanded && (
        <div className={styles.levelSelector}>
          <button
            className={`${styles.levelButton} ${currentLevel === 'high' ? styles.active : ''}`}
            onClick={() => setLevel('high')}
            title="High Volume"
            aria-label="High Volume"
          >
            High
          </button>
          <button
            className={`${styles.levelButton} ${currentLevel === 'medium' ? styles.active : ''}`}
            onClick={() => setLevel('medium')}
            title="Medium Volume"
            aria-label="Medium Volume"
          >
            Medium
          </button>
          <button
            className={`${styles.levelButton} ${currentLevel === 'low' ? styles.active : ''}`}
            onClick={() => setLevel('low')}
            title="Low Volume"
            aria-label="Low Volume"
          >
            Low
          </button>
          <button
            className={`${styles.levelButton} ${currentLevel === 'off' ? styles.active : ''}`}
            onClick={() => setLevel('off')}
            title="Off"
            aria-label="Off"
          >
            Off
          </button>
        </div>
      )}
    </div>
  );
};

export default AmbientVolumeControl;
