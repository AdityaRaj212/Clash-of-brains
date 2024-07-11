import React from 'react';
import styles from './LeaderboardCard.module.css';

const LeaderboardCard = ({ user }) => {
  return (
    <div className={styles.card}>
      <img 
        src={userAvatar} 
        alt={`${user.userName} profile`} 
        className={styles.profileImage}
      />
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{user.userName}</h3>
        <p className={styles.userStats}>Games Played: {user.gamesPlayed}</p>
        <p className={styles.userStats}>Games Won: {user.gamesWon}</p>
        <p className={styles.userStats}>Total Score: {user.totalScore}</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;
