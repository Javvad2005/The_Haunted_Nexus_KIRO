import React, { useState } from 'react';
import api, { APIError } from '../services/api';
import GhostVoiceButton from '../components/GhostVoiceButton';
import SpookyButton from '../components/SpookyButton';
import typingSounds from '../services/typingSounds';
import styles from './HauntedJournal.module.css';

const HauntedJournal = () => {
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entry.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    setResponse(null);

    try {
      // Call API
      const result = await api.submitJournalEntry(entry);
      setResponse(result);
    } catch (err) {
      console.error('Haunted journal error:', err);
      setError(err instanceof APIError ? err.message : 'Failed to reach the spirit realm');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Haunted Journal</h1>
        <p className={styles.subtitle}>Pour your soul onto the page... The spirits are listening...</p>
      </div>

      <div className={styles.content}>
        <form className={styles.journalForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Write your deepest thoughts and feelings here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={() => typingSounds.playTypingSound()}
            disabled={isLoading}
            rows={10}
          />
          
          {error && <div className={styles.error}>{error}</div>}
          
          <SpookyButton 
            type="submit" 
            disabled={isLoading || !entry.trim()}
          >
            {isLoading ? 'Summoning spirits...' : 'Submit to the Void'}
          </SpookyButton>
        </form>

        {response && (
          <div className={styles.responseArea}>
            <div className={styles.emotionBadge}>
              <span className={styles.emotionLabel}>Detected Emotion:</span>
              <span className={styles.emotionValue}>{response.emotion}</span>
            </div>
            
            <div className={styles.hauntedReply}>
              <p className={styles.replyText}>{response.haunted_reply}</p>
              <div className={styles.replyFooter}>
                <GhostVoiceButton 
                  text={response.haunted_reply} 
                  preset="emotional"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HauntedJournal;
