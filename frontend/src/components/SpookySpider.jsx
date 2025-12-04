import { useState, useEffect } from 'react';
import styles from './SpookySpider.module.css';

const SpookySpider = () => {
  const [spiders, setSpiders] = useState([]);

  useEffect(() => {
    const createSpider = (zone) => {
      const id = Date.now() + Math.random();
      let position;
      
      // Define position based on zone: left (0-30%), middle (35-65%), right (70-100%)
      if (zone === 'left') {
        position = Math.random() * 30;
      } else if (zone === 'middle') {
        position = 35 + Math.random() * 30;
      } else {
        position = 70 + Math.random() * 30;
      }

      const newSpider = {
        id,
        zone,
        position,
        isDescending: true
      };

      setSpiders(prev => [...prev, newSpider]);

      // Remove spider after animation completes (10s down + 10s up = 20s total)
      setTimeout(() => {
        setSpiders(prev => prev.filter(s => s.id !== id));
      }, 20000);
    };

    // Create 3 spiders simultaneously (one from each zone)
    const createSpiderSet = () => {
      createSpider('left');
      createSpider('middle');
      createSpider('right');
    };
    
    // First set immediately
    createSpiderSet();
    
    // Second set after 7 seconds
    setTimeout(createSpiderSet, 7000);
    
    // Third set after 14 seconds
    setTimeout(createSpiderSet, 14000);

    // Create new set of 3 spiders every 20 seconds (repeating pattern)
    const interval = setInterval(() => {
      createSpiderSet();
      setTimeout(createSpiderSet, 7000);
      setTimeout(createSpiderSet, 14000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.spiderContainer}>
      {spiders.map(spider => (
        <div
          key={spider.id}
          className={styles.spider}
          style={{
            left: `${spider.position}%`,
          }}
        >
          <div className={styles.thread}></div>
          <div className={styles.spiderBody}>🕷️</div>
        </div>
      ))}
    </div>
  );
};

export default SpookySpider;
