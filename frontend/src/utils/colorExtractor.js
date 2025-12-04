/**
 * Color Extraction and Palette Generation Utility
 * Extracts dominant colors from HTML content and generates themed palettes
 */

/**
 * Extract dominant colors from HTML string
 * @param {string} html - HTML content
 * @param {number} colorCount - Number of colors to extract
 * @returns {Array<string>} Array of hex color codes
 */
export const extractColorsFromHTML = (html, colorCount = 5) => {
  // Create a temporary DOM element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '1000px';
  document.body.appendChild(tempDiv);

  const colors = [];
  const colorMap = new Map();

  // Extract colors from inline styles and computed styles
  const elements = tempDiv.querySelectorAll('*');
  
  elements.forEach((element) => {
    try {
      const computed = window.getComputedStyle(element);
      
      // Extract background color
      const bgColor = computed.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        const hex = rgbToHex(bgColor);
        if (hex && !isGrayscale(hex)) {
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
      }
      
      // Extract text color
      const textColor = computed.color;
      if (textColor) {
        const hex = rgbToHex(textColor);
        if (hex && !isGrayscale(hex)) {
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
      }
      
      // Extract border color
      const borderColor = computed.borderColor;
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
        const hex = rgbToHex(borderColor);
        if (hex && !isGrayscale(hex)) {
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
      }
    } catch (e) {
      // Skip elements that cause errors
    }
  });

  // Clean up
  document.body.removeChild(tempDiv);

  // Sort by frequency and get top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color)
    .slice(0, colorCount);

  return sortedColors.length > 0 ? sortedColors : generateDefaultPalette();
};

/**
 * Convert RGB/RGBA string to hex
 * @param {string} rgb - RGB or RGBA string
 * @returns {string|null} Hex color code
 */
const rgbToHex = (rgb) => {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return null;

  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Check if color is grayscale
 * @param {string} hex - Hex color code
 * @returns {boolean}
 */
const isGrayscale = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const diff = Math.max(r, g, b) - Math.min(r, g, b);
  return diff < 30; // Threshold for grayscale
};

/**
 * Generate a themed color palette from extracted colors
 * Enhancement 25.4: Improved with cinematic colors and better contrast
 * @param {Array<string>} colors - Array of hex colors
 * @returns {Object} Themed palette object
 */
export const generatePalette = (colors) => {
  if (!colors || colors.length === 0) {
    return generateDefaultPalette();
  }

  // Sort colors by brightness and saturation for better selection
  const sortedColors = colors.sort((a, b) => {
    const satA = getSaturation(a);
    const satB = getSaturation(b);
    const brightA = getBrightness(a);
    const brightB = getBrightness(b);
    
    // Prefer saturated colors over dull ones
    return (satB * 0.6 + brightB * 0.4) - (satA * 0.6 + brightA * 0.4);
  });

  // Enhancement 25.4: Generate cinematic palette with better contrast
  const primary = enhanceColor(sortedColors[0] || '#b026ff', 1.2); // Boost saturation
  const secondary = enhanceColor(sortedColors[1] || '#00f0ff', 1.15);
  const accent = enhanceColor(sortedColors[2] || '#ff3366', 1.1);
  
  // Create deep, cinematic background
  const background = createCinematicBackground(primary);
  
  // Ensure high contrast text
  const text = ensureReadableText(background);

  const palette = {
    primary,
    secondary,
    accent,
    background,
    text,
  };

  // Add variations with better contrast ratios
  palette.primaryDark = darken(palette.primary, 0.4);
  palette.primaryLight = lighten(palette.primary, 0.2);
  palette.secondaryDark = darken(palette.secondary, 0.4);
  palette.secondaryLight = lighten(palette.secondary, 0.2);
  palette.accentDark = darken(palette.accent, 0.3);
  palette.accentLight = lighten(palette.accent, 0.2);
  
  // Enhancement 25.4: Add gradient colors for cinematic effects
  palette.gradientStart = palette.primaryDark;
  palette.gradientMid = palette.primary;
  palette.gradientEnd = palette.secondary;

  return palette;
};

/**
 * Get brightness of a hex color (0-255)
 * @param {string} hex - Hex color code
 * @returns {number}
 */
const getBrightness = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Get saturation of a hex color (0-1)
 * Enhancement 25.4: Added for better color selection
 * @param {string} hex - Hex color code
 * @returns {number}
 */
const getSaturation = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (max === 0) return 0;
  return delta / max;
};

