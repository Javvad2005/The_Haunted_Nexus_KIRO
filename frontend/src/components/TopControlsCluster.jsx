import { useState } from 'react';
import styles from './TopControlsCluster.module.css';

function TopControlsCluster({ children }) {
  return (
    <div className={styles.cluster}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}

export default TopControlsCluster;
