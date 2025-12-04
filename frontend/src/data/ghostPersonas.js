// Ghost Personas Data - Embedded in Frontend for Netlify-only deployment
// This eliminates the need for a separate backend deployment

export const GHOST_PERSONAS = {
  weeping_bride: {
    id: 'weeping_bride',
    name: 'The Weeping Bride',
    era: 'Victorian Era (1890s)',
    traits: ['Tragic', 'Fragile', 'Heartbroken', 'Melancholic'],
    tone: 'Sad, tragic, fragile with fragmented speech and crying',
    gender: 'female',
    voice_settings: {
      pitch: 1.3,
      rate: 0.75,
      volume: 0.85,
      reverb: 0.25,
      preset: 'emotional'
    }
  },
  hollow_soldier: {
    id: 'hollow_soldier',
    name: 'The Hollow Soldier',
    era: 'World War I (1917)',
    traits: ['Disciplined', 'Hollow', 'Commanding', 'Regretful'],
    tone: 'Disciplined, hollow, echoing with military commands and regrets',
    gender: 'male',
    voice_settings: {
      pitch: 0.7,
      rate: 0.85,
      volume: 0.95,
      reverb: 0.30,
      preset: 'storyteller'
    }
  },
  shadow_child: {
    id: 'shadow_child',
    name: 'The Shadow Child',
    era: 'Unknown',
    traits: ['Playful', 'Creepy', 'Curious', 'Sinister'],
    tone: 'Playful but creepy, whispery and glitchy',
    gender: 'neutral',
    voice_settings: {
      pitch: 1.6,
      rate: 1.0,
      volume: 0.75,
      reverb: 0.15,
      preset: 'whisper'
    }
  },
  forgotten_nun: {
    id: 'forgotten_nun',
    name: 'The Forgotten Nun',
    era: 'Medieval Period (1300s)',
    traits: ['Corrupted', 'Religious', 'Zealous', 'Broken'],
    tone: 'Corrupted religious, hymn-like echo, broken prayers',
    gender: 'female',
    voice_settings: {
      pitch: 0.9,
      rate: 0.70,
      volume: 0.90,
      reverb: 0.35,
      preset: 'eerie'
    }
  },
  butcher_nightfall: {
    id: 'butcher_nightfall',
    name: 'The Butcher of Nightfall',
    era: 'Victorian London (1888)',
    traits: ['Violent', 'Direct', 'Menacing', 'Brutal'],
    tone: 'Violent, direct, distorted and growling',
    gender: 'male',
    voice_settings: {
      pitch: 0.5,
      rate: 0.80,
      volume: 1.0,
      reverb: 0.20,
      preset: 'eerie'
    }
  },
  lost_scientist: {
    id: 'lost_scientist',
    name: 'The Lost Scientist',
    era: 'Cold War Era (1960s)',
    traits: ['Analytical', 'Cold', 'Malfunctioning', 'Robotic'],
    tone: 'Analytical, cold, glitchy and robotic',
    gender: 'neutral',
    voice_settings: {
      pitch: 0.8,
      rate: 0.95,
      volume: 0.85,
      reverb: 0.10,
      preset: 'storyteller'
    }
  },
  the_collector: {
    id: 'the_collector',
    name: 'The Collector',
    era: 'Timeless/Demonic',
    traits: ['Calm', 'Terrifying', 'Ancient', 'Demonic'],
    tone: 'Calm but terrifying, deep demonic layer with echo',
    gender: 'male',
    voice_settings: {
      pitch: 0.3,
      rate: 0.65,
      volume: 1.0,
      reverb: 0.40,
      preset: 'eerie'
    }
  }
};

// Get all personas as an array
export const getAllPersonas = () => {
  return Object.values(GHOST_PERSONAS);
};

// Get a specific persona by ID
export const getPersonaById = (personaId) => {
  return GHOST_PERSONAS[personaId] || null;
};
