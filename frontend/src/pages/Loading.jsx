// Loading.js
import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.brain}>
        <div className={styles.brainPart1}></div>
        <div className={styles.brainPart2}></div>
      </div>
      <h2 className={styles.loadingText}>Clash of Brains</h2>
      <h3 className={styles.subText}>Loading your next challenge...</h3>
    </div>
  );
};

export default Loading;
