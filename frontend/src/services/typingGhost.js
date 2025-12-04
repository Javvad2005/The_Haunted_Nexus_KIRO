/**
 * Ghost Typing Sound Effect
 * Plays subtle scratch-tap sounds when user types
 */

class TypingGhostService {
  constructor() {
    this.audioContext = null;
    this.lastPlayTime = 0;
    this.throttleMs = 60; // Play max once every 60ms
    this.volume = 0.12; // 12% volume
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Enhancement N: Ghost typing scratch sound with random pitch
  playTypingSound() {
    this.init();
    
    const now = Date.now();
    
    // Enhancement N: Throttle to 60ms
    if (now - this.lastPlayTime < this.throttleMs) {
      return;
    }
    
    this.lastPlayTime = now;
    
    // Create short scratch-tap sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Enhancement N: Random pitch (800-1200Hz)
    const randomPitch = 800 + Math.random() * 400;
    oscillator.frequency.value = randomPitch;
    oscillator.type = 'sawtooth'; // More scratchy than square
    
    // Enhancement N: High-pass filter for scratchy texture
    filter.type = 'highpass';
    filter.frequency.value = 600;
    filter.Q.value = 2;
    
    // Enhancement N: 12% volume, quick envelope
    const currentTime = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + 0.005); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.04); // Fast decay
    
    // Add frequency modulation for scratch effect
    oscillator.frequency.linearRampToValueAtTime(randomPitch * 0.8, currentTime + 0.02);
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play and cleanup
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.05);
  }
}

// Singleton instance
export const typingGhost = new TypingGhostService();
export default typingGhost;