/**
 * Enhance color saturation and vibrancy
 * Enhancement 25.4: Makes colors more cinematic
 * @param {string} hex - Hex color code
 * @param {number} factor - Enhancement factor (>1 increases saturation)
 * @returns {string}
 */
const enhanceColor = (hex, factor = 1.2) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  // Convert to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h, s;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Enhance saturation
  s = Math.min(1, s * factor);
  
  // Convert back to RGB
  const hslToRgb = (h, s, l) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };
  
  const [nr, ng, nb] = hslToRgb(h, s, l);
  return '#' + [nr, ng, nb].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Create cinematic dark background from primary color
 * Enhancement 25.4: Deep, atmospheric backgrounds
 * @param {string} hex - Base hex color
 * @returns {string}
 */
const createCinematicBackground = (hex) => {
  // Create very dark version with slight color tint
  return darken(hex, 0.92);
};

/**
 * Ensure text color has good contrast with background
 * Enhancement 25.4: Better readability
 * @param {string} bgHex - Background hex color
 * @returns {string}
 */
const ensureReadableText = (bgHex) => {
  const brightness = getBrightness(bgHex);
  
  // If background is dark, use light text
  if (brightness < 128) {
    return '#f0f0f0';
  }
  
  // If background is light, use dark text
  return '#1a1a1a';
};

/**
 * Darken a hex color
 * @param {string} hex - Hex color code
 * @param {number} factor - Darken factor (0-1)
 * @returns {string}
 */
const darken = (hex, factor) => {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - factor));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - factor));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - factor));
  
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Lighten a hex color
 * @param {string} hex - Hex color code
 * @param {number} factor - Lighten factor (0-1)
 * @returns {string}
 */
const lighten = (hex, factor) => {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * factor);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * factor);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * factor);
  
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Generate default haunted palette
 * @returns {Object}
 */
const generateDefaultPalette = () => {
  return {
    primary: '#b026ff',
    secondary: '#00f0ff',
    accent: '#ff3366',
    background: '#0a0a0f',
    text: '#e0e0e0',
    primaryDark: '#7a1ab3',
    primaryLight: '#d966ff',
    secondaryDark: '#00a8b3',
    secondaryLight: '#66f6ff',
  };
};

/**
 * Generate multiple palette variations
 * @param {Array<string>} colors - Base colors
 * @param {number} count - Number of variations
 * @returns {Array<Object>}
 */
export const generatePaletteVariations = (colors, count = 3) => {
  const variations = [];
  
  for (let i = 0; i < count; i++) {
    // Rotate colors for each variation
    const rotatedColors = [...colors.slice(i), ...colors.slice(0, i)];
    variations.push(generatePalette(rotatedColors));
  }
  
  return variations;
};

/**
 * Apply palette to iframe
 * Enhancement 25.4: Improved with gradients, shadows, and better contrast
 * @param {HTMLIFrameElement} iframe - Iframe element
 * @param {Object} palette - Palette object
 */
