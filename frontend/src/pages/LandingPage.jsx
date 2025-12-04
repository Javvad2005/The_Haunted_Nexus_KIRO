import { useState } from 'react';
import { Link } from 'react-router-dom';
import GhostIntro from '../components/GhostIntro';
import WarningPopup from '../components/WarningPopup';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  // Show warning popup ONLY on first visit or page reload, NOT on navigation
  const [showWarning, setShowWarning] = useState(() => {
    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem('warningPopupShown');
    
    if (wasShown === 'true') {
      console.log('🎃 Popup already shown this session, skipping');
      return false;
    }
    
    // First visit in this session, show popup
    console.log('🎃 First visit this session, showing popup');
    return true;
  });
  
  // TEMPORARY: Skip intro to show content immediately
  const [showIntro, setShowIntro] = useState(false);
  const [showContent, setShowContent] = useState(true);
  
  const handleWarningClose = () => {
    setShowWarning(false);
    // Set flag ONLY when user closes the popup, not on initial load
    sessionStorage.setItem('warningPopupShown', 'true');
  };

  const handleIntroComplete = () => {
    console.log('Intro complete - hiding intro and showing content');
    setShowIntro(false);
    // Show content immediately after intro completes
    setShowContent(true);
  };

  const features = [
    {
      title: 'Ghost Chat',
      description: 'Converse with a spooky AI ghost that tells eerie tales and haunting jokes.',
      path: '/ghost-chat',
      icon: '👻',
    },
    {
      title: 'Haunted Journal',
      description: 'Pour your feelings into the void and receive poetic haunted responses.',
      path: '/haunted-journal',
      icon: '📖',
    },
    {
      title: 'Reanimator',
      description: 'Resurrect dead websites from the archives and breathe new life into them.',
      path: '/reanimator',
      icon: '⚡',
    },
    {
      title: 'Frankenstein Stitcher',
      description: 'Stitch together two APIs into a monstrous and creative mashup.',
      path: '/frankenstein-stitcher',
      icon: '🧪',
    },
    {
      title: 'Haunted Map',
      description: 'Explore cursed locations and uncover AI-generated ghost stories.',
      path: '/haunted-map',
      icon: '🗺️',
    },
    {
      title: 'Cursed Atelier',
      description: 'Transform your images into haunted masterpieces with cursed filters.',
      path: '/cursed-atelier',
      icon: '📸',
    },
  ];

  return (
    <div className={styles.container}>
      {showWarning && <WarningPopup onClose={handleWarningClose} />}
      {showIntro && <GhostIntro onComplete={handleIntroComplete} />}
      
      {showContent && (
        <>
          <div className={`${styles.hero} ${styles.fadeIn}`}>
            <h1 className={styles.title}>The Haunted Nexus</h1>
            <p className={styles.tagline}>
              Where AI meets the supernatural... Enter if you&nbsp;dare.
            </p>
          </div>

          <div className={`${styles.featuresGrid} ${styles.fadeIn}`}>
            {features.map((feature, index) => (
              <Link
                key={feature.path}
                to={feature.path}
                className={`${styles.featureCard} candleFlicker`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h2 className={styles.featureTitle}>{feature.title}</h2>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureArrow}>→</div>
              </Link>
            ))}
          </div>

          <footer className={styles.footer}>
            <p>Built for the Kiroween Hackathon 🎃</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;
