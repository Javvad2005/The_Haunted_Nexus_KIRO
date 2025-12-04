// Background music service - plays looping music throughout the website
class IntroAudioService {
  constructor() {
    this.audio = null;
    this.volume = 0.4; // 40% volume
    this.isPlaying = false;
  }

  // Initialize audio element
  init() {
    if (!this.audio) {
      console.log('🎵 Initializing background music...');
      this.audio = new Audio('/audio/intro.mp3');
      this.audio.volume = this.volume;
      this.audio.loop = true; // Enable looping
      this.audio.preload = 'auto';
      
      // Error handling
      this.audio.onerror = (e) => {
        console.error('❌ Error loading background music:', e);
        console.error('📁 Expected file: frontend/public/audio/intro.mp3');
      };
      
      // Success logging
      this.audio.oncanplaythrough = () => {
        console.log('✅ Background music loaded successfully');
      };
    }
  }

  // Play background music
  async play() {
    // Don't restart if already playing
    if (this.isPlaying) {
      console.log('🎵 Background music already playing');
      return true;
    }

    this.init();
    
    if (!this.audio) {
      console.error('❌ Audio not initialized');
      return false;
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
      console.log('🎵 Background music started playing (looping)');
      return true;
    } catch (error) {
      console.error('❌ Error playing background music:', error);
      console.log('💡 User interaction may be required for autoplay');
      return false;
    }
  }

  // Stop audio
  stop() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      console.log('⏹️ Background music stopped');
    }
  }

  // Pause audio (without resetting position)
  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      console.log('⏸️ Background music paused');
    }
  }

  // Resume audio
  resume() {
    if (this.audio && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        console.log('▶️ Background music resumed');
      }).catch(error => {
        console.error('❌ Error resuming background music:', error);
      });
    }
  }

  // Set volume
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
      console.log(`🔊 Background music volume: ${(this.volume * 100).toFixed(0)}%`);
    }
  }
}

// Export singleton instance
const introAudio = new IntroAudioService();
export default introAudio;
