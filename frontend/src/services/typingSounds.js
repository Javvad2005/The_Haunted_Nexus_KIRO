/**
 * Typing Sound Effects Service
 * Plays creaking door and thud sounds while user types
 */

class TypingSoundsService {
  constructor() {
    this.audioContext = null;
    this.lastPlayTime = 0;
    this.throttleMs = 150; // Play max once every 150ms
    this.volume = 0.15; // 15% volume
    this.soundIndex = 0; // Alternate between sounds
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play creaking door sound
  playCreakingDoor() {
    this.init();
    
    const currentTime = this.audioContext.currentTime;
    
    // Create oscillator for creak
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Creaking frequency sweep (200-400Hz)
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, currentTime + 0.3);
    oscillator.frequency.linearRampToValueAtTime(250, currentTime + 0.6);
    
    // Bandpass filter for wood-like quality
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 3;
    
    // Envelope for creak
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.7, currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play and cleanup
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.65);
  }

  // Play thud sound
  playThud() {
    this.init();
    
    const currentTime = this.audioContext.currentTime;
    
    // Create low frequency thud
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Deep thud frequency (60-80Hz)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(80, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, currentTime + 0.15);
    
    // Lowpass filter for deep bass
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    filter.Q.value = 2;
    
    // Sharp attack, quick decay
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 1.2, currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
    
    // Add noise for impact texture
    const bufferSize = this.audioContext.sampleRate * 0.05;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const noiseFilter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 200;
    
    noiseGain.gain.setValueAtTime(this.volume * 0.5, currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.05);
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);
    
    // Play and cleanup
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.25);
    noise.start(currentTime);
    noise.stop(currentTime + 0.05);
  }

  // Play typing sound (alternates between creak and thud)
  playTypingSound() {
    const now = Date.now();
    
    // Throttle to prevent too many sounds
    if (now - this.lastPlayTime < this.throttleMs) {
      return;
    }
    
    this.lastPlayTime = now;
    
    // Alternate between sounds with some randomness
    const random = Math.random();
    
    if (random < 0.4) {
      this.playCreakingDoor();
    } else if (random < 0.8) {
      this.playThud();
    } else {
      // Occasionally play both for variety
      this.playThud();
      setTimeout(() => this.playCreakingDoor(), 50);
    }
  }

  // Attach to input elements
  attachToInput(inputElement) {
    if (!inputElement) return;
    
    const handler = () => this.playTypingSound();
    inputElement.addEventListener('keydown', handler);
    
    // Return cleanup function
    return () => inputElement.removeEventListener('keydown', handler);
  }

  // Attach to textarea elements
  attachToTextarea(textareaElement) {
    return this.attachToInput(textareaElement);
  }
}

// Singleton instance
export const typingSounds = new TypingSoundsService();
export default typingSounds;
