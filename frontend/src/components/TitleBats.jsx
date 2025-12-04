import styles from './TitleBats.module.css';

const TitleBats = () => {
  const batSvg = (
    <svg width="40" height="30" viewBox="0 0 40 30" className={styles.batSvg}>
      {/* Bat body */}
      <path
        d="M20 15 Q15 10, 10 12 Q8 14, 5 12 Q2 10, 0 15 L5 20 Q10 18, 15 20 L20 25 L25 20 Q30 18, 35 20 L40 15 Q38 10, 35 12 Q32 14, 30 12 Q25 10, 20 15 Z"
        fill="#000000"
      />
      {/* Left wing */}
      <path
        d="M10 12 Q5 8, 2 10 Q0 12, 0 15 Q2 13, 5 12 Q8 14, 10 12 Z"
        fill="#000000"
      />
      {/* Right wing */}
      <path
        d="M30 12 Q35 8, 38 10 Q40 12, 40 15 Q38 13, 35 12 Q32 14, 30 12 Z"
        fill="#000000"
      />
      {/* Glowing left eye */}
      <circle cx="17" cy="14" r="1.5" className={styles.batEye} />
      {/* Glowing right eye */}
      <circle cx="23" cy="14" r="1.5" className={styles.batEye} />
    </svg>
  );

  return (
    <div className={styles.titleBatsContainer}>
      {/* Left side bats */}
      <div className={`${styles.bat} ${styles.leftTop}`}>
        {batSvg}
      </div>
      <div className={`${styles.bat} ${styles.leftBottom}`}>
        {batSvg}
      </div>
      
      {/* Right side bats */}
      <div className={`${styles.bat} ${styles.rightTop}`}>
        {batSvg}
      </div>
      <div className={`${styles.bat} ${styles.rightBottom}`}>
        {batSvg}
      </div>
    </div>
  );
};

export default TitleBats;
