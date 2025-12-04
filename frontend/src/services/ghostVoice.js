// Ghost Voice Engine using Web Speech API
// Provides different voice presets for various features
import ambientAudio from './ambientAudio';
import audioPriority from './audioPriority';

class GhostVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.queue = [];
    this.audioContext = null;
    this.convolver = null;
    this.reverbGain = null;
    this.masterVolume = 1.0; // Master volume control
    
    // Emotional sound effects patterns
    this.emotionalPatterns = {
      crying: /\*cry(ing)?\*|\*sob(bing)?\*|\*weep(ing)?\*|\*tears?\*/i,
      laughing: /\*laugh(ing)?\*|\*giggl(e|ing)\*|\*chuckl(e|ing)\*|\*cackl(e|ing)\*/i,
      growling: /\*growl(ing)?\*|\*snarl(ing)?\*|\*hiss(ing)?\*/i,
      screaming: /\*scream(ing)?\*|\*shriek(ing)?\*|\*wail(ing)?\*/i,
      distorted: /\*distorted\s+\w+\*|\*corrupted\*|\*glitch(ed|ing)?\*/i,
      whisper: /\*whisper(ing|s)?\*|\*murmur(ing|s)?\*/i,
      singing: /\*sing(ing|s)?\*|\*hum(ming|s)?\*|\*chant(ing|s)?\*|\*hymn\*/i
    };
    
    // Voice preset configurations
    this.presets = {
      eerie: {
        pitch: 0.7,
        rate: 0.8,
        volume: 0.9,
        voicePattern: ['female', 'whisper', 'soft']
      },
      emotional: {
        pitch: 0.9,
        rate: 0.85,
        volume: 0.95,
        voicePattern: ['female', 'expressive']
      },
      storyteller: {
        pitch: 0.8,
        rate: 0.75,
        volume: 1.0,
        voicePattern: ['male', 'deep', 'narrator']
      },
      playful: {
        pitch: 1.2,
        rate: 1.0,
        volume: 0.9,
        voicePattern: ['female', 'cheerful']
      },
      whisper: {
        pitch: 1.6,
        rate: 0.7,
        volume: 0.4,
        voicePattern: ['female', 'whisper', 'soft', 'breathy']
      }
    };

    // Mood detection keywords with weights
    this.moodKeywords = {
      whisper: {
        keywords: ['behind you', 'watching', 'closer', 'silence', 'hush', 'shh', 'listen', 'hear that', 'footsteps', 'breathing', 'shadow', 'darkness falls', 'too late', 'forever', 'never leave'],
        weight: 3,
        shortTextBonus: true // Bonus for short texts (< 50 chars)
      },
      eerie: {
        keywords: ['scary', 'spooky', 'mysterious', 'haunting', 'suspenseful', 'ghost', 'spirit', 'phantom', 'supernatural', 'eerie', 'creepy', 'sinister', 'ominous', 'dread', 'terror', 'fear', 'nightmare', 'cursed', 'haunted', 'dark', 'shadows', 'whispers', 'chill', 'bone', 'grave', 'death', 'dead'],
        weight: 2
      },
      emotional: {
        keywords: ['sad', 'serious', 'comforting', 'empathetic', 'sorrow', 'grief', 'pain', 'hurt', 'lonely', 'alone', 'tears', 'cry', 'heart', 'loss', 'remember', 'forgotten', 'regret', 'sorry', 'forgive', 'understand', 'feel', 'emotion'],
        weight: 2
      },
      playful: {
        keywords: ['joke', 'funny', 'haha', 'lol', 'laugh', 'humorous', 'fun', 'silly', 'playful', 'trick', 'prank', 'boo!', 'surprise', 'gotcha', 'hehe', 'giggle', 'chuckle', 'amusing', 'jest', 'tease'],
        weight: 2
      },
      storyteller: {
        keywords: ['once upon', 'long ago', 'legend', 'tale', 'story', 'history', 'years ago', 'centuries', 'ancient', 'lore', 'chronicles', 'saga', 'narrative', 'journal', 'diary', 'account', 'remember when'],
        weight: 1,
        longTextBonus: true // Bonus for long texts (> 150 chars)
      }
    };
  }

  // Detect mood from text and return appropriate preset
  detectMood(text) {
    if (!text || text.trim() === '') {
      return 'storyteller';
    }

    const lowerText = text.toLowerCase();
    const textLength = text.length;
    const scores = {
      eerie: 0,
      emotional: 0,
      storyteller: 0,
      playful: 0,
      whisper: 0
    };

    // Calculate scores for each mood
    for (const [mood, config] of Object.entries(this.moodKeywords)) {
      let score = 0;
      
      // Count keyword matches
      for (const keyword of config.keywords) {
        if (lowerText.includes(keyword)) {
          score += config.weight;
        }
      }

      // Apply length bonuses
      if (config.shortTextBonus && textLength < 50) {
        score += 2;
      }
      if (config.longTextBonus && textLength > 150) {
        score += 2;
      }

      scores[mood] = score;
    }

    // Find the mood with highest score
    let maxScore = 0;
    let selectedMood = 'storyteller';

    for (const [mood, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        selectedMood = mood;
      }
    }

    // If no mood detected (all scores are 0), use storyteller as default
    if (maxScore === 0) {
      return 'storyteller';
    }

    return selectedMood;
  }

  // Set master volume (controlled by volume controller)
  setMasterVolume(volume) {
    this.masterVolume = volume;
    console.log(`🔊 Ghost voice master volume set to ${(volume * 100).toFixed(0)}%`);
  }

  // Check if speech synthesis is available
  isAvailable() {
    return 'speechSynthesis' in window;
  }

  // Get available voices
  getVoices() {
    return this.synth.getVoices();
  }

  // Select best voice based on preset pattern
  selectVoice(preset) {
    const voices = this.getVoices();
    const pattern = this.presets[preset]?.voicePattern || [];
    
    // Try to find a voice matching the pattern
    for (const keyword of pattern) {
      const match = voices.find(voice => 
        voice.name.toLowerCase().includes(keyword) ||
        voice.lang.includes('en')
      );
      if (match) return match;
    }
    
    // Fallback to first English voice or default
    return voices.find(voice => voice.lang.includes('en')) || voices[0];
  }

  // Enhancement D: Select voice based on gender
  selectVoiceByGender(gender) {
    const voices = this.getVoices();
    console.log(`🔍 Available voices (${voices.length}):`, voices.map(v => `${v.name} (${v.lang})`));
    
    if (!voices.length) {
      console.warn('⚠️ No voices available');
      return null;
    }
    
    // Filter for English voices first
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const voicesToSearch = englishVoices.length > 0 ? englishVoices : voices;
    
    console.log(`🔍 Searching ${voicesToSearch.length} English voices for gender: ${gender}`);
    
    if (gender === 'female') {
      // Look for female voice indicators
      const femaleVoice = voicesToSearch.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('susan')
      );
      if (femaleVoice) {
        console.log(`👩 Selected female voice: ${femaleVoice.name}`);
        return femaleVoice;
      }
    } else if (gender === 'male') {
      // Look for male voice indicators
      const maleVoice = voicesToSearch.find(v => 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('man') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('mark') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('james')
      );
      if (maleVoice) {
        console.log(`👨 Selected male voice: ${maleVoice.name}`);
        return maleVoice;
      }
    }
    
    // Fallback to first English voice
    const fallback = voicesToSearch[0];
    console.log(`🔄 Using fallback voice: ${fallback?.name || 'default'}`);
    return fallback;
  }

  // Initialize reverb (convolver-based with 1.8s decay)
  initReverb() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (!this.convolver) {
      this.convolver = this.audioContext.createConvolver();
      this.reverbGain = this.audioContext.createGain();
      this.reverbGain.gain.value = 0.18; // 18% mix
      
      // Create impulse response for reverb (1.8s decay)
      const sampleRate = this.audioContext.sampleRate;
      const length = sampleRate * 1.8; // 1.8 seconds
      const impulse = this.audioContext.createBuffer(2, length, sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          // Exponential decay with stereo widening
          const decay = Math.exp(-3 * i / length);
          const noise = (Math.random() * 2 - 1) * decay;
          channelData[i] = noise * (channel === 0 ? 0.9 : 1.1); // Slight stereo difference
        }
      }
      
      this.convolver.buffer = impulse;
    }
  }

  // Enhancement D: Apply persona-specific voice effects based on gender
  applyPersonaEffects(utterance, persona, isCursedMode = false) {
    if (!persona || !persona.voice_settings) return utterance;

    const gender = persona.gender;
    const settings = persona.voice_settings;
    
    // Base settings from persona
    utterance.pitch = settings.pitch || 1.0;
    utterance.rate = settings.rate || 1.0;
    utterance.volume = (settings.volume || 1.0) * this.masterVolume; // Apply master volume
    
    // Enhancement D: Gender-specific voice modifications
    if (gender === 'female') {
      // Higher pitch spooky voice, breathier tone
      utterance.pitch = Math.min(2.0, utterance.pitch * 1.15);
      utterance.rate = utterance.rate * 0.95; // Slightly slower
    } else if (gender === 'male') {
      // Deep, hollow ghost tone
      utterance.pitch = Math.max(0.1, utterance.pitch * 0.85);
      utterance.rate = utterance.rate * 0.92;
    } else {
      // Neutral: middle pitch, distorted
      utterance.pitch = utterance.pitch * 0.95;
      utterance.rate = utterance.rate * 0.90;
    }
    
    // Enhancement D: Cursed mode effects (+15% distortion)
    if (isCursedMode) {
      utterance.pitch = Math.max(0.1, utterance.pitch * 0.85);
      utterance.rate = utterance.rate * 0.88;
    }
    
    return utterance;
  }

  // Speak text with custom voice settings (for persona-specific voices)
  speakWithSettings(text, settings, useReverb = false) {
    if (!this.isAvailable()) {
      console.warn('Speech synthesis not available');
      return Promise.reject(new Error('Speech synthesis not available'));
    }

    if (!text || text.trim() === '') {
      return Promise.reject(new Error('No text provided'));
    }

    // Check audio priority before speaking
    const canPlay = audioPriority.requestPlay('tts', () => {
      // Pause ambient audio before speaking
      ambientAudio.pauseForSpeech();
    });

    if (!canPlay) {
      console.warn('TTS blocked by higher priority audio');
      return Promise.reject(new Error('Audio priority conflict'));
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Apply custom settings FIRST
      utterance.pitch = settings.pitch || 1.0;
      utterance.rate = settings.rate || 1.0;
      utterance.volume = (settings.volume || 1.0) * this.masterVolume; // Apply master volume
      
      console.log('🔍 Voice settings received:', settings);
      console.log('🔍 Initial pitch:', utterance.pitch, 'rate:', utterance.rate);
      
      // Enhancement D: Apply persona effects if gender is provided
      // Gender can be in settings directly OR in a nested persona object
      const isCursedMode = document.body.classList.contains('cursed-mode');
      const gender = settings.gender || (settings.persona && settings.persona.gender);
      
      console.log('🔍 Detected gender:', gender, 'cursed:', isCursedMode);
      
      if (gender) {
        console.log(`🎭 Applying ${gender} voice effects (cursed: ${isCursedMode})`);
        
        // Apply gender-specific modifications
        if (gender === 'female') {
          const oldPitch = utterance.pitch;
          const oldRate = utterance.rate;
          utterance.pitch = Math.min(2.0, utterance.pitch * 1.15);
          utterance.rate = utterance.rate * 0.95;
          console.log(`👩 Female voice: pitch ${oldPitch} → ${utterance.pitch}, rate ${oldRate} → ${utterance.rate}`);
        } else if (gender === 'male') {
          const oldPitch = utterance.pitch;
          const oldRate = utterance.rate;
          utterance.pitch = Math.max(0.1, utterance.pitch * 0.85);
          utterance.rate = utterance.rate * 0.92;
          console.log(`👨 Male voice: pitch ${oldPitch} → ${utterance.pitch}, rate ${oldRate} → ${utterance.rate}`);
        } else {
          const oldPitch = utterance.pitch;
          const oldRate = utterance.rate;
          utterance.pitch = utterance.pitch * 0.95;
          utterance.rate = utterance.rate * 0.90;
          console.log(`🧑 Neutral voice: pitch ${oldPitch} → ${utterance.pitch}, rate ${oldRate} → ${utterance.rate}`);
        }
        
        // Cursed mode effects
        if (isCursedMode) {
          const oldPitch = utterance.pitch;
          const oldRate = utterance.rate;
          utterance.pitch = Math.max(0.1, utterance.pitch * 0.85);
          utterance.rate = utterance.rate * 0.88;
          console.log(`😈 Cursed mode: pitch ${oldPitch} → ${utterance.pitch}, rate ${oldRate} → ${utterance.rate}`);
        }
      } else {
        console.warn('⚠️ No gender detected in settings!');
      }
      
      // Enhancement D: Select voice based on gender (PRIORITY)
      if (gender) {
        const genderVoice = this.selectVoiceByGender(gender);
        if (genderVoice) {
          utterance.voice = genderVoice;
          console.log(`✅ Using gender-specific voice: ${genderVoice.name}`);
        }
      }
      // Fallback: Select voice based on preset if provided
      else if (settings.preset) {
        const voice = this.selectVoice(settings.preset);
        if (voice) {
          utterance.voice = voice;
          console.log(`✅ Using preset voice: ${voice.name}`);
        }
      }

      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        
        // Initialize reverb if requested
        if (useReverb) {
          this.initReverb();
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        
        // Notify priority manager that TTS finished
        audioPriority.notifyFinished('tts');
        
        // Resume ambient audio after speaking
        ambientAudio.resumeAfterSpeech();
        
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        
        // Notify priority manager that TTS finished (even on error)
        audioPriority.notifyFinished('tts');
        
        // Resume ambient audio even on error
        ambientAudio.resumeAfterSpeech();
        
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      // Speak the utterance
      this.synth.speak(utterance);
    });
  }

  // Speak text with specified preset (or auto-detect if preset is 'auto' or null)
  speak(text, preset = 'auto', useReverb = false) {
    if (!this.isAvailable()) {
      console.warn('Speech synthesis not available');
      return Promise.reject(new Error('Speech synthesis not available'));
    }

    if (!text || text.trim() === '') {
      return Promise.reject(new Error('No text provided'));
    }

    // Auto-detect mood if preset is 'auto' or not provided
    const selectedPreset = (preset === 'auto' || !preset) ? this.detectMood(text) : preset;

    // Check audio priority before speaking
    const canPlay = audioPriority.requestPlay('tts', () => {
      // Pause ambient audio before speaking
      ambientAudio.pauseForSpeech();
    });

    if (!canPlay) {
      console.warn('TTS blocked by higher priority audio');
      return Promise.reject(new Error('Audio priority conflict'));
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const config = this.presets[selectedPreset] || this.presets.storyteller;

      // Apply preset configuration
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
      utterance.volume = config.volume * this.masterVolume; // Apply master volume
      
      // Select appropriate voice
      const voice = this.selectVoice(selectedPreset);
      if (voice) {
        utterance.voice = voice;
      }

      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        
        // Initialize reverb if requested (for Ghost Chat & Haunted Journal)
        if (useReverb) {
          this.initReverb();
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        
        // Notify priority manager that TTS finished
        audioPriority.notifyFinished('tts');
        
        // Resume ambient audio after speaking
        ambientAudio.resumeAfterSpeech();
        
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        
        // Notify priority manager that TTS finished (even on error)
        audioPriority.notifyFinished('tts');
        
        // Resume ambient audio even on error
        ambientAudio.resumeAfterSpeech();
        
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      // Speak the utterance
      this.synth.speak(utterance);
    });
  }

  // Stop current speech
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  // Pause current speech
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  // Resume paused speech
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  // Check if currently speaking
  getSpeakingStatus() {
    return this.isSpeaking;
  }

  // Queue multiple texts to speak sequentially
  async speakQueue(texts, preset = 'auto') {
    for (const text of texts) {
      try {
        await this.speak(text, preset);
      } catch (error) {
        console.error('Error in speech queue:', error);
      }
    }
  }

  // Detect emotional patterns in text
  detectEmotion(text) {
    const emotions = [];
    for (const [emotion, pattern] of Object.entries(this.emotionalPatterns)) {
      if (pattern.test(text)) {
        emotions.push(emotion);
      }
    }
    return emotions;
  }

  // Generate emotional sound effect using Web Audio API
  playEmotionalSound(emotion, duration = 2000) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const now = this.audioContext.currentTime;
    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.audioContext.destination);

    switch (emotion) {
      case 'crying':
        // Sobbing sound - oscillating low frequency
        this.createSobbingSound(gainNode, now, duration);
        break;
      
      case 'laughing':
        // Maniacal laughter - rapid pitch changes
        this.createLaughingSound(gainNode, now, duration);
        break;
      
      case 'growling':
        // Deep growl - low frequency rumble
        this.createGrowlingSound(gainNode, now, duration);
        break;
      
      case 'screaming':
        // High-pitched scream
        this.createScreamingSound(gainNode, now, duration);
        break;
      
      case 'distorted':
        // Glitchy distorted sound
        this.createDistortedSound(gainNode, now, duration);
        break;
      
      case 'singing':
      case 'whisper':
        // Ethereal singing/humming
        this.createSingingSound(gainNode, now, duration);
        break;
    }
  }

  // Sobbing sound effect
  createSobbingSound(gainNode, startTime, duration) {
    const osc = this.audioContext.createOscillator();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 200;
    lfo.type = 'sine';
    lfo.frequency.value = 3; // 3Hz sobbing rhythm
    lfoGain.gain.value = 50;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
    
    osc.start(startTime);
    lfo.start(startTime);
    osc.stop(startTime + duration / 1000);
    lfo.stop(startTime + duration / 1000);
  }

  // Laughing sound effect
  createLaughingSound(gainNode, startTime, duration) {
    const durationSec = duration / 1000;
    for (let i = 0; i < 5; i++) {
      const osc = this.audioContext.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 400 + Math.random() * 400;
      osc.connect(gainNode);
      
      const offset = (i / 5) * durationSec;
      gainNode.gain.setValueAtTime(0.2, startTime + offset);
      gainNode.gain.linearRampToValueAtTime(0, startTime + offset + 0.15);
      
      osc.start(startTime + offset);
      osc.stop(startTime + offset + 0.15);
    }
  }

  // Growling sound effect
  createGrowlingSound(gainNode, startTime, duration) {
    const osc = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 10;
    
    osc.connect(filter);
    filter.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
    
    osc.start(startTime);
    osc.stop(startTime + duration / 1000);
  }

  // Screaming sound effect
  createScreamingSound(gainNode, startTime, duration) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, startTime);
    osc.frequency.linearRampToValueAtTime(1200, startTime + duration / 2000);
    osc.frequency.linearRampToValueAtTime(600, startTime + duration / 1000);
    
    osc.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
    
    osc.start(startTime);
    osc.stop(startTime + duration / 1000);
  }

  // Distorted/glitchy sound effect
  createDistortedSound(gainNode, startTime, duration) {
    const bufferSize = this.audioContext.sampleRate * (duration / 1000);
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const noise = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1000 + Math.random() * 2000;
    filter.Q.value = 5;
    
    noise.connect(filter);
    filter.connect(gainNode);
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
    
    noise.start(startTime);
  }

  // Singing/humming sound effect
  createSingingSound(gainNode, startTime, duration) {
    const frequencies = [523, 587, 659, 698]; // C, D, E, F notes
    const durationSec = duration / 1000;
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gainNode);
      
      const offset = (i / frequencies.length) * durationSec;
      const noteDuration = durationSec / frequencies.length;
      
      gainNode.gain.setValueAtTime(0.15, startTime + offset);
      gainNode.gain.linearRampToValueAtTime(0, startTime + offset + noteDuration);
      
      osc.start(startTime + offset);
      osc.stop(startTime + offset + noteDuration);
    });
  }

  // Speak with emotional sound effects
  async speakWithEmotion(text, settings = {}, useReverb = false) {
    // Detect emotions in the text
    const emotions = this.detectEmotion(text);
    
    // Play emotional sound effects before speaking
    if (emotions.length > 0) {
      console.log('🎭 Detected emotions:', emotions);
      emotions.forEach(emotion => {
        this.playEmotionalSound(emotion, 1500);
      });
      
      // Wait a bit for sound effect to start
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Then speak the text (with emotion markers removed for cleaner speech)
    const cleanText = text.replace(/\*[^*]+\*/g, '').trim();
    if (cleanText) {
      return this.speakWithSettings(cleanText, settings, useReverb);
    }
  }
}

// Create singleton instance
const ghostVoice = new GhostVoiceEngine();

// Ensure voices are loaded (some browsers load them asynchronously)
if (ghostVoice.isAvailable()) {
  window.speechSynthesis.onvoiceschanged = () => {
    ghostVoice.getVoices();
  };
}

export default ghostVoice;
