import { useState, useEffect } from 'react';
import styles from './WarningPopup.module.css';

const WarningPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after a brief delay
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for fade out animation
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.popup} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.titleContainer}>
          <div className={styles.warningLine}>
            <span className={styles.warningIcon}>⚠️</span>
            <span className={styles.warningText}>WARNING</span>
          </div>
          <div className={styles.riskLine}>
            ENTER AT YOUR OWN RISK
          </div>
        </div>
        
        <div className={styles.welcomeText}>
          Welcome to The Haunted Nexus
        </div>
        
        <div className={styles.content}>
          <p className={styles.mainText}>
            Crossing this boundary may expose you to ghostly voices, unpredictable apparitions, and digital entities that do not wish to be disturbed. If you feel something breathing behind you… it's already too late.
          </p>
        </div>
        
        <button 
          className={styles.enterButton}
          onClick={handleEnter}
          aria-label="Enter The Haunted Nexus"
        >
          ENTER IF YOU DARE
        </button>
        
        <div className={styles.footer}>
          Powered and conjured through the eerie energy of <span className={styles.kiro}>Kiro IDE</span>.
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
