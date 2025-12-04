import ambientAudio from './ambientAudio';
import audioPriority from './audioPriority';
import visualEffects from './visualEffects';

/**
 * Ghost Footsteps Sound Effect
 * Plays random, distant footstep sounds for atmospheric horror
 * HIGHEST PRIORITY AUDIO - Mutes all other sounds
 */

class GhostFootstepsService {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.footstepInterval = null;
    this.volume = 0.70; // 70% volume (40% increase from baseline 0.5)
    this.reverbMix = 0.25; // Enhancement Package: 25% reverb - Medium reverb tail
    this.isMuted = false;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Enhancement C: Create reverb impulse response
  createReverb() {
    const convolver = this.audioContext.createConvolver();
    const impulseLength = this.audioContext.sampleRate * 0.5; // 0.5s reverb
    const impulse = this.audioContext.createBuffer(2, impulseLength, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        const decay = Math.exp(-3 * i / impulseLength);
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    
    convolver.buffer = impulse;
    return convolver;
  }

  // Create a single footstep sound - Enhancement C: LOUD, CLEAR, ISOLATED
  createFootstep(isLeftFoot = true, stepIndex = 0) {
    if (!this.audioContext || this.isMuted) return;

    const now = this.audioContext.currentTime;
    
    // Create oscillator for the "thud" sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Low frequency for footstep thud (80-120 Hz)
    const baseFreq = 80 + Math.random() * 40;
    oscillator.frequency.setValueAtTime(baseFreq, now);
    oscillator.type = 'sine';
    
    // Low-pass filter for muffled, distant sound
    filter.type = 'lowpass';
    filter.frequency.value = 200 + Math.random() * 100;
    filter.Q.value = 1;
    
    // Enhancement Package: Add low-frequency thump layer (40-60 Hz)
    const thumpOsc = this.audioContext.createOscillator();
    const thumpGain = this.audioContext.createGain();
    const thumpFilter = this.audioContext.createBiquadFilter();
    
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(40 + Math.random() * 20, now); // 40-60 Hz
    
    thumpFilter.type = 'lowpass';
    thumpFilter.frequency.value = 80;
    thumpFilter.Q.value = 2;
    
    // Thump envelope - short and punchy
    thumpGain.gain.setValueAtTime(0, now);
    thumpGain.gain.linearRampToValueAtTime(this.volume * 0.8, now + 0.01);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    // Enhancement C: Louder envelope (50% volume)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    // Enhancement C: Directional panning (L → R → Behind)
    const panPositions = [-0.7, 0, 0.7, 0]; // Left, Center, Right, Behind (center)
    const panValue = panPositions[stepIndex % panPositions.length];
    
    // Enhancement C: Add reverb (15-20%)
    const convolver = this.createReverb();
    const reverbGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    
    reverbGain.gain.value = this.reverbMix; // 18% wet
    dryGain.gain.value = 1 - this.reverbMix; // 82% dry
    
    if (this.audioContext.createStereoPanner) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = panValue;
      
      // Dry signal
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(dryGain);
      dryGain.connect(panner);
      panner.connect(this.audioContext.destination);
      
      // Wet signal (reverb)
      gainNode.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(panner);
      
      // Thump layer (low-frequency)
      thumpOsc.connect(thumpFilter);
      thumpFilter.connect(thumpGain);
      thumpGain.connect(panner);
    } else {
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(dryGain);
      dryGain.connect(this.audioContext.destination);
      
      gainNode.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(this.audioContext.destination);
      
      // Thump layer (low-frequency)
      thumpOsc.connect(thumpFilter);
      thumpFilter.connect(thumpGain);
      thumpGain.connect(this.audioContext.destination);
    }
    
    // Play the footstep
    oscillator.start(now);
    oscillator.stop(now + 0.2);
    
    // Play the thump layer
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.15);
    
    // Add subtle "scrape" layer for realism
    this.addFootstepScrape(now, isLeftFoot);
  }

  // Add a subtle scrape/shuffle sound to the footstep
  addFootstepScrape(startTime, isLeftFoot) {
    if (!this.audioContext || this.isMuted) return;

    // Create noise buffer for scrape
    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const noise = this.audioContext.createBufferSource();
    const noiseFilter = this.audioContext.createBiquadFilter();
    const noiseGain = this.audioContext.createGain();
    
    noise.buffer = buffer;
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 800;
    
    // Very quiet scrape
    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.02);
    noiseGain.gain.linearRampToValueAtTime(0, startTime + 0.1);
    
    // Pan slightly
    const panValue = isLeftFoot ? -0.15 : 0.15;
    if (this.audioContext.createStereoPanner) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = panValue;
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(panner);
      panner.connect(this.audioContext.destination);
    } else {
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioContext.destination);
    }
    
    noise.start(startTime);
  }

  // Play a sequence of footsteps (walking pattern)
  playFootstepSequence(numSteps = 3) {
    this.init();
    
    let isLeftFoot = Math.random() > 0.5;
    const stepInterval = 400 + Math.random() * 200; // 400-600ms between steps
    
    for (let i = 0; i < numSteps; i++) {
      setTimeout(() => {
        this.createFootstep(isLeftFoot);
        isLeftFoot = !isLeftFoot; // Alternate feet
      }, i * stepInterval);
    }
  }

  // Start random footsteps in the background
  start() {
    if (this.isPlaying) return;
    
    this.init();
    this.isPlaying = true;
    
    const playRandomFootsteps = () => {
      if (!this.isPlaying) return;
      
      // Request to play footsteps (HIGHEST PRIORITY)
      const canPlay = audioPriority.requestPlay('footsteps', () => {
        // Mute ambient audio when footsteps start
        ambientAudio.pauseForFootsteps();
      });
      
      if (canPlay) {
        // Random number of steps (2-5)
        const numSteps = 2 + Math.floor(Math.random() * 4);
        this.playFootstepSequence(numSteps);
        
        // Trigger room shake effect
        visualEffects.triggerRoomShake();
        
        // Calculate total duration of footstep sequence
        const stepInterval = 400 + Math.random() * 200;
        const totalDuration = numSteps * stepInterval + 700; // +700ms safe delay
        
        // Notify priority manager when footsteps finish
        setTimeout(() => {
          audioPriority.notifyFinished('footsteps');
          ambientAudio.resumeAfterFootsteps();
        }, totalDuration);
      }
      
      // Random interval before next sequence (15-35 seconds)
      const nextInterval = 15000 + Math.random() * 20000;
      this.footstepInterval = setTimeout(playRandomFootsteps, nextInterval);
    };
    
    // Start first sequence after a short delay
    setTimeout(playRandomFootsteps, 5000 + Math.random() * 5000);
  }

  // Stop footsteps
  stop() {
    this.isPlaying = false;
    if (this.footstepInterval) {
      clearTimeout(this.footstepInterval);
      this.footstepInterval = null;
    }
    
    // Notify priority manager and resume ambient
    audioPriority.notifyFinished('footsteps');
    setTimeout(() => {
      ambientAudio.resumeAfterFootsteps();
    }, 700);
  }

  // Mute/unmute
  setMuted(muted) {
    this.isMuted = muted;
  }

  // Adjust volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

// Singleton instance
export const ghostFootsteps = new GhostFootstepsService();
export default ghostFootsteps;
