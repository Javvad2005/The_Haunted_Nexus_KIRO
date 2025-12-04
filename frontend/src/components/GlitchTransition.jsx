import { useEffect, memo } from 'react'
import styles from './GlitchTransition.module.css'

function GlitchTransition({ isActive, duration = 450, intensity = 'medium', onComplete }) {
  useEffect(() => {
    if (isActive && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isActive, duration, onComplete])

  if (!isActive) return null

  return (
    <div 
      className={`${styles.glitchOverlay} ${styles[intensity]}`}
      style={{ animationDuration: `${duration}ms` }}
    >
      <div className={styles.glitchLayer1}></div>
      <div className={styles.glitchLayer2}></div>
      <div className={styles.glitchLayer3}></div>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders when props haven't changed
export default memo(GlitchTransition)
