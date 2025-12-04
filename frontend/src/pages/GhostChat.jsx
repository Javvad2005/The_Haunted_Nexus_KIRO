import React, { useState, useRef, useEffect } from 'react';
import api, { APIError } from '../services/api';
import GhostVoiceButton from '../components/GhostVoiceButton';
import SpookyButton from '../components/SpookyButton';
import typingSounds from '../services/typingSounds';
import { getAllPersonas } from '../data/ghostPersonas';
import styles from './GhostChat.module.css';

// Component to show relative time that updates
const RelativeTime = ({ timestamp }) => {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const diff = Math.floor((now - timestamp) / 1000); // difference in seconds

      if (diff < 60) {
        setRelativeTime('just now');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setRelativeTime(`${minutes} min${minutes > 1 ? 's' : ''} ago`);
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        setRelativeTime(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      } else {
        setRelativeTime(timestamp.toLocaleDateString());
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{relativeTime}</span>;
};

const GhostChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ghost',
      text: 'Greetings, mortal... I am the spirit of this realm. Speak, and I shall respond from beyond the veil...',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const messagesEndRef = useRef(null);

  // Load personas from embedded data (no backend needed!)
  useEffect(() => {
    console.log('🔮 Loading ghost personas from embedded data...');
    const personasData = getAllPersonas();
    console.log('🔮 Personas loaded:', personasData);
    setPersonas(personasData);
    console.log('🔮 Personas set successfully, count:', personasData.length);
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setError(null);
    setIsLoading(true);

    try {
      // Call API with selected persona
      const response = await api.sendGhostChatMessage(inputMessage, selectedPersona);

      // Add ghost response to chat
      const ghostMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ghost',
        text: response.reply,
        timestamp: new Date(response.timestamp),
        persona: response.persona,
      };

      setMessages((prev) => [...prev, ghostMessage]);
    } catch (err) {
      console.error('Ghost chat error:', err);
      setError(err instanceof APIError ? err.message : 'Failed to reach the spirit realm');

      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ghost',
        text: 'The connection to the spirit realm has been disrupted... Try again, mortal.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaSelect = (personaId) => {
    setSelectedPersona(personaId);
    setShowPersonaSelector(false);
    
    // Add system message about persona change
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      const systemMessage = {
        id: Date.now().toString(),
        sender: 'system',
        text: `Now speaking with ${persona.name} (${persona.era})`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ghost Chat</h1>
        <p className={styles.subtitle}>Converse with the spirits beyond...</p>
        
        {/* Persona Selector Button */}
        <div className={styles.personaControls}>
          <button
            className={styles.personaButton}
            onClick={() => setShowPersonaSelector(!showPersonaSelector)}
          >
            👻 {selectedPersona 
              ? personas.find(p => p.id === selectedPersona)?.name || 'Select Spirit'
              : 'Select Spirit'}
          </button>
        </div>

        {/* Persona Selection Modal */}
        {showPersonaSelector && (
          <div className={styles.personaModal}>
            <div className={styles.personaModalContent}>
              <h3>Choose a Spirit to Speak With</h3>
              {personas.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  Loading spirits from beyond the veil...
                </p>
              )}
              <div className={styles.personaList}>
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    className={`${styles.personaCard} ${
                      selectedPersona === persona.id ? styles.personaCardActive : ''
                    } candleFlicker`}
                    onClick={() => handlePersonaSelect(persona.id)}
                  >
                    <div className={styles.personaName}>{persona.name}</div>
                    <div className={styles.personaEra}>{persona.era}</div>
                    <div className={styles.personaTraits}>
                      {persona.traits.join(' • ')}
                    </div>
                    <div className={styles.personaTone}>{persona.tone}</div>
                  </button>
                ))}
              </div>
              <button
                className={styles.closePersonaModal}
                onClick={() => setShowPersonaSelector(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' 
                  ? styles.userMessage 
                  : message.sender === 'system'
                  ? styles.systemMessage
                  : styles.ghostMessage
              } candleFlicker`}
            >
              <div className={styles.messageContent}>
                {message.sender === 'ghost' && message.persona && (
                  <div className={styles.personaLabel}>
                    {message.persona.name}
                  </div>
                )}
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageFooter}>
                  <span className={styles.messageTime}>
                    <RelativeTime timestamp={message.timestamp} />
                  </span>
                  {message.sender === 'ghost' && (() => {
                    const voiceSettings = {
                      ...message.persona?.voice_settings,
                      gender: message.persona?.gender
                    };
                    console.log('🗣️ Ghost message persona:', message.persona);
                    console.log('🗣️ Voice settings being passed:', voiceSettings);
                    return (
                      <GhostVoiceButton 
                        text={message.text}
                        voiceSettings={voiceSettings}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.ghostMessage}`}>
              <div className={styles.messageContent}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <input
            type="text"
            className={styles.input}
            placeholder="Speak to the ghost..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={() => typingSounds.playTypingSound()}
            disabled={isLoading}
          />
          <SpookyButton type="submit" disabled={isLoading || !inputMessage.trim()}>
            Send
          </SpookyButton>
        </form>
      </div>
    </div>
  );
};

export default GhostChat;
