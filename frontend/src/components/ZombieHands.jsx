import { useState, useEffect } from 'react';
import styles from './ZombieHands.module.css';

const ZombieHands = () => {
  const [hands, setHands] = useState([]);

  useEffect(() => {
    const createHandsWave = () => {
      const timestamp = Date.now();
      const newHands = [];
      
      // Left side hands (5-7 hands)
      const leftCount = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < leftCount; i++) {
        newHands.push({
          id: timestamp + i,
          side: 'left',
          position: (i / leftCount) * 100,
          delay: i * 0.2
        });
      }
      
      // Right side hands (5-7 hands)
      const rightCount = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < rightCount; i++) {
        newHands.push({
          id: timestamp + 100 + i,
          side: 'right',
          position: (i / rightCount) * 100,
          delay: i * 0.2
        });
      }
      
      // Bottom hands (8-12 hands)
      const bottomCount = 8 + Math.floor(Math.random() * 5);
      for (let i = 0; i < bottomCount; i++) {
        newHands.push({
          id: timestamp + 200 + i,
          side: 'bottom',
          position: (i / bottomCount) * 100,
          delay: i * 0.15
        });
      }

      setHands(newHands);

      // Remove hands after animation (4 seconds)
      setTimeout(() => {
        setHands([]);
      }, 4000);
    };

    // First wave after 5 seconds
    const initialTimeout = setTimeout(createHandsWave, 5000);

    // Create new wave every 30 seconds
    const interval = setInterval(createHandsWave, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.handsContainer}>
      {hands.map(hand => (
        <div
          key={hand.id}
          className={`${styles.hand} ${styles[hand.side]}`}
          style={{
            [hand.side === 'bottom' ? 'left' : 'top']: `${hand.position}%`,
            animationDelay: `${hand.delay}s`
          }}
        >
          ✋
        </div>
      ))}
    </div>
  );
};

export default ZombieHands;
