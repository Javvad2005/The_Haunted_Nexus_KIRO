import React from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>👻 Something Went Wrong</h1>
            <p className={styles.errorMessage}>
              The spirits have disrupted the application... A dark force has caused an error.
            </p>
            
            {this.state.error && (
              <div className={styles.errorDetails}>
                <p className={styles.errorText}>{this.state.error.toString()}</p>
              </div>
            )}

            <button className={styles.resetButton} onClick={this.handleReset}>
              Return to Safety
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
