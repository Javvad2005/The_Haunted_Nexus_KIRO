import React, { useState, useCallback, memo } from 'react';
import ghostVoice from '../services/ghostVoice';
import styles from './GhostVoiceButton.module.css';

const GhostVoiceButton = ({ text, preset = 'auto', voiceSettings = null, disabled = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const handleSpeak = useCallback(async () => {
    if (!text || disabled || isPlaying) return;

    // Check if speech synthesis is available
    if (!ghostVoice.isAvailable()) {
      setError('Voice synthesis not supported in this browser');
      return;
    }

    setIsPlaying(true);
    setError(null);

    try {
      // Use persona-specific voice settings if provided, with emotional sound effects
      if (voiceSettings) {
        await ghostVoice.speakWithEmotion(text, voiceSettings);
      } else {
        // Check if text has emotional markers
        const hasEmotions = /\*[^*]+\*/i.test(text);
        if (hasEmotions) {
          await ghostVoice.speakWithEmotion(text, { preset });
        } else {
          await ghostVoice.speak(text, preset);
        }
      }
    } catch (err) {
      console.error('Ghost voice error:', err);
      setError('Failed to play voice');
    } finally {
      setIsPlaying(false);
    }
  }, [text, preset, voiceSettings, disabled, isPlaying]);

  const handleStop = useCallback(() => {
    ghostVoice.stop();
    setIsPlaying(false);
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${isPlaying ? styles.playing : ''}`}
        onClick={isPlaying ? handleStop : handleSpeak}
        disabled={disabled || !text}
        title={isPlaying ? 'Stop voice' : 'Play ghost voice'}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isPlaying ? (
            // Stop icon
            <rect x="6" y="6" width="12" height="12" />
          ) : (
            // Ghost/speaker icon
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
        <span className={styles.label}>
          {isPlaying ? 'Stop' : 'Speak'}
        </span>
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when props haven't changed
export default memo(GhostVoiceButton);
