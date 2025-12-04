import React, { useState, useRef, useEffect } from 'react';
import api, { APIError } from '../services/api';
import audioEffects from '../services/audioEffects'; // Enhancement M: Electric surge
import typingSounds from '../services/typingSounds';
import SpookyButton from '../components/SpookyButton';
import GlitchTransition from '../components/GlitchTransition';
import BloodSmear from '../components/BloodSmear';
import { extractColorsFromHTML, generatePalette, generatePaletteVariations, applyPaletteToIframe } from '../utils/colorExtractor';
import styles from './Reanimator.module.css';

const Reanimator = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showBloodSmear, setShowBloodSmear] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [currentPalette, setCurrentPalette] = useState(null);
  const [paletteVariations, setPaletteVariations] = useState([]);
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(false);
  const [showElectricSurge, setShowElectricSurge] = useState(false);
  const [electricBolts, setElectricBolts] = useState([]);
  const [showDistortion, setShowDistortion] = useState(false);
  const [distortionStripes, setDistortionStripes] = useState([]);
  const [showPowerDown, setShowPowerDown] = useState(false);
  
  const modernIframeRef = useRef(null);

  // Check if Cursed Mode is active on component mount
  useEffect(() => {
    const isCursedMode = document.documentElement.classList.contains('cursed-mode');
    if (isCursedMode) {
      // Trigger blood smear when opening Reanimator with Cursed Mode active
      setShowBloodSmear(true);
    }
  }, []);

  // Enhancement 25.1: Trigger electric bolts
  const triggerElectricBolts = () => {
    const boltCount = 3;
    const bolts = [];
    
    for (let i = 0; i < boltCount; i++) {
      setTimeout(() => {
        const boltId = Date.now() + i;
        const leftPosition = 20 + Math.random() * 60; // Random position between 20% and 80%
        
        bolts.push({ id: boltId, left: leftPosition });
        setElectricBolts(prev => [...prev, { id: boltId, left: leftPosition }]);
        
        // Remove bolt after animation completes
        setTimeout(() => {
          setElectricBolts(prev => prev.filter(b => b.id !== boltId));
        }, 500);
      }, i * 200);
    }
  };

  // Enhancement 25.2: Trigger distortion stripes
  const triggerDistortionStripes = () => {
    const stripeCount = 5;
    
    for (let i = 0; i < stripeCount; i++) {
      setTimeout(() => {
        const stripeId = Date.now() + i;
        const topPosition = Math.random() * 100; // Random vertical position
        
        setDistortionStripes(prev => [...prev, { id: stripeId, top: topPosition }]);
        
        // Remove stripe after animation completes
        setTimeout(() => {
          setDistortionStripes(prev => prev.filter(s => s.id !== stripeId));
        }, 800);
      }, i * 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim() || isLoading) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError(null);
    setIsLoading(true);
    setShowGlitch(true);
    
    // Enhancement 25.1: Electric surge animation when starting reanimation
    setShowElectricSurge(true);
    triggerElectricBolts();
    audioEffects.playElectricSurge();
    
    // Enhancement 25.2: Digital distortion stripes during generation
    setShowDistortion(true);
    triggerDistortionStripes();

    try {
      const response = await api.reanimateWebsite(url);
      
      // Show glitch transition before displaying result
      setTimeout(() => {
        setResult(response);
        setIsLoading(false);
        setShowElectricSurge(false);
        setShowDistortion(false);
        
        // Enhancement 25.3: Power-down sweep on completion
        setShowPowerDown(true);
        setTimeout(() => {
          setShowPowerDown(false);
        }, 800);
        
        // Enhancement M: Electric burst on completion
        audioEffects.playElectricBurst();
        
        // Extract colors and generate palettes
        extractColorsAndGeneratePalettes(response.modernized_html);
      }, 1500);
    } catch (err) {
      console.error('Reanimator error:', err);
      setError(err instanceof APIError ? err.message : 'Failed to reanimate the website');
      setIsLoading(false);
      setShowGlitch(false);
      setShowElectricSurge(false);
      setShowDistortion(false);
    }
  };

  // Extract colors and generate palette variations
  const extractColorsAndGeneratePalettes = (html) => {
    try {
      // Extract dominant colors
      const colors = extractColorsFromHTML(html, 5);
      setExtractedColors(colors);
      
      // Generate palette variations
      const variations = generatePaletteVariations(colors, 3);
      setPaletteVariations(variations);
      setCurrentPalette(variations[0]);
      setCurrentVariationIndex(0);
    } catch (error) {
      console.error('Failed to extract colors:', error);
    }
  };

  // Apply current palette to iframe
  useEffect(() => {
    if (autoThemeEnabled && currentPalette && modernIframeRef.current) {
      // Wait for iframe to load
      const iframe = modernIframeRef.current;
      const applyTheme = () => {
        applyPaletteToIframe(iframe, currentPalette);
      };
      
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        applyTheme();
      } else {
        iframe.addEventListener('load', applyTheme);
        return () => iframe.removeEventListener('load', applyTheme);
      }
    }
  }, [autoThemeEnabled, currentPalette]);

  // Cycle to next palette variation
  const handleCyclePalette = () => {
    const nextIndex = (currentVariationIndex + 1) % paletteVariations.length;
    setCurrentVariationIndex(nextIndex);
    setCurrentPalette(paletteVariations[nextIndex]);
  };

  // Regenerate palettes with different algorithm
  const handleRegeneratePalettes = () => {
    if (result) {
      extractColorsAndGeneratePalettes(result.modernized_html);
    }
  };

  // Toggle auto-theme
  const handleToggleAutoTheme = () => {
    setAutoThemeEnabled(!autoThemeEnabled);
  };

  const handleGlitchComplete = () => {
    setShowGlitch(false);
  };

  const handleBloodSmearComplete = () => {
    setShowBloodSmear(false);
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className={`${styles.container} ${showElectricSurge ? styles.containerSurging : ''} ${showDistortion ? styles.containerDistorting : ''} ${showPowerDown ? styles.containerPoweringDown : ''}`}>
      <BloodSmear isActive={showBloodSmear} onComplete={handleBloodSmearComplete} />
      <GlitchTransition
        isActive={showGlitch}
        duration={1500}
        intensity="high"
        onComplete={handleGlitchComplete}
      />
      
      {/* Enhancement 25.1: Electric bolts */}
      {electricBolts.map(bolt => (
        <div
          key={bolt.id}
          className={styles.electricBolt}
          style={{ left: `${bolt.left}%` }}
        />
      ))}
      
      {/* Enhancement 25.2: Distortion stripes */}
      {distortionStripes.map(stripe => (
        <div
          key={stripe.id}
          className={styles.distortionStripe}
          style={{ top: `${stripe.top}%` }}
        />
      ))}
      
      {/* Enhancement 25.3: Power-down sweep */}
      {showPowerDown && <div className={styles.powerDownSweep} />}

      <div className={styles.header}>
        <h1 className={styles.title}>The Reanimator</h1>
        <p className={styles.subtitle}>
          Resurrect the dead web... Bring archived pages back to life
        </p>
      </div>

      {!result ? (
        <div className={styles.inputSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter a URL to reanimate (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={() => typingSounds.playTypingSound()}
                disabled={isLoading}
              />
              <SpookyButton type="submit" disabled={isLoading || !url.trim()}>
                {isLoading ? 'Reanimating...' : 'Reanimate'}
              </SpookyButton>
            </div>
            {error && <div className={styles.error}>{error}</div>}
          </form>

          <div className={styles.instructions}>
            <h3>How it works:</h3>
            <ol>
              <li>Enter a URL of a website you want to revive</li>
              <li>The Reanimator fetches an archived version from the past</li>
              <li>AI breathes new life into the old HTML</li>
              <li>Witness the resurrection in split-screen glory</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <div className={styles.resultInfo}>
              <span className={styles.archiveDate}>
                Archived: {result.archive_date || 'Unknown date'}
              </span>
              <SpookyButton onClick={handleReset} variant="secondary">
                Reanimate Another
              </SpookyButton>
            </div>
          </div>

          {/* Auto-Theme Controls */}
          {extractedColors.length > 0 && (
            <div className={styles.themeControls}>
              <div className={styles.themeHeader}>
                <h3 className={styles.themeTitle}>🎨 Auto-Theme Generator</h3>
                <button
                  className={`${styles.themeToggle} ${autoThemeEnabled ? styles.themeToggleActive : ''}`}
                  onClick={handleToggleAutoTheme}
                >
                  {autoThemeEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {autoThemeEnabled && currentPalette && (
                <div className={styles.themeOptions}>
                  <div className={styles.colorPalette}>
                    <div className={styles.colorSwatch} style={{ backgroundColor: currentPalette.primary }} title="Primary" />
                    <div className={styles.colorSwatch} style={{ backgroundColor: currentPalette.secondary }} title="Secondary" />
                    <div className={styles.colorSwatch} style={{ backgroundColor: currentPalette.accent }} title="Accent" />
                    <div className={styles.colorSwatch} style={{ backgroundColor: currentPalette.background }} title="Background" />
                    <div className={styles.colorSwatch} style={{ backgroundColor: currentPalette.text }} title="Text" />
                  </div>
                  <div className={styles.themeButtons}>
                    <button className={styles.themeButton} onClick={handleCyclePalette}>
                      🔄 Cycle Palette ({currentVariationIndex + 1}/{paletteVariations.length})
                    </button>
                    <button className={styles.themeButton} onClick={handleRegeneratePalettes}>
                      ✨ Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.splitView}>
            <div className={styles.viewPane}>
              <h3 className={styles.paneTitle}>Original (Deceased)</h3>
              <div className={styles.htmlPreview}>
                <iframe
                  srcDoc={result.original_html}
                  title="Original HTML"
                  className={styles.iframe}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.viewPane}>
              <h3 className={styles.paneTitle}>Revived (Reanimated)</h3>
              <div className={styles.htmlPreview}>
                <iframe
                  ref={modernIframeRef}
                  srcDoc={result.revived_html}
                  title="Revived HTML"
                  className={styles.iframe}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reanimator;
