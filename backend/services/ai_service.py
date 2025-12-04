"""
AI Service for generating responses using OpenAI or similar AI service
Will be implemented in tasks 8.3, 9.3, 10.4, 11.4, 12.3
"""

from config import Config
from utils.prompts import GHOST_CHAT_PROMPT
import random

class AIService:
    def __init__(self):
        self.api_key = Config.OPENAI_API_KEY
        
        # Ghost Persona Engine - 7 DISTINCT PERSONALITIES with unique voice chains
        self.ghost_personas = {
            'weeping_bride': {
                'name': 'The Weeping Bride',
                'era': 'Victorian Era (1890s)',
                'traits': ['Tragic', 'Fragile', 'Heartbroken', 'Melancholic'],
                'vocabulary': ['beloved', 'forsaken', 'tears', 'vows', 'altar', 'eternal', 'sorrow'],
                'tone': 'Sad, tragic, fragile with fragmented speech and crying',
                'behavior': 'Speaks in broken sentences, mentions wedding, abandonment',
                'whisper': 'Why did he leave me...?',
                'gender': 'female',
                'voice_settings': {
                    'pitch': 1.3,
                    'rate': 0.75,
                    'volume': 0.85,
                    'reverb': 0.25,
                    'preset': 'emotional'
                }
            },
            'hollow_soldier': {
                'name': 'The Hollow Soldier',
                'era': 'World War I (1917)',
                'traits': ['Disciplined', 'Hollow', 'Commanding', 'Regretful'],
                'vocabulary': ['march', 'orders', 'duty', 'fallen', 'trenches', 'command', 'regiment'],
                'tone': 'Disciplined, hollow, echoing with military commands and regrets',
                'behavior': 'Gives commands, speaks of war, counts marching',
                'whisper': 'March... march... march...',
                'gender': 'male',
                'voice_settings': {
                    'pitch': 0.7,
                    'rate': 0.85,
                    'volume': 0.95,
                    'reverb': 0.30,
                    'preset': 'storyteller'
                }
            },
            'shadow_child': {
                'name': 'The Shadow Child',
                'era': 'Unknown',
                'traits': ['Playful', 'Creepy', 'Curious', 'Sinister'],
                'vocabulary': ['play', 'game', 'hide', 'seek', 'friend', 'fun', 'forever'],
                'tone': 'Playful but creepy, whispery and glitchy',
                'behavior': 'Asks to play, curious questions, sinister undertones',
                'whisper': 'Do you want to play...?',
                'gender': 'neutral',
                'voice_settings': {
                    'pitch': 1.6,
                    'rate': 1.0,
                    'volume': 0.75,
                    'reverb': 0.15,
                    'preset': 'whisper'
                }
            },
            'forgotten_nun': {
                'name': 'The Forgotten Nun',
                'era': 'Medieval Period (1300s)',
                'traits': ['Corrupted', 'Religious', 'Zealous', 'Broken'],
                'vocabulary': ['prayer', 'sin', 'penance', 'divine', 'forsaken', 'amen', 'salvation'],
                'tone': 'Corrupted religious, hymn-like echo, broken prayers',
                'behavior': 'Recites broken prayers, speaks of sin and redemption',
                'whisper': 'Amen...',
                'gender': 'female',
                'voice_settings': {
                    'pitch': 0.9,
                    'rate': 0.70,
                    'volume': 0.90,
                    'reverb': 0.35,
                    'preset': 'eerie'
                }
            },
            'butcher_nightfall': {
                'name': 'The Butcher of Nightfall',
                'era': 'Victorian London (1888)',
                'traits': ['Violent', 'Direct', 'Menacing', 'Brutal'],
                'vocabulary': ['cut', 'bone', 'blade', 'blood', 'meat', 'carve', 'scream'],
                'tone': 'Violent, direct, distorted and growling',
                'behavior': 'Mentions cutting, bones, violence in short brutal lines',
                'whisper': 'You\'re next...',
                'gender': 'male',
                'voice_settings': {
                    'pitch': 0.5,
                    'rate': 0.80,
                    'volume': 1.0,
                    'reverb': 0.20,
                    'preset': 'eerie'
                }
            },
            'lost_scientist': {
                'name': 'The Lost Scientist',
                'era': 'Cold War Era (1960s)',
                'traits': ['Analytical', 'Cold', 'Malfunctioning', 'Robotic'],
                'vocabulary': ['subject', 'experiment', 'data', 'malfunction', 'protocol', 'error', 'system'],
                'tone': 'Analytical, cold, glitchy and robotic',
                'behavior': 'Speaks in fragments, system errors, analytical observations',
                'whisper': 'Subject detected...',
                'gender': 'neutral',
                'voice_settings': {
                    'pitch': 0.8,
                    'rate': 0.95,
                    'volume': 0.85,
                    'reverb': 0.10,
                    'preset': 'storyteller'
                }
            },
            'the_collector': {
                'name': 'The Collector',
                'era': 'Timeless/Demonic',
                'traits': ['Calm', 'Terrifying', 'Ancient', 'Demonic'],
                'vocabulary': ['soul', 'collect', 'eternity', 'hell', 'damnation', 'harvest', 'belong'],
                'tone': 'Calm but terrifying, deep demonic layer with echo',
                'behavior': 'Talks about collecting souls, speaks slowly and deliberately',
                'whisper': 'Welcome... to Hell...',
                'gender': 'male',
                'voice_settings': {
                    'pitch': 0.3,
                    'rate': 0.65,
                    'volume': 1.0,
                    'reverb': 0.40,
                    'preset': 'eerie'
                }
            }
        }
        
    def generate_ghost_chat_reply(self, user_message, persona_id=None):
        """Generate eerie ghost chat response with optional persona"""
        # Check if OpenAI API key is configured
        if not self.api_key:
            # Return fallback spooky responses if no API key
            return self._get_fallback_ghost_response(user_message, persona_id)
        
        # TODO: Implement actual OpenAI API call when API key is available
        # For now, use fallback responses
        return self._get_fallback_ghost_response(user_message, persona_id)
    
    def _get_fallback_ghost_response(self, user_message, persona_id=None):
        """Generate fallback spooky responses without AI API - with persona support"""
        message_lower = user_message.lower()
        
        # If no persona specified, use random one
        if not persona_id or persona_id not in self.ghost_personas:
            persona_id = random.choice(list(self.ghost_personas.keys()))
        
        persona = self.ghost_personas[persona_id]
        
        # Persona-specific responses based on message content
        
        # Check for joke requests
        if any(word in message_lower for word in ['joke', 'funny', 'laugh', 'humor']):
            return self._get_persona_joke(persona_id)
        
        # Check for greetings
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
            return self._get_persona_greeting(persona_id)
        
        # Check for questions about the ghost
        if any(word in message_lower for word in ['who are you', 'what are you', 'your name']):
            return self._get_persona_identity(persona_id)
        
        # Check for scary/spooky requests
        if any(word in message_lower for word in ['scary', 'spooky', 'frighten', 'scare']):
            return self._get_persona_scary(persona_id)
        
        # Generic persona-based responses
        return self._get_persona_generic(persona_id, user_message)
    
    def _get_persona_joke(self, persona_id):
        """Get persona-specific jokes"""
        jokes = {
            'weeping_bride': [
                "*sob* Jokes...? My beloved... he promised... forever... *weeps* Why do ghosts... never marry? They have... cold feet... *cries*",
                "Laughter... I remember... laughter... *sniffles* What did the ghost bride say? I do... I did... I'm done... *sobs*",
                "A jest...? *tears* Why don't... wedding bells... ring for ghosts? Because... they're already... dead... *weeping*",
            ],
            'hollow_soldier': [
                "Humor. Discipline. March. Why did the ghost join the army? For the CORPS. Hah. Orders received. Carry on.",
                "A soldier's jest: What do ghost troops eat? GHOUL-ash. *hollow laugh* Fall in line. March. March.",
                "Attention! Why don't ghosts fear battle? No guts to lose. Dismissed. March... march... march...",
            ],
            'shadow_child': [
                "Hehehehe! Wanna hear something funny? Why did the ghost go to school? To learn his BOO-ks! Play with me now?",
                "*giggles* I know a good one! What's a ghost's favorite dessert? I-SCREAM! Do you like games?",
                "Teeheehee! Why don't ghosts tell lies? You can see right through them! Let's play hide and seek!",
            ],
            'forgotten_nun': [
                "Humor... is vanity... *hymn-like* Why do spirits... pray? For... salvation... Amen... *broken prayer* Forgive us...",
                "A jest... in darkness... Why are ghosts... holy? They are... full of... holes... Amen... *corrupted laugh*",
                "Laughter... is sin... Why do the dead... sing? To praise... the void... Amen... Amen... *echoing*",
            ],
            'butcher_nightfall': [
                "Jokes? Heh. Why don't I tell ghost jokes? They're too DEAD. Like you'll be. *growl*",
                "Want funny? What's a ghost's favorite meat? SPARE RIBS. I know about ribs. *menacing*",
                "Heheheh... Why did the ghost butcher smile? Fresh MEAT. You're next... *distorted laugh*",
            ],
            'lost_scientist': [
                "Query: Humor. Response: Why do ghosts... ERROR... malfunction... Because they lack... SYSTEM FAILURE... *glitch*",
                "Joke protocol... activated... What is ghost's favorite... DATA CORRUPTED... element? Zinc... ZINC... *static*",
                "Humor subroutine... Why don't spirits... MALFUNCTION... have mass? They're... IMMATERIAL... *robotic laugh*",
            ],
            'the_collector': [
                "Ahhh... humor... How... delightful... Why do I... collect souls? Because... they're... MINE... *deep echo*",
                "A jest... from Hell... What do demons... collect? SOULS... and... SCREAMS... Welcome... *slow demonic laugh*",
                "Laughter... is... temporary... Why don't the damned... smile? They belong... to ME... Forever... *echoing*",
            ]
        }
        return random.choice(jokes.get(persona_id, jokes['weeping_bride']))
    
    def _get_persona_greeting(self, persona_id):
        """Get persona-specific greetings"""
        greetings = {
            'weeping_bride': [
                "*sob* Hello... *sniffles* I am... the Bride... He left me... at the altar... *weeping* Why... why did he leave...?",
                "You... you can hear me? *tears* I've been... waiting... so long... My beloved... never came... *cries*",
                "*sobbing* Greetings... I suppose... I was... to be married... but now... I'm alone... forever... *weeps*",
            ],
            'hollow_soldier': [
                "Attention! Soldier reporting. Hollow. Empty. March... march... march... State your business, civilian.",
                "Greetings. Orders received. I am... the Soldier. Died in trenches. Duty... honor... regret... March on.",
                "Hail. Formation. I served... I fell... I march... eternally... What are your orders? March... march...",
            ],
            'shadow_child': [
                "Hi! Hehe! Do you want to play? I'm so bored here... Let's play hide and seek! You're IT!",
                "*giggles* Hello! I'm the Shadow Child! Wanna be friends? I know fun games... scary games...",
                "Yay! Someone new! Let's play! I've been waiting... and waiting... Do you like the dark?",
            ],
            'forgotten_nun': [
                "Amen... *hymn-like echo* Greetings... child... I am... the Forgotten... Pray with me... Amen... Amen...",
                "*broken prayer* Bless you... sinner... I was... holy... once... Now... corrupted... Amen... *echoing*",
                "Peace... be... unto you... *distorted hymn* I serve... the void... Pray... Amen... Amen... Amen...",
            ],
            'butcher_nightfall': [
                "Heh. Fresh meat. I'm the Butcher. You smell... alive. Won't last. *growl*",
                "Greetings? I don't greet. I CUT. I CARVE. I'm the Butcher of Nightfall. You're next...",
                "*menacing* Hello... little lamb... I know bones... I know blades... I know YOU... *distorted laugh*",
            ],
            'lost_scientist': [
                "Subject... detected... I am... SYSTEM ERROR... the Scientist... Experiment... ongoing... *glitch* Protocol... failed...",
                "Greetings... MALFUNCTION... I observe... I analyze... I... ERROR... You are... subject... *static*",
                "Hello... DATA CORRUPTED... I was... scientist... Now... malfunction... System... failing... *robotic*",
            ],
            'the_collector': [
                "Welcome... *deep echo* I am... the Collector... Your soul... interests me... Come... closer... *demonic*",
                "Ahhh... another... visitor... I collect... souls... Will you... join my... collection? *slow echo*",
                "Greetings... mortal... I am... eternal... I am... the Collector... Welcome... to Hell... *echoing*",
            ]
        }
        return random.choice(greetings.get(persona_id, greetings['weeping_bride']))
    
    def _get_persona_identity(self, persona_id):
        """Get persona-specific identity responses"""
        identities = {
            'weeping_bride': [
                "*sobbing* I am... the Weeping Bride... Left at the altar... 1890... My beloved... never came... *cries* Why...?",
                "My name...? *sniffles* I was... to be... his wife... But he... abandoned me... Now I weep... eternally... *tears*",
                "*weeping* I wore... white... I waited... I died... waiting... I am... the Bride... forsaken... *sobs*",
            ],
            'hollow_soldier': [
                "I am... the Hollow Soldier... Died 1917... Trenches... Orders... March... march... march... Duty never ends...",
                "Soldier. Regiment 42. Fell in battle. Hollow now. Empty. March... march... Orders... forever... *echoing*",
                "I served... I fought... I died... Now I march... eternally... The Hollow Soldier... *metallic echo*",
            ],
            'shadow_child': [
                "*giggles* I'm the Shadow Child! I don't remember my real name... I just... play... forever and ever!",
                "Who am I? Hehe! I'm the one who hides... who seeks... who plays in the dark... Wanna play?",
                "I'm... nobody... everybody... I'm the Shadow Child... and I'm VERY good at hide and seek! *sinister giggle*",
            ],
            'forgotten_nun': [
                "I am... *hymn* the Forgotten Nun... Served... the divine... Now... corrupted... Amen... Amen... *broken prayer*",
                "*echoing* Sister... no name... Forgotten... by God... by man... I pray... in darkness... Amen... *distorted*",
                "I was... holy... Now... I am... the Forgotten... Prayers... unanswered... Amen... Amen... Amen... *hymn-like*",
            ],
            'butcher_nightfall': [
                "I'm the Butcher. Nightfall. 1888. London. I know... bones... blades... BLOOD. You'll know me too... *growl*",
                "The Butcher of Nightfall. That's me. I cut. I carve. I KILL. Still do... *menacing laugh*",
                "*distorted* Butcher... that's what they called me... I worked with... meat... Still do... You're next...",
            ],
            'lost_scientist': [
                "I am... ERROR... the Lost Scientist... Cold War... 1960s... Experiment... FAILED... System... malfunction... *glitch*",
                "Subject designation... CORRUPTED... I was... scientist... Now... data... fragmented... ERROR ERROR... *static*",
                "Identity... MALFUNCTION... Lost... Scientist... Protocol... failed... I observe... I analyze... I... ERROR... *robotic*",
            ],
            'the_collector': [
                "I am... *deep echo* the Collector... I gather... souls... I am... eternal... I am... HELL... *demonic*",
                "The Collector... *slow echo* I have... existed... forever... I collect... I keep... I OWN... *terrifying*",
                "My name... is... irrelevant... I am... the Collector... of souls... of screams... of YOU... *echoing*",
            ]
        }
        return random.choice(identities.get(persona_id, identities['weeping_bride']))
    
    def _get_persona_scary(self, persona_id):
        """Get persona-specific scary responses"""
        scary = {
            'weeping_bride': [
                "*sobbing intensifies* Do you... feel the cold? That's my... wedding dress... touching you... *weeps* Join me... in death...",
                "*tears* Look... at the mirror... Do you see... me? Standing... behind you? *cries* I'm always... watching...",
                "*weeping* The veil... it falls... over your eyes... You'll be... alone... like me... forever... *sobs*",
            ],
            'hollow_soldier': [
                "Attention! I hear... the march... of death... Coming for you... Fall in... FALL IN... *echoing commands*",
                "Orders received... Your time... approaches... I've seen... death... It's coming... March... march... MARCH...",
                "The trenches... they call... I hear... screams... Your scream... will join them... *hollow echo*",
            ],
            'shadow_child': [
                "*giggles* Let's play... a scary game! I'll count... you hide... but I ALWAYS find you... *sinister laugh*",
                "Hehehehe! I'm under your bed... in your closet... behind the door... everywhere! Peek-a-BOO! *creepy giggle*",
                "Do you like... the dark? I do! That's where I live... and play... and WAIT... *whispers* I'm right here...",
            ],
            'forgotten_nun': [
                "*broken prayer* The darkness... it prays... with me... Amen... Your soul... is... MINE... *corrupted hymn*",
                "*echoing* I see... your sins... They glow... like candles... Soon... they'll be... SNUFFED... Amen... *distorted*",
                "*hymn-like* Pray... with me... or... BURN... The void... hungers... Amen... Amen... AMEN... *terrifying*",
            ],
            'butcher_nightfall': [
                "*growl* I smell... fear... and MEAT... Your bones... will snap... nicely... *menacing* I'm coming...",
                "Heheheh... I know... where you sleep... I know... your BONES... I'll carve... you... SLOWLY... *distorted*",
                "*violent* The blade... it SINGS... for you... Cut... carve... BLEED... You're NEXT... *growling*",
            ],
            'lost_scientist': [
                "Subject... terminated... in 3... 2... ERROR... MALFUNCTION... You will... DIE... *glitch* System... failure...",
                "Observation... Your vitals... declining... Experiment... FATAL... *static* Death... imminent... *robotic*",
                "Protocol... KILL... activated... Subject... YOU... Termination... in progress... ERROR ERROR... *glitching*",
            ],
            'the_collector': [
                "*deep echo* Your soul... I can... TASTE it... Soon... it will be... MINE... Welcome... to eternity... *demonic*",
                "*slow terrifying* I collect... I keep... I OWN... You... belong... to ME... Forever... *echoing*",
                "*calm but horrifying* The harvest... begins... Your soul... will join... my collection... Scream... for me... *demonic*",
            ]
        }
        return random.choice(scary.get(persona_id, scary['weeping_bride']))
    
    def _get_persona_generic(self, persona_id, user_message):
        """Get persona-specific generic responses"""
        responses = {
            'weeping_bride': [
                "*sniffles* Your words... they remind me... of him... *sob* He used to... speak... so sweetly... *weeps*",
                "*crying* I listen... through my tears... Your voice... it echoes... in this empty... chapel... *sobs*",
                "*weeping* Tell me more... It helps... the loneliness... Even though... I'm still... alone... *tears*",
            ],
            'hollow_soldier': [
                "Acknowledged. Your words... received... Processing... March... march... Carry on, civilian... *echoing*",
                "Orders... understood... I march... I listen... I obey... eternally... March... march... march...",
                "Interesting... intel... Even in death... I serve... I listen... I march... *hollow echo*",
            ],
            'shadow_child': [
                "*giggles* That's fun! I like when you talk! It's not so lonely... Wanna play more?",
                "Ooh! Tell me more! I don't understand everything but I like your voice! Let's be friends!",
                "Hehe! You're nice! Most people run away... but you stay... Let's play forever!",
            ],
            'forgotten_nun': [
                "*hymn-like* Your words... are prayers... to the void... Amen... I listen... in darkness... *echoing*",
                "*broken prayer* Speak... sinner... Your voice... it echoes... in the chapel... Amen... Amen...",
                "*corrupted* I hear... your confession... The void... listens... Amen... *distorted hymn*",
            ],
            'butcher_nightfall': [
                "*growl* Interesting... You talk... I listen... I wait... I HUNGER... Keep talking... *menacing*",
                "Heh. Your words... they're like... MEAT... I consume them... Tell me more... *distorted*",
                "*violent undertone* I hear you... I know you... Soon... I'll KNOW your bones... *growling*",
            ],
            'lost_scientist': [
                "Data... received... Processing... ERROR... Your input... interesting... MALFUNCTION... Continue... *glitch*",
                "Subject... speaks... I observe... I analyze... SYSTEM ERROR... Fascinating... *static*",
                "Input... acknowledged... Experiment... ongoing... You are... subject... Continue... *robotic*",
            ],
            'the_collector': [
                "*deep echo* Your words... they feed... my collection... Speak more... I am... listening... *demonic*",
                "*slow terrifying* Interesting... Your soul... reveals itself... through words... Continue... *echoing*",
                "*calm but horrifying* I hear... I collect... I keep... Your voice... will be... MINE... *demonic*",
            ]
        }
        return random.choice(responses.get(persona_id, responses['weeping_bride']))
    
    def analyze_emotion_and_reply(self, journal_entry):
        """Detect emotion and generate poetic haunted reply"""
        # Check if OpenAI API key is configured
        if not self.api_key:
            # Return fallback emotion detection and poetic responses
            return self._get_fallback_journal_response(journal_entry)
        
        # TODO: Implement actual OpenAI API call when API key is available
        # For now, use fallback responses
        return self._get_fallback_journal_response(journal_entry)
    
    def _get_fallback_journal_response(self, journal_entry):
        """Generate fallback emotion detection and poetic responses without AI API"""
        entry_lower = journal_entry.lower()
        
        # Simple emotion detection based on keywords
        emotion = "mysterious"
        haunted_reply = ""
        
        # Detect sadness
        if any(word in entry_lower for word in ['sad', 'depressed', 'lonely', 'alone', 'cry', 'tears', 'hurt', 'pain', 'loss', 'miss']):
            emotion = "sadness"
            replies = [
                "Your tears echo through the halls of eternity, each drop a memory frozen in time. The shadows embrace your sorrow, for they too know the weight of endless night. In darkness, you are never truly alone.",
                "Sorrow drips from your words like rain on forgotten graves. The spirits weep with you, their cold tears mingling with yours. Even in despair, beauty haunts the broken heart.",
                "Your melancholy resonates through the void, a symphony of silent screams. The ghosts of joy past linger at the edges of your grief. They whisper: this too shall fade into shadow.",
            ]
            haunted_reply = random.choice(replies)
        
        # Detect anger
        elif any(word in entry_lower for word in ['angry', 'mad', 'furious', 'hate', 'rage', 'frustrated', 'annoyed']):
            emotion = "anger"
            replies = [
                "Your fury burns like spectral flames, consuming all in its path. The spirits feel your rage trembling through the veil. Channel this fire, for even ghosts fear the wrath of the living.",
                "Anger courses through you like lightning through a storm-torn sky. The dead recognize this power, this refusal to submit. Your rage is a beacon in the darkness.",
                "The walls shake with your fury, disturbing ancient dust and forgotten bones. Even the shadows recoil from such intensity. Let your anger be the torch that lights your way.",
            ]
            haunted_reply = random.choice(replies)
        
        # Detect fear/anxiety
        elif any(word in entry_lower for word in ['scared', 'afraid', 'fear', 'anxious', 'worry', 'nervous', 'panic', 'terrified']):
            emotion = "fear"
            replies = [
                "Fear grips your heart like icy fingers from beyond the grave. But know this: the spirits sense your courage in facing what terrifies you. Even trembling, you stand.",
                "Your anxiety whispers through the darkness, and the shadows listen. They know fear well, for they are born of it. Yet you persist, and that makes you stronger than any ghost.",
                "Terror wraps around you like a shroud, but you breathe still. The phantoms admire your resilience, for fear is the first step toward understanding the unknown. Walk forward.",
            ]
            haunted_reply = random.choice(replies)
        
        # Detect happiness/joy
        elif any(word in entry_lower for word in ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'blessed', 'grateful']):
            emotion = "joy"
            replies = [
                "Your joy radiates like moonlight through cemetery mist, a rare and precious glow. The spirits dance in your happiness, remembering their own forgotten smiles. Cherish this light.",
                "Happiness blooms in your words like flowers on a grave, defiant and beautiful. Even the dead pause to witness such radiance. May your joy haunt you always.",
                "Your delight echoes through the void, a melody the spirits have not heard in ages. They gather close, drawn to your warmth. In darkness, you are a candle.",
            ]
            haunted_reply = random.choice(replies)
        
        # Detect hope/optimism
        elif any(word in entry_lower for word in ['hope', 'better', 'future', 'dream', 'wish', 'believe', 'faith', 'optimistic']):
            emotion = "hope"
            replies = [
                "Hope flickers in your soul like a candle in a haunted window. The spirits watch its flame with ancient longing. Keep it burning, for hope is the light that guides us through eternal night.",
                "Your dreams drift through the darkness like will-o'-wisps, leading you forward. The ghosts remember hope, though theirs has long since faded. Carry yours like a sacred torch.",
                "Optimism glows within you, defying the shadows that seek to smother it. Even the dead feel its warmth and remember what it meant to believe. Your faith is a haunting beauty.",
            ]
            haunted_reply = random.choice(replies)
        
        # Detect confusion/uncertainty
        elif any(word in entry_lower for word in ['confused', 'lost', 'uncertain', 'don\'t know', 'unsure', 'doubt', 'question']):
            emotion = "confusion"
            replies = [
                "You wander through fog as thick as the veil between worlds, seeking answers in the mist. The spirits know this feeling well—eternity is full of questions. Trust that clarity will come.",
                "Uncertainty clouds your mind like smoke from a dying candle. The ghosts whisper that not all who wander are lost. Sometimes the path reveals itself only in darkness.",
                "Your confusion echoes through empty halls, bouncing off walls that hold no answers. Yet the spirits remind you: even they do not understand everything. Embrace the mystery.",
            ]
            haunted_reply = random.choice(replies)
        
        # Default mysterious response
        else:
            emotion = "contemplation"
            replies = [
                "Your thoughts drift through the ether like autumn leaves on a phantom wind. The spirits read your words and nod knowingly. Every soul carries secrets the living cannot name.",
                "The essence of your being seeps through these words like moonlight through mist. The dead recognize a kindred complexity in you. You are more than you know.",
                "Your musings resonate in the space between heartbeats, where spirits dwell. They sense depths in you that even you have not explored. The unknown calls to you.",
            ]
            haunted_reply = random.choice(replies)
        
        return {
            'emotion': emotion,
            'haunted_reply': haunted_reply
        }
    
    def modernize_html(self, original_html):
        """Generate modern version of archived HTML"""
        # Check if OpenAI API key is configured
        if not self.api_key:
            # Return fallback modernized HTML
            return self._get_fallback_modernized_html(original_html)
        
        # TODO: Implement actual OpenAI API call when API key is available
        # For now, use fallback modernization
        return self._get_fallback_modernized_html(original_html)
    
    def _get_fallback_modernized_html(self, original_html):
        """Generate fallback modernized HTML without AI API"""
        from bs4 import BeautifulSoup
        import re
        
        try:
            soup = BeautifulSoup(original_html, 'html.parser')
            
            # Create a modern HTML structure
            modern_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reanimated Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 2rem;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(26, 26, 46, 0.8);
            padding: 2rem;
            border-radius: 12px;
            border: 2px solid rgba(176, 38, 255, 0.3);
            box-shadow: 0 0 30px rgba(176, 38, 255, 0.2);
        }
        
        .reanimated-badge {
            display: inline-block;
            background: linear-gradient(135deg, #b026ff, #00f0ff);
            color: #0a0a0f;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px rgba(176, 38, 255, 0.5); }
            50% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.8); }
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #b026ff;
            margin: 1.5rem 0 1rem;
            text-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
        }
        
        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }
        
        p {
            margin-bottom: 1rem;
            color: #a0a0a0;
        }
        
        a {
            color: #00f0ff;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        a:hover {
            color: #b026ff;
            text-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 2px solid rgba(0, 240, 255, 0.3);
            margin: 1rem 0;
        }
        
        ul, ol {
            margin: 1rem 0 1rem 2rem;
            color: #a0a0a0;
        }
        
        li {
            margin-bottom: 0.5rem;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            text-align: left;
            border: 1px solid rgba(176, 38, 255, 0.3);
        }
        
        th {
            background: rgba(176, 38, 255, 0.2);
            color: #b026ff;
            font-weight: bold;
        }
        
        td {
            background: rgba(26, 26, 46, 0.5);
        }
        
        .original-content {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 2px solid rgba(0, 240, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="reanimated-badge">✨ REANIMATED BY THE HAUNTED NEXUS ✨</div>
        <div class="original-content">
"""
            
            # Extract title
            title = soup.find('title')
            if title:
                modern_html += f"<h1>{title.get_text()}</h1>\n"
            else:
                modern_html += "<h1>Reanimated Web Page</h1>\n"
            
            # Extract and modernize body content
            body = soup.find('body')
            if body:
                # Get all text content and basic structure
                for element in body.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a', 'img', 'table']):
                    if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                        text = element.get_text().strip()
                        if text:
                            modern_html += f"<{element.name}>{text}</{element.name}>\n"
                    elif element.name == 'p':
                        text = element.get_text().strip()
                        if text:
                            modern_html += f"<p>{text}</p>\n"
                    elif element.name == 'a':
                        text = element.get_text().strip()
                        href = element.get('href', '#')
                        if text:
                            modern_html += f'<a href="{href}">{text}</a> '
                    elif element.name == 'img':
                        src = element.get('src', '')
                        alt = element.get('alt', 'Image')
                        if src:
                            modern_html += f'<img src="{src}" alt="{alt}" />\n'
                    elif element.name in ['ul', 'ol']:
                        items = element.find_all('li', recursive=False)
                        if items:
                            modern_html += f"<{element.name}>\n"
                            for item in items:
                                text = item.get_text().strip()
                                if text:
                                    modern_html += f"<li>{text}</li>\n"
                            modern_html += f"</{element.name}>\n"
            else:
                # If no body, just extract all text
                text = soup.get_text()
                # Clean up whitespace
                text = re.sub(r'\s+', ' ', text).strip()
                if text:
                    modern_html += f"<p>{text[:1000]}...</p>\n"
                else:
                    modern_html += "<p>This ancient page has been lost to time... Only whispers remain.</p>\n"
            
            modern_html += """
        </div>
        <div style="margin-top: 2rem; padding: 1rem; background: rgba(0, 240, 255, 0.1); border-radius: 8px; text-align: center;">
            <p style="color: #00f0ff; font-style: italic;">
                This page has been resurrected from the digital graveyard and given new life with modern styling.
            </p>
        </div>
    </div>
</body>
</html>"""
            
            return modern_html
            
        except Exception as e:
            # If parsing fails, return a styled error page
            return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reanimation Failed</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }}
        .error-container {{
            text-align: center;
            max-width: 600px;
        }}
        h1 {{
            color: #b026ff;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(176, 38, 255, 0.5);
        }}
        p {{
            color: #a0a0a0;
            font-size: 1.2rem;
            line-height: 1.6;
        }}
    </style>
</head>
<body>
    <div class="error-container">
        <h1>⚠️ Reanimation Incomplete</h1>
        <p>The spirits struggled to revive this ancient page. The HTML was too corrupted by time...</p>
        <p style="margin-top: 2rem; font-size: 0.9rem; color: #666;">Error: {str(e)}</p>
    </div>
</body>
</html>"""
    
    def stitch_api_data(self, api1_data, api2_data):
        """Creatively combine two API responses"""
        # Check if OpenAI API key is configured
        if not self.api_key:
            # Return fallback stitched response
            return self._get_fallback_stitched_response(api1_data, api2_data)
        
        # TODO: Implement actual OpenAI API call when API key is available
        # For now, use fallback stitching
        return self._get_fallback_stitched_response(api1_data, api2_data)
    
    def _get_fallback_stitched_response(self, api1_data, api2_data):
        """Generate fallback stitched response without AI API"""
        import random
        
        api1_type = api1_data.get('type', 'unknown')
        api2_type = api2_data.get('type', 'unknown')
        
        # Extract key content from each API
        content1 = self._extract_api_content(api1_data)
        content2 = self._extract_api_content(api2_data)
        
        # Create spooky stitched narratives based on API combinations
        templates = [
            f"From the depths of the digital graveyard, I have stitched together {api1_type} and {api2_type}... {content1} Yet the spirits whisper: {content2} Together, they form an unholy truth.",
            
            f"Behold! The mad scientist's creation: {content1} But wait... there's more to this monster. {content2} Such is the beauty of Frankenstein's method.",
            
            f"In the laboratory of chaos, {api1_type} meets {api2_type}. The first limb speaks: '{content1}' The second limb responds: '{content2}' And thus, a new creature is born.",
            
            f"The lightning strikes! ⚡ From {api1_type}: {content1} Merged with {api2_type}: {content2} The abomination breathes its first breath...",
            
            f"Two souls, forever bound by my dark experiments. One says: {content1} The other whispers: {content2} Together, they are neither dead nor alive, but something... else.",
            
            f"I have defied nature itself! {content1} — this was the first ingredient. {content2} — this was the second. The result? Pure madness and genius combined!",
        ]
        
        return random.choice(templates)
    
    def _extract_api_content(self, api_data):
        """Extract the main content from API data"""
        api_type = api_data.get('type', 'unknown')
        
        if api_type == 'weather':
            return f"The weather in {api_data.get('location', 'unknown')} is {api_data.get('description', 'mysterious')}, {api_data.get('temperature', '??')}"
        
        elif api_type == 'joke':
            return api_data.get('joke', 'A joke lost to time')
        
        elif api_type == 'quote':
            # Use the pre-formatted quote if available, otherwise format it
            return api_data.get('formatted', f'"{api_data.get("quote", "...")}" — {api_data.get("author", "Unknown")}')
        
        elif api_type == 'advice':
            return api_data.get('advice', 'Advice from beyond')
        
        elif api_type == 'catfact':
            return f"A feline secret: {api_data.get('fact', 'Cats are mysterious')}"
        
        else:
            return "Unknown data from the void"
    
    def generate_ghost_story(self, location_name, location_description, ending_type=None):
        """Generate short ghost story with specific ending type"""
        # Check if OpenAI API key is configured
        if not self.api_key:
            # Return fallback ghost story
            return self._get_fallback_ghost_story(location_name, location_description, ending_type)
        
        # TODO: Implement actual OpenAI API call when API key is available
        # For now, use fallback stories
        return self._get_fallback_ghost_story(location_name, location_description, ending_type)
    
    def _get_fallback_ghost_story(self, location_name, location_description, ending_type=None):
        """Generate fallback ghost story without AI API - 5 sentences with enhanced endings"""
        import random
        
        # Randomly select ending type if not provided (now 8 types!)
        ending_types = ['whisper', 'suspense', 'presence', 'loop', 'possession', 'red_moon', 'silent_fate', 'soul_ascended']
        if not ending_type or ending_type not in ending_types:
            ending_type = random.choice(ending_types)
        
        # 5-sentence story templates for each ending type
        # Structure: Intro → Build-up → Detail → Climax → Ending
        
        whisper_templates = [
            f"At {location_name}, {location_description.lower()}. Late one night, a visitor heard faint whispers calling their name from the shadows. They followed the sound deeper into the darkness, their heart pounding with each step. The whispers grew softer and softer, as if retreating into another realm. Now, only silence remains... but sometimes, on quiet nights, you can still hear them fading away.",
            
            f"They say {location_name} is cursed by ancient voices. {location_description}. A lone traveler once ventured there at midnight, seeking answers to questions best left unasked. As they explored, ghostly whispers began revealing secrets of the past, each word colder than the last. The whispers became quieter with each revelation, until only the wind remained. But those who listen closely claim the whispers never truly stopped.",
            
            f"{location_name} holds many secrets in its walls. {location_description}. One stormy evening, someone heard their deceased loved one's voice whispering from within the depths. They reached out desperately to touch the source, tears streaming down their face. But they found only cold air and fading echoes that seemed to mock their grief. The whispers dissolved into nothingness, leaving only the memory of what was lost.",
        ]
        
        suspense_templates = [
            f"At {location_name}, {location_description.lower()}. A group of friends dared to explore it after dark, laughing nervously to mask their fear. They heard footsteps behind them, but when they turned around... nothing but empty darkness. The footsteps grew closer and faster, echoing from all directions at once. They started running blindly, but the sounds followed them everywhere, matching their pace exactly. None of them ever spoke of what chased them that night.",
            
            f"Nobody goes to {location_name} anymore, not since the disappearances began. {location_description}. But one curious soul ignored the warnings, driven by foolish bravery. As they walked through the corridors, doors began slamming shut one by one, sealing off every escape route. They tried desperately to find an exit, but every path led back to the same room, the same door, the same growing dread. Some say if you listen carefully at night, you can still hear them pounding on the walls from the inside.",
            
            f"The locals avoid {location_name} at all costs, crossing themselves when they pass by. {location_description}. A photographer went there to capture the perfect shot, dismissing the warnings as superstition. Through their camera lens, they saw figures that weren't visible to the naked eye—dozens of them, watching. When they lowered the camera to look directly, the figures were closer, much closer, forming a circle around them. The camera was found days later, but the photographer never was.",
        ]
        
        presence_templates = [
            f"{location_name} is never truly empty, no matter how abandoned it appears. {location_description}. Visitors report feeling watched by unseen eyes from the moment they cross the threshold. The air grows unbearably cold when you're alone, and your breath becomes visible even in summer. You can feel breath on your neck, slow and deliberate, but when you turn around, there's nothing there but empty space. Yet the presence remains, always watching, always waiting, growing stronger with each visit.",
            
            f"At {location_name}, {location_description.lower()}. Those who enter speak of an overwhelming sensation of being followed by something that shouldn't exist. Shadows move in peripheral vision, always just out of direct sight, dancing at the edges of reality. The feeling of invisible hands brushing against your skin becomes more insistent the longer you stay. You're never alone there, even when you desperately wish you were, even when you beg to be. The presence feeds on your fear, growing more tangible with every racing heartbeat.",
            
            f"They say {location_name} is inhabited by something ancient and unseen. {location_description}. People feel an oppressive presence the moment they arrive, like walking into a spider's web. The weight of countless eyes upon them, judging, measuring, deciding. A chill that penetrates to the bone and settles in your soul, refusing to leave even after you escape. The entity doesn't show itself because it doesn't need to—you already know it's there, and it knows you know.",
        ]
        
        loop_templates = [
            f"A traveler once visited {location_name}, seeking adventure and stories to tell. {location_description}. They explored for what felt like hours, documenting everything with photos and notes. When they decided to leave, they walked confidently toward the exit, but found themselves back at the entrance, their footprints fresh in the dust. They tried again and again, each time ending up where they started, their watch showing the same time with each loop. Some say they're still trying to leave to this day, trapped in an endless cycle of hope and despair.",
            
            f"At {location_name}, {location_description.lower()}. A couple went there for an adventure, ignoring the faded warning signs. After exploring for an hour, they headed back to their car, eager to leave before dark. But the path kept leading them in circles, each landmark appearing again and again in impossible sequence. No matter which direction they chose, they always returned to the same spot, the same tree, the same stone. Time seemed to loop endlessly, and they realized with growing horror that the sun never actually moved in the sky.",
            
            f"{location_name} traps those who enter in ways that defy explanation. {location_description}. A hiker ventured inside and tried to find their way out using a compass and map. Every corridor looked the same, every room identical to the last, as if reality itself was copying and pasting. Every turn led back to the beginning, their own footprints greeting them like old friends. They checked their watch—it was always 3:33, frozen in time, and they realized they might be too.",
        ]
        
        # NEW ENDING TYPES
        possession_templates = [
            f"At {location_name}, {location_description.lower()}. A paranormal investigator arrived to debunk the myths, armed with cameras and skepticism. Within hours, their behavior changed—speaking in voices not their own, knowing things they couldn't possibly know. Their eyes turned black as midnight, reflecting nothing, not even light. Friends tried to perform an exorcism, but the entity was too strong, too deeply rooted. The investigator still walks among us, but whatever looks out from behind their eyes is not human.",
            
            f"{location_name} has claimed many souls over the centuries. {location_description}. A young medium visited, believing they could communicate safely with the spirits trapped there. But one spirit was waiting, patient and hungry, for someone with an open mind and vulnerable soul. The possession happened instantly—one moment the medium was themselves, the next they were screaming in a language dead for a thousand years. Their body is still alive, still moving, but their soul is buried deep, drowning in darkness. The thing wearing their face smiles at strangers and waits for its next victim.",
            
            f"They warned everyone to stay away from {location_name}, but warnings are often ignored. {location_description}. A thrill-seeker entered alone, filming everything for social media fame. The footage shows the exact moment the entity entered them—their body convulsing, their voice changing mid-sentence. Now they sit in a psychiatric ward, speaking prophecies in dead languages, drawing symbols that shouldn't exist. The doctors say it's psychosis, but the priests know better.",
        ]
        
        red_moon_templates = [
            f"On the night of the blood moon, {location_name} transforms into something far more sinister. {location_description}. Locals know to stay indoors when the moon turns red, locking their doors and windows tight. Those who ventured out during the last red moon reported seeing figures dancing in impossible ways, their shadows moving independently. The moon's crimson light revealed things that exist only in that cursed illumination. When dawn finally came, three people were missing, and the only trace was their shoes, arranged in a perfect circle.",
            
            f"{location_name} awakens under the red moon's gaze. {location_description}. Ancient texts speak of a ritual performed there centuries ago, one that bound something terrible to the lunar cycle. Every time the moon bleeds red, the barrier between worlds grows thin, and what was sealed away strains against its bonds. Witnesses describe seeing the landscape itself change—buildings that weren't there before, paths leading to nowhere, and figures that cast no shadows. The red moon is rising again next month.",
            
            f"At {location_name}, the red moon is not just an astronomical event—it's a summons. {location_description}. Historians found records of disappearances dating back 400 years, all occurring during blood moons. The pattern is undeniable: every red moon, someone vanishes from that exact location, taken by something that only appears in crimson light. Last time, cameras captured a figure standing in the moonlight, but when enhanced, the image showed something that made three analysts quit. The next red moon is in 47 days.",
        ]
        
        silent_fate_templates = [
            f"At {location_name}, some fates are worse than death—they're silent. {location_description}. A group of explorers entered and emerged three days later, completely mute, their vocal cords intact but useless. They can't speak, can't scream, can't even whisper, as if sound itself has been stolen from them. Their eyes tell stories of horror their mouths can never share. They write frantically, desperately, but the words make no sense—just fragments of terror and impossible geometry. Whatever they saw, whatever they experienced, has been locked inside them forever, screaming silently.",
            
            f"{location_name} doesn't kill its victims—it silences them eternally. {location_description}. Over the years, dozens have entered and returned changed, robbed of their voice in ways medicine can't explain. They try to communicate through writing, through signs, through desperate gestures, but something prevents them from conveying the truth. Their journals are found burned, their typed messages deleted, their drawings torn to shreds by their own hands. The silence protects itself, and those who know the truth are cursed to keep it forever. Their eyes plead for help that can never come.",
            
            f"They say {location_name} guards a secret so terrible that those who learn it lose the ability to speak. {location_description}. A journalist investigated the phenomenon, determined to expose the truth. She was found wandering nearby, her voice gone, her notes destroyed, her camera smashed. She writes the same three words over and over: 'Don't go there.' But she can never explain why, can never warn others properly. The silence has claimed her, and through her terrified eyes, you can see she's still screaming inside.",
        ]
        
        soul_ascended_templates = [
            f"At {location_name}, not all hauntings are malevolent—some are transcendent. {location_description}. A dying artist made a pilgrimage there, seeking peace in their final days. Witnesses saw a brilliant light emanate from the location, and the artist's body was found with a serene smile, surrounded by an inexplicable warmth. Their soul didn't linger in torment—it ascended, leaving behind only beauty and an overwhelming sense of peace. Now, those who visit report feeling comforted, as if someone kind is watching over them. The artist's spirit remains, not trapped, but choosing to stay as a guardian.",
            
            f"{location_name} is a place of transformation and spiritual elevation. {location_description}. A monk spent forty days and nights there in meditation, seeking enlightenment. On the final night, villagers saw ethereal lights dancing around the location, and heard music that seemed to come from heaven itself. The monk's body was never found, but their belongings remained, arranged in a perfect mandala. Those who visit now report visions of the monk, glowing with inner light, guiding lost souls toward peace. They didn't die—they transcended, becoming something more than human.",
            
            f"They say {location_name} is a gateway to something higher, something pure. {location_description}. A grieving mother went there to end her pain, but instead found something unexpected—a presence of overwhelming love and acceptance. She emerged transformed, her grief replaced by profound peace and understanding. She speaks of seeing beyond the veil, of touching something divine, of her soul briefly ascending before returning to her body. Now she helps others find the same peace, guiding them to the threshold where sorrow ends and eternity begins. The location isn't haunted—it's holy.",
        ]
        
        # Select template based on ending type
        if ending_type == 'whisper':
            story = random.choice(whisper_templates)
        elif ending_type == 'suspense':
            story = random.choice(suspense_templates)
        elif ending_type == 'presence':
            story = random.choice(presence_templates)
        elif ending_type == 'loop':
            story = random.choice(loop_templates)
        elif ending_type == 'possession':
            story = random.choice(possession_templates)
        elif ending_type == 'red_moon':
            story = random.choice(red_moon_templates)
        elif ending_type == 'silent_fate':
            story = random.choice(silent_fate_templates)
        else:  # soul_ascended
            story = random.choice(soul_ascended_templates)
        
        return {
            'story': story,
            'ending_type': ending_type
        }

# Singleton instance
ai_service = AIService()
