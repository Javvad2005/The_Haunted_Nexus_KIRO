import { useState, useEffect } from 'react';
import ambientAudio from '../services/ambientAudio';
import styles from './AmbienceMuteButton.module.css';

const AmbienceMuteButton = () => {
  const [isMuted, setIsMuted] = useState(ambientAudio.isMuted);

  useEffect(() => {
    setIsMuted(ambientAudio.isMuted);
  }, []);

  const toggleMute = () => {
    const newMutedState = ambientAudio.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <button
      className={`${styles.button} ${isMuted ? styles.muted : ''}`}
      onClick={toggleMute}
      title={isMuted ? 'Unmute Ambience' : 'Mute Ambience'}
      aria-label={isMuted ? 'Unmute Ambience' : 'Mute Ambience'}
    >
      <span className={styles.icon}>{isMuted ? '🔇' : '🔊'}</span>
    </button>
  );
};

export default AmbienceMuteButton;
