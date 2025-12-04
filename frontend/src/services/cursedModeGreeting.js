/**
 * Mode Greeting Service
 * Plays greetings when switching between Normal and Cursed modes
 * - Normal Mode: "Welcome to the Haunted Nexus"
 * - Cursed Mode: "Welcome to Haunted Hell"
 */

import audioPriority from './audioPriority';

class CursedModeGreetingService {
  constructor() {
    this.isPlaying = false;
    this.voicesLoaded = false;
    this.cachedVoices = [];
    
    // Pre-load voices on initialization
    this.preloadVoices();
  }

  /**
   * Pre-load voices to avoid delays
   */
  preloadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    // Try to get voices immediately
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.cachedVoices = voices;
      this.voicesLoaded = true;
      console.log(`🎭 Voices pre-loaded: ${voices.length} available`);
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
        this.voicesLoaded = true;
        console.log(`🎭 Voices loaded: ${this.cachedVoices.length} available`);
      };
    }
  }

  /**
   * Play the cursed mode greeting
   */
  playGreeting() {
    this.playModeGreeting(true);
  }

  /**
   * Play the normal mode greeting
   */
  playNormalGreeting() {
    this.playModeGreeting(false);
  }

  /**
   * Ensure voices are loaded (uses cached voices if available)
   */
  ensureVoicesLoaded() {
    return new Promise((resolve) => {
      if (this.voicesLoaded && this.cachedVoices.length > 0) {
        resolve(this.cachedVoices);
      } else {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.cachedVoices = voices;
          this.voicesLoaded = true;
          resolve(voices);
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            this.cachedVoices = window.speechSynthesis.getVoices();
            this.voicesLoaded = true;
            resolve(this.cachedVoices);
          };
        }
      }
    });
  }

  /**
   * Play greeting based on mode
   * @param {boolean} isCursed - True for cursed mode, false for normal mode
   */
  async playModeGreeting(isCursed) {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech to ensure clean state
    if (window.speechSynthesis.speaking) {
      console.log('🛑 Cancelling previous speech');
      window.speechSynthesis.cancel();
      this.isPlaying = false;
      audioPriority.notifyFinished('tts');
    }

    // Request audio priority
    const canPlay = audioPriority.requestPlay('tts', () => {
      console.log(`${isCursed ? '🔥' : '💀'} Playing ${isCursed ? 'cursed' : 'normal'} mode greeting`);
    });

    if (!canPlay) {
      console.warn('Mode greeting blocked by higher priority audio');
      return;
    }

    this.isPlaying = true;

    try {
      // Ensure voices are loaded
      const voices = await this.ensureVoicesLoaded();
      
      // Create the utterance with appropriate message
      const message = isCursed ? 'Welcome to Haunted Hell' : 'Welcome to the Haunted Nexus';
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Spooky voice settings - deep, slow, haunting
      utterance.pitch = 0.4; // Very low pitch for demonic effect
      utterance.rate = 0.6;  // Slow rate for creepy effect
      utterance.volume = 0.8; // Loud and clear
      
      // Select a deep, ominous voice if available
      const spookyVoice = voices.find(v => 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('deep') ||
        v.name.toLowerCase().includes('dark') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('david')
      );
      
      if (spookyVoice) {
        utterance.voice = spookyVoice;
        console.log(`🎭 Using spooky voice: ${spookyVoice.name}`);
      } else {
        console.log(`🎭 Using default voice (${voices.length} voices available)`);
      }

      // Event handlers
      utterance.onstart = () => {
        console.log(`${isCursed ? '🔥' : '💀'} Greeting started: "${message}"`);
      };

      utterance.onend = () => {
        this.isPlaying = false;
        audioPriority.notifyFinished('tts');
        console.log(`${isCursed ? '🔥' : '💀'} Greeting ended`);
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        audioPriority.notifyFinished('tts');
        console.error('Mode greeting error:', event);
      };

      // Speak the greeting
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      this.isPlaying = false;
      audioPriority.notifyFinished('tts');
      console.error('Error playing mode greeting:', error);
    }
  }

  /**
   * Reset the service (useful for testing)
   */
  reset() {
    this.isPlaying = false;
    console.log('🔄 Mode greetings reset');
  }
}

// Singleton instance
export const cursedModeGreeting = new CursedModeGreetingService();
export default cursedModeGreeting;
