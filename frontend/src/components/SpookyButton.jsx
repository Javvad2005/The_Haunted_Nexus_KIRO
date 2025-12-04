import { memo } from 'react'
import styles from './SpookyButton.module.css'

function SpookyButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  ...props 
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} candleFlicker`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Memoize to prevent unnecessary re-renders when props haven't changed
export default memo(SpookyButton)
