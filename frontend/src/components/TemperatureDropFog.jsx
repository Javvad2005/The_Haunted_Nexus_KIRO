import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TemperatureDropFog.module.css';

/**
 * TemperatureDropFog Component
 * Triggers a brief temperature drop fog effect on route navigation
 * Creates atmospheric transition between features
 */
const TemperatureDropFog = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Trigger on route change
    setIsActive(true);
    
    // Random duration between 800-1200ms
    const duration = 800 + Math.random() * 400;
    
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.fog} />
      <div className={styles.blueTint} />
    </div>
  );
};

export default TemperatureDropFog;
