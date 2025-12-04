import React from 'react';
import SpookyButton from './SpookyButton';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>Something Went Wrong</h3>
        <p className={styles.errorText}>{message || 'An unexpected error occurred'}</p>
      </div>
      <div className={styles.errorActions}>
        {onRetry && (
          <SpookyButton onClick={onRetry} variant="primary">
            Try Again
          </SpookyButton>
        )}
        {onDismiss && (
          <SpookyButton onClick={onDismiss} variant="secondary">
            Dismiss
          </SpookyButton>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
