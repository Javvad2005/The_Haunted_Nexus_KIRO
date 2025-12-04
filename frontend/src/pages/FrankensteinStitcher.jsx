import React, { useState } from 'react';
import api, { APIError } from '../services/api';
import SpookyButton from '../components/SpookyButton';
import GlitchTransition from '../components/GlitchTransition';
import GhostVoiceButton from '../components/GhostVoiceButton';
import styles from './FrankensteinStitcher.module.css';

const API_OPTIONS = [
  { value: 'weather', label: '🌤️ Weather' },
  { value: 'jokes', label: '😂 Jokes' },
  { value: 'quotes', label: '💭 Quotes' },
  { value: 'advice', label: '💡 Advice' },
  { value: 'catfacts', label: '🐱 Cat Facts' },
];

const FrankensteinStitcher = () => {
  const [api1, setApi1] = useState('');
  const [api2, setApi2] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGlitch, setShowGlitch] = useState(false);

  const handleStitch = async (e) => {
    e.preventDefault();

    if (!api1 || !api2 || isLoading) return;

    if (api1 === api2) {
      setError('Please select two different APIs to stitch together');
      return;
    }

    setError(null);
    setIsLoading(true);
    setShowGlitch(true);

    try {
      const response = await api.stitchAPIs(api1, api2);

      // Show glitch transition before displaying result
      setTimeout(() => {
        setResult(response);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Frankenstein Stitcher error:', err);
      setError(err instanceof APIError ? err.message : 'Failed to stitch APIs together');
      setIsLoading(false);
      setShowGlitch(false);
    }
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
  };

  const handleReset = () => {
    setApi1('');
    setApi2('');
    setResult(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <GlitchTransition
        isActive={showGlitch}
        duration={1500}
        intensity="high"
        onComplete={handleGlitchComplete}
      />

      <div className={styles.header}>
        <h1 className={styles.title}>Frankenstein API Stitcher</h1>
        <p className={styles.subtitle}>
          Stitch together the corpses of different APIs... Create something beautifully monstrous
        </p>
      </div>

      {!result ? (
        <div className={styles.inputSection}>
          <form onSubmit={handleStitch} className={styles.form}>
            <div className={styles.selectGroup}>
              <div className={styles.selectWrapper}>
                <label className={styles.label}>First API (Left Limb)</label>
                <select
                  className={styles.select}
                  value={api1}
                  onChange={(e) => setApi1(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select an API...</option>
                  {API_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.stitchIcon}>⚡</div>

              <div className={styles.selectWrapper}>
                <label className={styles.label}>Second API (Right Limb)</label>
                <select
                  className={styles.select}
                  value={api2}
                  onChange={(e) => setApi2(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select an API...</option>
                  {API_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonWrapper}>
              <SpookyButton type="submit" disabled={isLoading || !api1 || !api2}>
                {isLoading ? 'Stitching...' : '⚡ Stitch Together ⚡'}
              </SpookyButton>
            </div>
          </form>

          <div className={styles.instructions}>
            <h3>How it works:</h3>
            <ol>
              <li>Select two different APIs from the dropdowns</li>
              <li>Click the stitch button to combine them</li>
              <li>Watch as AI weaves their responses into something new</li>
              <li>Witness the unholy creation come to life</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>🧟 The Creation Lives! 🧟</h2>
            <SpookyButton onClick={handleReset} variant="secondary">
              Create Another Monster
            </SpookyButton>
          </div>

          <div className={`${styles.resultCard} candleFlicker`}>
            <div className={styles.stitchedOutput}>
              <h3 className={styles.outputTitle}>Stitched Output</h3>
              <div className={styles.outputText}>{result.stitched_output}</div>
              <div className={styles.voiceButtonWrapper}>
                <GhostVoiceButton text={result.stitched_output} />
              </div>
            </div>

            <div className={styles.sourceData}>
              <div className={`${styles.sourceCard} candleFlicker`}>
                <h4 className={styles.sourceTitle}>Source 1: {api1}</h4>
                <pre className={styles.sourceContent}>
                  {JSON.stringify(result.api1_data, null, 2)}
                </pre>
              </div>

              <div className={`${styles.sourceCard} candleFlicker`}>
                <h4 className={styles.sourceTitle}>Source 2: {api2}</h4>
                <pre className={styles.sourceContent}>
                  {JSON.stringify(result.api2_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrankensteinStitcher;
