/**
 * Audio Effects Service for Haunted Nexus
 * Handles thunder, electric surges, and other sound effects
 */

class AudioEffectsService {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Enhancement L: Thunder crack for Haunted Map dangerous pins
  playThunderCrack() {
    if (this.isMuted) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      // Thunder characteristics
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 50;
      
      // Low-pass filter for rumble
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 1;
      
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.01); // Sharp attack
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Long decay
      
      // Frequency sweep for crack effect
      oscillator.frequency.linearRampToValueAtTime(30, now + 0.1);
      
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      
      // Screen flash effect
      this.triggerScreenFlash();
      
      // Map shake effect
      this.triggerMapShake();
      
      console.log('⚡ Thunder crack!');
      
    } catch (error) {
      console.error('Error playing thunder:', error);
    }
  }

  // Enhancement M: Electric surge for Reanimator
  playElectricSurge() {
    if (this.isMuted) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      // Electric characteristics
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 100;
      
      // High-pass filter for electric crackle
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      filter.Q.value = 2;
      
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      // Frequency sweep for electric surge
      oscillator.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
      
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      
      console.log('⚡ Electric surge!');
      
    } catch (error) {
      console.error('Error playing electric surge:', error);
    }
  }

  // Electric burst for completion
  playElectricBurst() {
    if (this.isMuted) return;
    
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.value = 1500;
      
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      // Power-down sweep
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      
      oscillator.connect(gain);
      gain.connect(this.audioContext.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      
    } catch (error) {
      console.error('Error playing electric burst:', error);
    }
  }

  // Screen flash for thunder
  triggerScreenFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.8;
      pointer-events: none;
      z-index: 9999;
      will-change: opacity;
    `;
    
    document.body.appendChild(flash);
    
    // Fade out quickly
    setTimeout(() => {
      flash.style.transition = 'opacity 0.1s';
      flash.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
      if (flash.parentNode) {
        flash.remove();
      }
    }, 150);
  }

  // Map shake for thunder
  triggerMapShake() {
    const map = document.querySelector('.leaflet-container');
    if (map) {
      map.style.animation = 'mapShake 0.3s';
      setTimeout(() => {
        map.style.animation = '';
      }, 300);
    }
  }

  // Mute/unmute
  setMuted(muted) {
    this.isMuted = muted;
  }
}

// Create and export singleton
export const audioEffects = new AudioEffectsService();

// Make globally available
if (typeof window !== 'undefined') {
  window.audioEffects = audioEffects;
}

export default audioEffects;
