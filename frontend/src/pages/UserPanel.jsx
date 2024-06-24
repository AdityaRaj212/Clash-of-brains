import React from 'react';
import styles from './UserPanel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const UserPanel = () => {
  // Dummy data
  const usersOnline = ["Alice", "Bob", "Charlie", "Dave"];
  const preDesignedQuizzes = [
    { id: 1, title: "General Knowledge", description: "Test your general knowledge." },
    { id: 2, title: "Science Quiz", description: "A quiz on various scientific topics." }
  ];
  const liveQuizzes = [
    { id: 1, title: "Math Quiz", description: "Live quiz on mathematics." },
    { id: 2, title: "History Quiz", description: "Test your knowledge on history." }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.usersOnlineContainer}>
        <h2 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faUsers} /> Users Online in Lobby
        </h2>
        <ul className={styles.userList}>
          {usersOnline.map((user, index) => (
            <li key={index} className={styles.userItem}>{user}</li>
          ))}
        </ul>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faClipboardList} /> Pre-designed Quizzes
          </h2>
          <div className={styles.quizList}>
            {preDesignedQuizzes.map(quiz => (
              <div key={quiz.id} className={styles.quizCard}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <p className={styles.quizDescription}>{quiz.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faPlayCircle} /> Live Quizzes
          </h2>
          <div className={styles.quizList}>
            {liveQuizzes.map(quiz => (
              <div key={quiz.id} className={styles.quizCard}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <p className={styles.quizDescription}>{quiz.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
