/**
 * Visual Effects Service for Haunted Nexus
 * Handles screen effects, glitches, and atmospheric visuals
 */

class VisualEffectsService {
  constructor() {
    this.isActive = true;
  }

  // Enhancement E: Screen blur ripple when ghost whisper plays
  triggerBlurRipple() {
    if (!this.isActive) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(8px);
      background: rgba(0, 0, 0, 0.1);
      pointer-events: none;
      z-index: 9999;
      animation: blurRipple 0.65s ease-out forwards;
      will-change: backdrop-filter, opacity;
    `;
    
    document.body.appendChild(overlay);
    
    // Add chromatic aberration edges
    overlay.style.boxShadow = 'inset 0 0 50px rgba(255, 0, 255, 0.3), inset 0 0 50px rgba(0, 255, 255, 0.3)';
    
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 650);
  }

  // Enhancement F: Blood smear glitch (cursed mode)
  triggerBloodSmear() {
    if (!this.isActive) return;

    const smear = document.createElement('div');
    smear.style.cssText = `
      position: fixed;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(139, 0, 0, 0.7) 30%, 
        rgba(139, 0, 0, 0.9) 50%, 
        rgba(139, 0, 0, 0.7) 70%, 
        transparent 100%);
      pointer-events: none;
      z-index: 9999;
      animation: bloodSmear 0.3s ease-out forwards;
      mix-blend-mode: multiply;
      will-change: left;
    `;
    
    document.body.appendChild(smear);
    
    // Add static distortion
    smear.style.filter = 'contrast(1.5) saturate(1.2)';
    
    setTimeout(() => {
      if (smear.parentNode) {
        smear.remove();
      }
    }, 300);
  }

  // Enhancement I: Paranormal temperature drop visual
  triggerTemperatureDrop() {
    if (!this.isActive) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, 
        rgba(0, 50, 100, 0.1) 0%, 
        rgba(0, 50, 100, 0.2) 100%);
      pointer-events: none;
      z-index: 9998;
      animation: temperatureDrop 3s ease-out forwards;
      will-change: opacity, filter;
    `;
    
    document.body.appendChild(overlay);
    
    // Add fog effect
    const fog = document.createElement('div');
    fog.style.cssText = `
      position: fixed;
      bottom: -50px;
      left: 0;
      width: 100%;
      height: 200px;
      background: linear-gradient(0deg, rgba(200, 200, 255, 0.3) 0%, transparent 100%);
      pointer-events: none;
      z-index: 9997;
      animation: risingFog 3s ease-out forwards;
      will-change: transform, opacity;
    `;
    
    document.body.appendChild(fog);
    
    // Increase wind volume if ambient audio available
    if (window.ambientAudio && !window.ambientAudio.isMuted) {
      // Boost wind by 10% - would need to implement in ambientAudio
      console.log('🌬️ Temperature drop - wind boost');
    }
    
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
      if (fog.parentNode) fog.remove();
    }, 3000);
  }

  // Enhancement J: Jump-scare glitch (cursed mode)
  triggerJumpScareGlitch() {
    if (!this.isActive) return;

    const glitch = document.createElement('div');
    glitch.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      pointer-events: none;
      z-index: 10000;
      animation: jumpScare 0.25s steps(4) forwards;
      will-change: opacity, filter;
    `;
    
    document.body.appendChild(glitch);
    
    // Add ghost silhouette flash
    setTimeout(() => {
      if (glitch.parentNode) {
        glitch.style.background = 'radial-gradient(circle, rgba(0,0,0,0.9) 30%, transparent 70%)';
        glitch.style.backgroundSize = '200px 400px';
        glitch.style.backgroundPosition = 'center center';
        glitch.style.backgroundRepeat = 'no-repeat';
      }
    }, 125);
    
    setTimeout(() => {
      if (glitch.parentNode) {
        glitch.remove();
      }
    }, 250);
  }

  // Enhancement Package: Room shake effect for footsteps
  triggerRoomShake() {
    if (!this.isActive) return;

    const root = document.documentElement;
    const originalTransform = root.style.transform || '';
    
    // Random duration between 250-350ms
    const duration = 250 + Math.random() * 100;
    
    // Random shake intensity (2-4px translation, 0.25-0.5 degree rotation)
    const shakeX = 2 + Math.random() * 2;
    const shakeY = 2 + Math.random() * 2;
    const rotation = 0.25 + Math.random() * 0.25;
    
    // Apply shake using GPU transforms
    const startTime = performance.now();
    
    const shake = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Oscillating shake with decay
        const intensity = 1 - progress; // Decay over time
        const oscillation = Math.sin(progress * Math.PI * 8); // 8 oscillations
        
        const x = oscillation * shakeX * intensity;
        const y = oscillation * shakeY * intensity * 0.7; // Less vertical shake
        const rot = oscillation * rotation * intensity;
        
        // Use transform3d for GPU acceleration
        root.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
        root.style.willChange = 'transform';
        
        requestAnimationFrame(shake);
      } else {
        // Reset transform
        root.style.transform = originalTransform;
        root.style.willChange = 'auto';
      }
    };
    
    requestAnimationFrame(shake);
    
    console.log(`🏚️ Room shake triggered (${duration.toFixed(0)}ms)`);
  }

  // Disable effects (for performance or user preference)
  disable() {
    this.isActive = false;
  }

  // Enable effects
  enable() {
    this.isActive = true;
  }
}

// Create and export singleton instance
export const visualEffects = new VisualEffectsService();

// Make available globally for easy access
if (typeof window !== 'undefined') {
  window.visualEffects = visualEffects;
}

export default visualEffects;
