import audioPriority from './audioPriority';

/**
 * Ambient Audio Service - ENHANCEMENT PACKAGE
 * Generates atmospheric sounds using Web Audio API
 * No external audio files needed - all sounds are synthesized
 * 
 * Features:
 * - Base volume: 20-30% (configurable via intensity)
 * - Three intensity modes: Low (10-15%), Medium (25-30%), High (40-50%)
 * - Auto-ducking: -50% during whispers, full mute during footsteps/TTS/recording
 * - Smooth restore: 600-700ms delay after events
 * - Audio priority system integration
 */

class AmbientAudioService {
  constructor() {
    this.audioContext = null;
    this.currentSound = null;
    this.isMuted = false;
    
    // Intensity system - Enhancement Package
    this.intensity = 'medium'; // 'low' | 'medium' | 'high'
    this.intensityVolumes = {
      low: 0.10,     // 10% (20% reduction from 12.5%)
      medium: 0.22,  // 22% (20% reduction from 27.5%)
      high: 0.36     // 36% (20% reduction from 45%)
    };
    this.volume = this.intensityVolumes.medium; // Default to medium
    
    // Gain node architecture
    this.gainNode = null;
    this.masterGain = null;
    
    this.activeOscillators = [];
    
    // Audio state flags
    this.isSpeaking = false;      // TTS flag
    this.isRecording = false;     // Recording flag
    this.isFootstepMode = false;  // Footstep priority flag (highest)
    this.isWhisperMode = false;   // Whisper ducking flag
    
    this.fadeTimeout = null;
    this.crossfadeTimeout = null;
    
    // Load saved preferences
    const savedMute = localStorage.getItem('ambientMuted');
    const savedIntensity = localStorage.getItem('ambientIntensity');
    
    this.isMuted = savedMute === 'true';
    if (savedIntensity && this.intensityVolumes[savedIntensity]) {
      this.intensity = savedIntensity;
      this.volume = this.intensityVolumes[savedIntensity];
    }

    // Register with audio priority manager
    audioPriority.registerAmbientController(this);
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain node architecture with proper gain staging
      this.gainNode = this.audioContext.createGain();
      this.masterGain = this.audioContext.createGain();
      
      // Add compressor to prevent clipping and over-amplification
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
      this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
      
      // Connect: source -> gainNode -> masterGain -> compressor -> destination
      this.gainNode.connect(this.masterGain);
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.audioContext.destination);
      
