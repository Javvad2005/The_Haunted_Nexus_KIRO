import React, { useState, useRef, useEffect } from 'react';
import SpookyButton from '../components/SpookyButton';
import typingSounds from '../services/typingSounds';
import styles from './CursedAtelier.module.css';

import api from '../services/api';

const CursedAtelier = () => {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('filter'); // 'filter' or 'ai'
  const [aiStyles, setAIStyles] = useState([]);
  const [selectedAIStyle, setSelectedAIStyle] = useState(null);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiResult, setAIResult] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch AI styles on mount
  useEffect(() => {
    const fetchAIStyles = async () => {
      try {
        const response = await api.getAIImageStyles();
        setAIStyles(response.styles);
        if (response.styles.length > 0) {
          setSelectedAIStyle(response.styles[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch AI styles:', error);
      }
    };
    fetchAIStyles();
  }, []);

  // Available filters
  const filters = [
    { id: 'none', name: 'Original', description: 'No filter applied' },
    { id: 'desaturate', name: 'Desaturate', description: 'Remove color, add darkness' },
    { id: 'rgb_split', name: 'RGB Split', description: 'Chromatic aberration effect' },
    { id: 'grain', name: 'Film Grain', description: 'Old film texture' },
    { id: 'vignette', name: 'Vignette', description: 'Dark edges, focused center' },
    { id: 'invert', name: 'Negative', description: 'Invert colors' },
    { id: 'sepia_dark', name: 'Dark Sepia', description: 'Aged, haunted photo' },
    { id: 'blood_moon', name: 'Blood Moon', description: 'Red tint overlay' },
    { id: 'ghost', name: 'Ghostly', description: 'Ethereal, faded appearance' },
    { id: 'cursed', name: 'Cursed', description: 'Combined horror effects' },
  ];

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setImage(img);
        setSelectedFilter('none');
        setIntensity(100);
        drawImageToCanvas(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Draw image to canvas
  const drawImageToCanvas = (img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image (max 1200px width)
    const maxWidth = 1200;
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(img, 0, 0, width, height);
  };

  // Apply filter to canvas
  const applyFilter = () => {
    if (!originalImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Redraw original image
      drawImageToCanvas(originalImage);
      
      // Apply selected filter
      if (selectedFilter !== 'none') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const intensityFactor = intensity / 100;
        
        switch (selectedFilter) {
          case 'desaturate':
            applyDesaturate(data, intensityFactor);
            break;
          case 'rgb_split':
            applyRGBSplit(ctx, canvas, intensityFactor);
            return; // RGB split handles its own rendering
          case 'grain':
            applyGrain(data, intensityFactor);
            break;
          case 'vignette':
            applyVignette(ctx, canvas, intensityFactor);
            return; // Vignette handles its own rendering
          case 'invert':
            applyInvert(data, intensityFactor);
            break;
          case 'sepia_dark':
            applySepiaDark(data, intensityFactor);
            break;
          case 'blood_moon':
            applyBloodMoon(data, intensityFactor);
            break;
          case 'ghost':
            applyGhost(data, intensityFactor);
            break;
          case 'cursed':
            applyCursed(ctx, canvas, data, intensityFactor);
            return; // Cursed handles its own rendering
          default:
            break;
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      setIsProcessing(false);
    }, 10);
  };

  // Filter implementations
  const applyDesaturate = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] + (gray - data[i]) * intensity * 0.7; // Darker
      data[i + 1] = data[i + 1] + (gray - data[i + 1]) * intensity * 0.7;
      data[i + 2] = data[i + 2] + (gray - data[i + 2]) * intensity * 0.7;
    }
  };

  const applyRGBSplit = (ctx, canvas, intensity) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const offset = Math.floor(5 * intensity);
    
    // Create separate channels
    const redData = ctx.createImageData(canvas.width, canvas.height);
    const greenData = ctx.createImageData(canvas.width, canvas.height);
    const blueData = ctx.createImageData(canvas.width, canvas.height);
    
    // Split RGB channels
    for (let i = 0; i < imageData.data.length; i += 4) {
      redData.data[i] = imageData.data[i];
      redData.data[i + 3] = imageData.data[i + 3];
      
      greenData.data[i + 1] = imageData.data[i + 1];
      greenData.data[i + 3] = imageData.data[i + 3];
      
      blueData.data[i + 2] = imageData.data[i + 2];
      blueData.data[i + 3] = imageData.data[i + 3];
    }
    
    // Draw with offsets
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    
    ctx.putImageData(redData, -offset, 0);
    ctx.putImageData(greenData, 0, 0);
    ctx.putImageData(blueData, offset, 0);
    
    ctx.globalCompositeOperation = 'source-over';
  };

  const applyGrain = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 50 * intensity;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
  };

  const applyVignette = (ctx, canvas, intensity) => {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
    );
    
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${0.7 * intensity})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const applyInvert = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + (255 - data[i] * 2) * intensity;
      data[i + 1] = data[i + 1] + (255 - data[i + 1] * 2) * intensity;
      data[i + 2] = data[i + 2] + (255 - data[i + 2] * 2) * intensity;
    }
  };

  const applySepiaDark = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      data[i] = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189) * 0.7) * intensity + r * (1 - intensity);
      data[i + 1] = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168) * 0.7) * intensity + g * (1 - intensity);
      data[i + 2] = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131) * 0.7) * intensity + b * (1 - intensity);
    }
  };

  const applyBloodMoon = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + 50 * intensity); // More red
      data[i + 1] = data[i + 1] * (1 - 0.3 * intensity); // Less green
      data[i + 2] = data[i + 2] * (1 - 0.3 * intensity); // Less blue
    }
  };

  const applyGhost = (data, intensity) => {
    for (let i = 0; i < data.length; i += 4) {
      // Lighten and desaturate
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const lightGray = gray + (255 - gray) * 0.5;
      
      data[i] = data[i] + (lightGray - data[i]) * intensity;
      data[i + 1] = data[i + 1] + (lightGray - data[i + 1]) * intensity;
      data[i + 2] = data[i + 2] + (lightGray - data[i + 2]) * intensity;
      data[i + 3] = data[i + 3] * (1 - 0.3 * intensity); // More transparent
    }
  };

  const applyCursed = (ctx, canvas, data, intensity) => {
    // Combine multiple effects
    applyDesaturate(data, intensity * 0.8);
    applyGrain(data, intensity * 0.6);
    ctx.putImageData(ctx.createImageData(new Uint8ClampedArray(data), canvas.width, canvas.height), 0, 0);
    applyVignette(ctx, canvas, intensity * 0.8);
    applyRGBSplit(ctx, canvas, intensity * 0.3);
  };

  // Apply filter when selection or intensity changes
  useEffect(() => {
    if (originalImage) {
      applyFilter();
    }
  }, [selectedFilter, intensity, originalImage]);

  // AI Transform image
  const handleAITransform = async () => {
    if (!originalImage || !selectedAIStyle) return;

    setIsProcessing(true);
    setAIResult(null);

    try {
      // Get canvas data as base64
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');

      // Call AI API
      const response = await api.aiTransformImage(
        imageData,
        aiPrompt || 'cursed horror transformation',
        selectedAIStyle
      );

      // Display AI result
      setAIResult(response);

      // Load transformed image onto canvas
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
      };
      img.src = response.transformed_image;
    } catch (error) {
      console.error('AI transformation failed:', error);
      alert('Failed to transform image with AI. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const filename = mode === 'ai' && selectedAIStyle
      ? `cursed-ai-${selectedAIStyle}-${Date.now()}.png`
      : `cursed-image-${selectedFilter}-${Date.now()}.png`;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cursed Atelier</h1>
        <p className={styles.subtitle}>
          Transform your images into haunted masterpieces...
        </p>
      </div>

      <div className={styles.content}>
        {/* Upload Section */}
        {!image && (
          <div className={styles.uploadSection}>
            <div
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}>📸</div>
              <h3>Upload an Image</h3>
              <p>Click to select an image to curse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Editor Section */}
        {image && (
          <div className={styles.editorSection}>
            {/* Canvas Preview */}
            <div className={styles.canvasContainer}>
              <canvas ref={canvasRef} className={styles.canvas} />
              {isProcessing && (
                <div className={styles.processing}>
                  <div className={styles.spinner}></div>
                  <p>Applying curse...</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              {/* Mode Toggle */}
              <div className={styles.modeToggle}>
                <button
                  className={`${styles.modeButton} ${mode === 'filter' ? styles.modeButtonActive : ''}`}
                  onClick={() => setMode('filter')}
                >
                  🎨 Client Filters
                </button>
                <button
                  className={`${styles.modeButton} ${mode === 'ai' ? styles.modeButtonActive : ''}`}
                  onClick={() => setMode('ai')}
                >
                  🤖 AI Transform
                </button>
              </div>

              <h3 className={styles.controlsTitle}>
                {mode === 'filter' ? 'Cursed Filters' : 'AI Styles'}
              </h3>
              
              {/* Filter Selection */}
              {mode === 'filter' && (
                <>
                  <div className={styles.filterGrid}>
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        className={`${styles.filterButton} ${
                          selectedFilter === filter.id ? styles.filterButtonActive : ''
                        }`}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        <div className={styles.filterName}>{filter.name}</div>
                        <div className={styles.filterDesc}>{filter.description}</div>
                      </button>
                    ))}
                  </div>

                  {/* Intensity Slider */}
                  {selectedFilter !== 'none' && (
                    <div className={styles.intensityControl}>
                      <label className={styles.intensityLabel}>
                        Intensity: {intensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className={styles.intensitySlider}
                      />
                    </div>
                  )}
                </>
              )}

              {/* AI Mode */}
              {mode === 'ai' && (
                <>
                  {/* AI Style Selection */}
                  <div className={styles.filterGrid}>
                    {aiStyles.map((style) => (
                      <button
                        key={style.id}
                        className={`${styles.filterButton} ${
                          selectedAIStyle === style.id ? styles.filterButtonActive : ''
                        }`}
                        onClick={() => setSelectedAIStyle(style.id)}
                      >
                        <div className={styles.filterName}>
                          {style.icon} {style.name}
                        </div>
                        <div className={styles.filterDesc}>{style.description}</div>
                      </button>
                    ))}
                  </div>

                  {/* AI Prompt Input */}
                  <div className={styles.aiPromptSection}>
                    <label className={styles.aiPromptLabel}>
                      Custom Prompt (Optional)
                    </label>
                    <input
                      type="text"
                      className={styles.aiPromptInput}
                      placeholder="e.g., dark horror atmosphere..."
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      onKeyDown={() => typingSounds.playTypingSound()}
                    />
                  </div>

                  {/* AI Transform Button */}
                  <SpookyButton
                    onClick={handleAITransform}
                    disabled={isProcessing || !selectedAIStyle}
                  >
                    {isProcessing ? 'Transforming...' : '🤖 AI Transform'}
                  </SpookyButton>

                  {/* AI Result Description */}
                  {aiResult && (
                    <div className={styles.aiResultDesc}>
                      <p>{aiResult.description}</p>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className={styles.actions}>
                <SpookyButton onClick={handleDownload}>
                  Download Cursed Image
                </SpookyButton>
                <button
                  className={styles.newImageButton}
                  onClick={() => {
                    setImage(null);
                    setOriginalImage(null);
                    setSelectedFilter('none');
                    setIntensity(100);
                  }}
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursedAtelier;
