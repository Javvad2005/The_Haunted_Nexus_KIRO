import { useState, useEffect } from 'react';
import BloodSmear from './BloodSmear';
import cursedModeGreeting from '../services/cursedModeGreeting';
import styles from './CursedModeToggle.module.css';

const CursedModeToggle = () => {
  const [isCursed, setIsCursed] = useState(false);
  const [showBloodSmear, setShowBloodSmear] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('cursedMode');
    if (saved === 'true') {
      setIsCursed(true);
      document.documentElement.classList.add('cursed-mode');
    }
  }, []);

  const toggleCursedMode = () => {
    const newMode = !isCursed;
    setIsCursed(newMode);
    
    if (newMode) {
      // Trigger blood smear when entering Cursed Mode
      setShowBloodSmear(true);
      document.documentElement.classList.add('cursed-mode');
      localStorage.setItem('cursedMode', 'true');
      
      // Play cursed mode greeting: "Welcome to Haunted Hell" (once per session)
      cursedModeGreeting.playGreeting();
    } else {
      document.documentElement.classList.remove('cursed-mode');
      localStorage.setItem('cursedMode', 'false');
      
      // Play normal mode greeting: "Welcome to Hell" (once per session)
      cursedModeGreeting.playNormalGreeting();
    }
  };

  const handleBloodSmearComplete = () => {
    setShowBloodSmear(false);
  };

  return (
    <>
      <BloodSmear isActive={showBloodSmear} onComplete={handleBloodSmearComplete} />
      <button
        className={`${styles.toggle} ${isCursed ? styles.cursed : ''}`}
        onClick={toggleCursedMode}
        title={isCursed ? 'Disable Cursed Mode' : 'Enable Cursed Mode'}
        aria-label={isCursed ? 'Disable Cursed Mode' : 'Enable Cursed Mode'}
      >
        <span className={styles.icon}>{isCursed ? '🔥' : '💀'}</span>
        <span className={styles.label}>
          {isCursed ? 'Cursed' : 'Normal'}
        </span>
      </button>
    </>
  );
};

export default CursedModeToggle;
