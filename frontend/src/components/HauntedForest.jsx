import { useEffect, useState } from 'react';
import styles from './HauntedForest.module.css';

const HauntedForest = () => {
  const [moonGlow, setMoonGlow] = useState(0.5);

  useEffect(() => {
    // Pulsing moon effect
    const interval = setInterval(() => {
      setMoonGlow(prev => {
        const newGlow = prev + (Math.random() - 0.5) * 0.1;
        return Math.max(0.3, Math.min(0.7, newGlow));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.forestBackground}>
      {/* Distant moon */}
      <div 
        className={styles.moon} 
        style={{ opacity: moonGlow }}
      />
      
      {/* Fog layers */}
      <div className={styles.fogLayer1} />
      <div className={styles.fogLayer2} />
      <div className={styles.fogLayer3} />
      
      {/* Tree silhouettes */}
      <div className={styles.treesBack} />
      <div className={styles.treesMid} />
      <div className={styles.treesFront} />
      
      {/* Fireflies */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={styles.firefly}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${15 + Math.random() * 70}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

export default HauntedForest;
