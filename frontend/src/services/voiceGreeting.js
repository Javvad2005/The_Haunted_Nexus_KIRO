// Voice Greeting Service
// Plays welcome messages when entering different features
// Ensures greetings only play once per page visit

import ghostVoice from './ghostVoice';

class VoiceGreetingService {
  constructor() {
    // Track last greeting time for each page (to prevent rapid repetition)
    this.lastGreetingTime = {};
    
    // Track if this is first visit to homepage
    this.hasVisitedHomepage = false;
    
    // Cooldown period in milliseconds (5 seconds)
    this.cooldownPeriod = 5000;
    
    // Greeting messages for each page
    this.greetings = {
      '/': 'Welcome to The Haunted Nexus', // First visit
      '/return': 'You have returned to the Nexus', // Return visit
      '/ghost-chat': 'Welcome to Ghost Chat',
      '/haunted-journal': 'Welcome to the Haunted Journal',
      '/haunted-map': 'Welcome to the Haunted Map',
      '/reanimator': 'Welcome to the Reanimator',
      '/frankenstein-stitcher': 'Welcome to the Frankenstein Stitcher',
      '/cursed-atelier': 'Welcome to the Cursed Atelier'
    };
    
    // Voice settings for greetings - will be controlled by master volume
    this.greetingVoiceSettings = {
      pitch: 0.6,
      rate: 0.75,
      volume: 1.0, // Will be multiplied by master volume
      preset: 'eerie'
    };
    
    // Master volume (controlled by volume controller)
    this.masterVolume = 1.0;
  }

  // Set master volume (called by volume controller)
  setMasterVolume(volume) {
    this.masterVolume = volume;
    console.log(`🔊 Voice greeting master volume set to ${(volume * 100).toFixed(0)}%`);
  }

  // Play greeting for a specific page
  async playGreeting(pathname, isPageReload = false) {
    // Special handling for homepage
    let greeting;
    if (pathname === '/') {
      if (!this.hasVisitedHomepage || isPageReload) {
        // First visit or reload - play welcome message
        greeting = this.greetings['/'];
        this.hasVisitedHomepage = true;
      } else {
        // Returning from another page - play return message
        greeting = this.greetings['/return'];
      }
    } else {
      greeting = this.greetings[pathname];
    }
    
    if (!greeting) {
      console.log(`No greeting configured for ${pathname}`);
      return;
    }

    // For homepage, always play on reload, otherwise check cooldown
    if (pathname !== '/' || !isPageReload) {
      const now = Date.now();
      const lastTime = this.lastGreetingTime[pathname] || 0;
      const timeSinceLastGreeting = now - lastTime;
      
      if (timeSinceLastGreeting < this.cooldownPeriod) {
        console.log(`⏳ Greeting for ${pathname} on cooldown (${Math.round((this.cooldownPeriod - timeSinceLastGreeting) / 1000)}s remaining)`);
        return;
      }
    }

    // Update last greeting time
    this.lastGreetingTime[pathname] = Date.now();

    // Wait a moment before greeting (let page load)
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Apply master volume to greeting settings
      const volumeSettings = {
        ...this.greetingVoiceSettings,
        volume: this.greetingVoiceSettings.volume * this.masterVolume
      };
      
      // Play the greeting with spooky voice
      console.log(`🎙️ Playing greeting: "${greeting}" at ${(volumeSettings.volume * 100).toFixed(0)}% volume`);
      await ghostVoice.speakWithSettings(greeting, volumeSettings);
    } catch (error) {
      console.error('Error playing greeting:', error);
    }
  }

  // Reset greetings (useful for testing or if user wants to hear them again)
  resetGreetings() {
    this.lastGreetingTime = {};
    console.log('🔄 Voice greetings reset');
  }

  // Check if a page greeting is on cooldown
  isOnCooldown(pathname) {
    const now = Date.now();
    const lastTime = this.lastGreetingTime[pathname] || 0;
    return (now - lastTime) < this.cooldownPeriod;
  }
}

// Create singleton instance
const voiceGreeting = new VoiceGreetingService();

export default voiceGreeting;
