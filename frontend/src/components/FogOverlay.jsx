import { memo } from 'react'
import styles from './FogOverlay.module.css'

function FogOverlay({ intensity = 'medium' }) {
  return (
    <div className={`${styles.fogOverlay} ${styles[intensity]} candleFlicker`}>
      <div className={styles.fogLayer1}></div>
      <div className={styles.fogLayer2}></div>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders when intensity hasn't changed
export default memo(FogOverlay)