export const applyPaletteToIframe = (iframe, palette) => {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Create or update style element
    let styleEl = iframeDoc.getElementById('auto-theme-style');
    if (!styleEl) {
      styleEl = iframeDoc.createElement('style');
      styleEl.id = 'auto-theme-style';
      iframeDoc.head.appendChild(styleEl);
    }
    
    // Enhancement 25.4: Generate enhanced CSS with gradients and shadows
    const css = `
      :root {
        --theme-primary: ${palette.primary} !important;
        --theme-secondary: ${palette.secondary} !important;
        --theme-accent: ${palette.accent} !important;
        --theme-bg: ${palette.background} !important;
        --theme-text: ${palette.text} !important;
        --theme-primary-dark: ${palette.primaryDark} !important;
        --theme-primary-light: ${palette.primaryLight} !important;
        --theme-gradient: linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientMid}, ${palette.gradientEnd}) !important;
      }
      
      body {
        background: linear-gradient(135deg, ${palette.background}, ${palette.primaryDark}) !important;
        color: ${palette.text} !important;
        line-height: 1.6 !important;
      }
      
      a {
        color: ${palette.primary} !important;
        text-decoration: none !important;
        transition: all 0.3s ease !important;
        text-shadow: 0 0 10px ${palette.primary}33 !important;
      }
      
      a:hover {
        color: ${palette.primaryLight} !important;
        text-shadow: 0 0 15px ${palette.primaryLight}66 !important;
      }
      
      button, .button, input[type="submit"] {
        background: linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark}) !important;
        color: ${palette.text} !important;
        border: 2px solid ${palette.primaryLight} !important;
        box-shadow: 0 4px 15px ${palette.primary}44 !important;
        transition: all 0.3s ease !important;
        padding: 0.5rem 1rem !important;
        border-radius: 8px !important;
      }
      
      button:hover, .button:hover, input[type="submit"]:hover {
        background: linear-gradient(135deg, ${palette.primaryLight}, ${palette.primary}) !important;
        box-shadow: 0 6px 20px ${palette.primary}66 !important;
        transform: translateY(-2px) !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: ${palette.primary} !important;
        text-shadow: 0 0 20px ${palette.primary}44 !important;
        margin-bottom: 1rem !important;
      }
      
      h1 {
        background: ${palette.gradientStart} !important;
        background: linear-gradient(90deg, ${palette.primary}, ${palette.secondary}) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }
      
      p {
        margin-bottom: 1rem !important;
        color: ${palette.text} !important;
      }
      
      div, section, article {
        border-color: ${palette.primaryDark}66 !important;
      }
      
      /* Enhancement 25.4: Card and panel styling */
      .card, .panel, .box, [class*="card"], [class*="panel"] {
        background: ${palette.background}dd !important;
        border: 1px solid ${palette.primaryDark} !important;
        box-shadow: 0 4px 20px ${palette.primaryDark}44 !important;
        border-radius: 8px !important;
        padding: 1rem !important;
      }
      
      /* Enhancement 25.4: Input styling */
      input, textarea, select {
        background: ${palette.background}ee !important;
        color: ${palette.text} !important;
        border: 2px solid ${palette.primaryDark} !important;
        border-radius: 6px !important;
        padding: 0.5rem !important;
        transition: all 0.3s ease !important;
      }
      
      input:focus, textarea:focus, select:focus {
        border-color: ${palette.primary} !important;
        box-shadow: 0 0 15px ${palette.primary}44 !important;
        outline: none !important;
      }
      
      /* Enhancement 25.4: Table styling */
      table {
        border-collapse: collapse !important;
        width: 100% !important;
      }
      
      th {
        background: linear-gradient(135deg, ${palette.primaryDark}, ${palette.primary}) !important;
        color: ${palette.text} !important;
        padding: 0.75rem !important;
        border: 1px solid ${palette.primary} !important;
      }
      
      td {
        padding: 0.75rem !important;
        border: 1px solid ${palette.primaryDark}44 !important;
        color: ${palette.text} !important;
      }
      
      tr:hover {
        background: ${palette.primaryDark}22 !important;
      }
    `;
    
    styleEl.textContent = css;
  } catch (e) {
    console.error('Failed to apply palette to iframe:', e);
  }
};
