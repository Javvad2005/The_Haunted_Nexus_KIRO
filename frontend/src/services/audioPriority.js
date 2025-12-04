/**
 * Audio Priority Manager
 * Ensures only ONE major sound plays at a time
 * 
 * Priority Levels:
 * 1. AI Voice / TTS (highest)
 * 2. Footsteps
 * 3. Scare Cue
 * 4. Ambient (lowest)
 * 
 * Rules:
 * - Only one major sound can play at a time
 * - Ambient fades out cleanly when higher-priority audio starts
 * - All volume changes use gainNode ramps (no pops)
 */

class AudioPriorityManager {
  constructor() {
    // Priority levels (lower number = higher priority)
    this.PRIORITY = {
      AI_VOICE: 1,    // Highest priority - AI voice/TTS
      FOOTSTEPS: 2,   // Second highest
      SCARE_CUE: 3,   // Third
      AMBIENT: 4      // Lowest priority
    };

    // Current playing audio state
    this.currentPriority = this.PRIORITY.AMBIENT; // Default to ambient (lowest)
    this.currentAudioType = 'ambient';
    this.isPlaying = false;

    // Callbacks for audio control
    this.ambientController = null;
    
    // Queue for pending audio requests
    this.pendingQueue = [];
  }

  /**
   * Register the ambient audio controller
   */
  registerAmbientController(controller) {
    this.ambientController = controller;
  }

  /**
   * Check if requested audio can play based on priority
   * @param {number} requestedPriority - Priority level of requested audio
   * @returns {boolean} - True if audio can play
   */
  canPlay(requestedPriority) {
    // If nothing is playing, allow
    if (!this.isPlaying) {
      return true;
    }

    // If requested priority is higher (lower number), allow
    if (requestedPriority < this.currentPriority) {
      return true;
    }

    // If same priority, allow (will replace current)
    if (requestedPriority === this.currentPriority) {
      return true;
    }

    // Lower priority cannot interrupt higher priority
    return false;
  }

  /**
   * Request to play audio with given priority
   * @param {string} audioType - Type of audio ('footsteps', 'tts', 'scare_cue', 'ambient')
   * @param {Function} onAllowed - Callback when audio is allowed to play
   * @returns {boolean} - True if allowed to play immediately
   */
  requestPlay(audioType, onAllowed = null) {
    const priority = this.getPriorityForType(audioType);

    if (this.canPlay(priority)) {
      // Stop current audio if different type
      if (this.isPlaying && this.currentAudioType !== audioType) {
        this.stopCurrent();
      }

      // Update state
      this.currentPriority = priority;
      this.currentAudioType = audioType;
      this.isPlaying = true;

      // Handle ambient audio based on priority
      this.handleAmbientForPriority(priority);

      // Execute callback
      if (onAllowed) {
        onAllowed();
      }

      return true;
    }

    return false;
  }

  /**
   * Notify that audio has finished playing
   * @param {string} audioType - Type of audio that finished
   */
  notifyFinished(audioType) {
    // Only update if this is the current audio
    if (this.currentAudioType === audioType) {
      this.isPlaying = false;
      this.currentPriority = this.PRIORITY.AMBIENT;
      this.currentAudioType = 'ambient';

      // Check if there are pending requests
      if (this.pendingQueue.length > 0) {
        const next = this.pendingQueue.shift();
        this.requestPlay(next.type, next.callback);
      }
    }
  }

  /**
   * Get priority level for audio type
   * @param {string} audioType - Type of audio
   * @returns {number} - Priority level
   */
  getPriorityForType(audioType) {
    switch (audioType.toLowerCase()) {
      case 'ai_voice':
      case 'tts':
      case 'speech':
      case 'voice':
        return this.PRIORITY.AI_VOICE;
      case 'footsteps':
        return this.PRIORITY.FOOTSTEPS;
      case 'scare_cue':
      case 'scare':
        return this.PRIORITY.SCARE_CUE;
      case 'ambient':
        return this.PRIORITY.AMBIENT;
      default:
        return this.PRIORITY.AMBIENT;
    }
  }

  /**
   * Handle ambient audio based on priority
   * @param {number} priority - Priority level of playing audio
   */
  handleAmbientForPriority(priority) {
    if (!this.ambientController) return;

    switch (priority) {
      case this.PRIORITY.AI_VOICE:
        // Full mute for AI voice/TTS (highest priority)
        this.ambientController.pauseForSpeech();
        break;
      
      case this.PRIORITY.FOOTSTEPS:
        // Full mute for footsteps
        this.ambientController.pauseForFootsteps();
        break;
      
      case this.PRIORITY.SCARE_CUE:
        // Duck by 50% for scare cues
        this.ambientController.duckForWhisper();
        break;
      
      case this.PRIORITY.AMBIENT:
        // Ambient is playing, no action needed
        break;
    }
  }

  /**
   * Stop current playing audio
   */
  stopCurrent() {
    // This is a notification method - actual stopping is handled by the audio source
    // Just update state
    this.isPlaying = false;
  }

  /**
   * Force stop all audio and reset
   */
  reset() {
    this.isPlaying = false;
    this.currentPriority = this.PRIORITY.AMBIENT;
    this.currentAudioType = 'ambient';
    this.pendingQueue = [];
  }

  /**
   * Get current audio state
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentPriority: this.currentPriority,
      currentAudioType: this.currentAudioType,
      pendingCount: this.pendingQueue.length
    };
  }

  /**
   * Check if specific audio type is currently playing
   * @param {string} audioType - Type to check
   * @returns {boolean}
   */
  isPlayingType(audioType) {
    return this.isPlaying && this.currentAudioType === audioType;
  }
}

// Singleton instance
export const audioPriority = new AudioPriorityManager();
export default audioPriority;