      // Set initial values using gainNode ramps (no pops)
      const now = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, now);
      this.masterGain.gain.setValueAtTime(0.9, now); // Slightly below 1.0 to prevent clipping
    }
  }

  /**
   * Set intensity level (Low / Medium / High)
   * Crossfades smoothly in 300ms
   */
  setIntensity(level) {
    if (!this.intensityVolumes[level]) {
      console.warn(`Invalid intensity level: ${level}`);
      return;
    }
    
    this.intensity = level;
    this.volume = this.intensityVolumes[level];
    
    // Save preference
    localStorage.setItem('ambientIntensity', level);
    
    // Smooth crossfade if audio is playing
    if (this.gainNode && this.audioContext && !this.isMuted) {
      const now = this.audioContext.currentTime;
      
      // Cancel any scheduled changes
      this.gainNode.gain.cancelScheduledValues(now);
      
      // Crossfade to new volume in 300ms
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.3);
    }
  }

  /**
   * Get current intensity level
   */
  getIntensity() {
    return this.intensity;
  }

  stop() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = null;
    }
    // Stop all active oscillators
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeOscillators = [];
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('ambientMuted', this.isMuted.toString());
    
    if (this.gainNode && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : this.volume, 
        now + 0.2
      );
    }
    
    return this.isMuted;
  }

  /**
   * FULLY MUTE ambient audio when TTS/voice starts
   * Priority: TTS Speaking (2nd highest)
   */
  pauseForSpeech() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isSpeaking = true;
    const now = this.audioContext.currentTime;
    
    // Full mute in 200ms using gainNode ramps
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
  }

  /**
   * Resume ambient audio 600-700ms after TTS/voice ends
   * Smooth restore over 600-700ms
   */
  resumeAfterSpeech() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isSpeaking = false;
    
    // Clear any pending fade timeout
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    // Wait 650ms before resuming (600-700ms range)
    this.fadeTimeout = setTimeout(() => {
      if (!this.isSpeaking && !this.isMuted && !this.isRecording && !this.isFootstepMode && !this.isWhisperMode) {
        const now = this.audioContext.currentTime;
        
        // Fade in over 650ms using gainNode ramps
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.65);
      }
    }, 650);
  }

  /**
   * FULLY MUTE ambient audio when recording starts
   */
  pauseForRecording() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isRecording = true;
    const now = this.audioContext.currentTime;
    
    // Full mute in 200ms using gainNode ramps
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
  }

  /**
   * Resume ambient audio 600-700ms after recording ends
   */
  resumeAfterRecording() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isRecording = false;
    
    // Clear any pending timeout
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    // Wait 650ms then resume if not muted
    this.fadeTimeout = setTimeout(() => {
      if (!this.isRecording && !this.isMuted && !this.isSpeaking && !this.isFootstepMode && !this.isWhisperMode) {
        const now = this.audioContext.currentTime;
        
        // Fade in over 650ms using gainNode ramps
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.65);
      }
    }, 650);
  }

  /**
   * FULLY MUTE ambient audio when footsteps play (HIGHEST PRIORITY)
   * Priority: Footsteps (1 - highest)
   */
  pauseForFootsteps() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isFootstepMode = true;
    const now = this.audioContext.currentTime;
    
    // Full mute in 150ms using gainNode ramps (no pops)
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
  }

  /**
   * Resume ambient audio 700ms after footsteps end
   * Smooth restore over 700ms
   */
  resumeAfterFootsteps() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isFootstepMode = false;
    
    // Clear any pending timeout
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    // Wait exactly 700ms then resume if not muted
    this.fadeTimeout = setTimeout(() => {
      if (!this.isFootstepMode && !this.isMuted && !this.isSpeaking && !this.isRecording && !this.isWhisperMode) {
        const now = this.audioContext.currentTime;
        
        // Fade in over 700ms using gainNode ramps
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.7);
      }
    }, 700);
  }

  /**
   * DUCK ambient by -50% during whisper events
   * Priority: Whisper (3)
   */
  duckForWhisper() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isWhisperMode = true;
    const now = this.audioContext.currentTime;
    
    // Duck to 50% of current volume in 200ms using gainNode ramps
    const targetVolume = this.volume * 0.5;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.2);
  }

  /**
   * Resume ambient audio 600-700ms after whisper ends
   */
  resumeAfterWhisper() {
    if (!this.gainNode || !this.audioContext) return;
    
    this.isWhisperMode = false;
    
    // Clear any pending timeout
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    // Wait 650ms then restore if not muted
    this.fadeTimeout = setTimeout(() => {
      if (!this.isWhisperMode && !this.isMuted && !this.isSpeaking && !this.isRecording && !this.isFootstepMode) {
        const now = this.audioContext.currentTime;
        
        // Restore to full volume over 650ms using gainNode ramps
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.65);
      }
    }, 650);
  }

  // Generate whispers and faint laughs (Ghost Chat) - Enhanced for clarity
  playWhispersAndLaughs() {
    this.init();
    this.stop();

    const playWhisper = () => {
      if (this.isMuted) return;
      
      // Primary whisper layer - mid-range frequencies (700-900 Hz)
      const oscillator = this.audioContext.createOscillator();
      const filter = this.audioContext.createBiquadFilter();
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      const whisperGain = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 700 + Math.random() * 200; // 700-900 Hz for clarity
      
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 2;
      
      lfo.frequency.value = 1 + Math.random() * 2; // Increased modulation
      lfoGain.gain.value = 150; // Increased depth for more clarity
      
      whisperGain.gain.value = 0.4; // Most audible
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      oscillator.connect(filter);
      filter.connect(whisperGain);
      whisperGain.connect(this.gainNode);
      
      oscillator.start();
      lfo.start();
      this.activeOscillators.push(oscillator, lfo);
      
      // Secondary whisper layer - filtered noise
      const bufferSize = this.audioContext.sampleRate * 2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      
      const noise = this.audioContext.createBufferSource();
      const noiseFilter = this.audioContext.createBiquadFilter();
      const noiseGain = this.audioContext.createGain();
      
      noise.buffer = buffer;
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 750;
      noiseFilter.Q.value = 3;
      noiseGain.gain.value = 0.08; // Secondary layer gain
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.gainNode);
      noise.start();
      
      const duration = 2000 + Math.random() * 3000;
      
      setTimeout(() => {
        oscillator.stop();
        lfo.stop();
        noise.stop();
      }, duration);
      
      setTimeout(playWhisper, 5000 + Math.random() * 10000);
    };

    playWhisper();
  }

  // Generate cold wind and heartbeat (Haunted Journal)
  playWindAndHeartbeat() {
    this.init();
    this.stop();

    // Wind sound
    const playWind = () => {
      if (this.isMuted) return;
      
      const bufferSize = this.audioContext.sampleRate * 2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      
      const noise = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      
      noise.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      
      noise.connect(filter);
      filter.connect(this.gainNode);
      noise.start();
      
      setTimeout(() => noise.stop(), 3000);
      setTimeout(playWind, 4000 + Math.random() * 6000);
    };

    // Heartbeat sound
    const playHeartbeat = () => {
      if (this.isMuted) return;
      
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 60;
      
      const envelope = this.audioContext.createGain();
      envelope.gain.value = 0;
      
      oscillator.connect(envelope);
      envelope.connect(this.gainNode);
      
      oscillator.start();
      envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
      
      setTimeout(() => oscillator.stop(), 300);
      setTimeout(playHeartbeat, 1000 + Math.random() * 500);
    };

    playWind();
    playHeartbeat();
  }

  // Generate glitch static (Frankenstein Stitcher)
  playGlitchStatic() {
    this.init();
    this.stop();

    const playStatic = () => {
      if (this.isMuted) return;
      
      const bufferSize = this.audioContext.sampleRate * 0.5;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      
      const noise = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      
      noise.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      
      noise.connect(filter);
      filter.connect(this.gainNode);
      noise.start();
      
      setTimeout(() => noise.stop(), 500);
      setTimeout(playStatic, 3000 + Math.random() * 7000);
    };

    playStatic();
  }

  // Generate wind and distant screams (Haunted Map) - Enhanced screams
  playWindAndScreams() {
    this.init();
    this.stop();

    // Wind
    const playWind = () => {
      if (this.isMuted) return;
      
      const bufferSize = this.audioContext.sampleRate * 3;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.28;
      }
      
      const noise = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      const windGain = this.audioContext.createGain();
      
      noise.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      windGain.gain.value = 0.25; // Clear wind
      
      noise.connect(filter);
      filter.connect(windGain);
      windGain.connect(this.gainNode);
      noise.start();
      
      setTimeout(() => noise.stop(), 3000);
      setTimeout(playWind, 5000 + Math.random() * 5000);
    };

    // Distant screams - more distinguishable
    const playScream = () => {
      if (this.isMuted) return;
      
      const oscillator = this.audioContext.createOscillator();
      const filter = this.audioContext.createBiquadFilter();
      const screamGain = this.audioContext.createGain();
      const envelope = this.audioContext.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 800;
      
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 5;
      
      screamGain.gain.value = 0.18; // Louder but still subtle
      envelope.gain.value = 0;
      
      oscillator.connect(filter);
      filter.connect(envelope);
      envelope.connect(screamGain);
      screamGain.connect(this.gainNode);
      
      oscillator.start();
      this.activeOscillators.push(oscillator);
      
      // Scream envelope
      const now = this.audioContext.currentTime;
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(1, now + 0.3);
      envelope.gain.linearRampToValueAtTime(0.7, now + 0.6);
      envelope.gain.linearRampToValueAtTime(0, now + 1.2);
      
      setTimeout(() => oscillator.stop(), 1300);
      setTimeout(playScream, 15000 + Math.random() * 20000);
    };

    playWind();
    setTimeout(playScream, 8000); // First scream after 8 seconds
  }

  // Generate radio static and distortion (Reanimator) - Sharper clarity
  playRadioStatic() {
    this.init();
    this.stop();

    const playStatic = () => {
      if (this.isMuted) return;
      
      const bufferSize = this.audioContext.sampleRate * 1;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.22;
      }
      
      const noise = this.audioContext.createBufferSource();
      const filter = this.audioContext.createBiquadFilter();
      const staticGain = this.audioContext.createGain();
      
      noise.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 2500; // Raised cutoff for sharper static
      filter.Q.value = 1.5;
      staticGain.gain.value = 0.22; // Sharper but not overpowering
      
      noise.connect(filter);
      filter.connect(staticGain);
      staticGain.connect(this.gainNode);
      noise.start();
      
      setTimeout(() => noise.stop(), 1000);
      setTimeout(playStatic, 4000 + Math.random() * 6000);
    };

    playStatic();
  }

  /**
   * Get current volume level
   * Returns the current volume (0-1 range)
   */
  getVolume() {
    if (this.isMuted) return 0;
    return this.volume;
  }

  /**
   * Set volume level temporarily
   * @param {number} newVolume - Volume level (0-1 range)
   */
  setVolume(newVolume) {
    if (!this.gainNode || !this.audioContext) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    if (!this.isMuted) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(clampedVolume, now + 0.1);
    }
  }
}

// Singleton instance
export const ambientAudio = new AmbientAudioService();
export default ambientAudio;
