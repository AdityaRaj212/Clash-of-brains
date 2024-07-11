import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserPanel.module.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faPlayCircle, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import QuizCard from '../components/QuizCard';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserPanel = () => {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usersOnline, setUsersOnline] = useState([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);

  // Dummy data
  const preDesignedQuizzes = [
    { id: 1, title: "General Knowledge", description: "Test your general knowledge." },
    { id: 2, title: "Science Quiz", description: "A quiz on various scientific topics." }
  ];
  const liveQuizzes = [
    { id: 1, title: "Math Quiz", description: "Live quiz on mathematics." },
    { id: 2, title: "History Quiz", description: "Test your knowledge on history." }
  ];

  useEffect(() => {
    if (user) {
      setGamesPlayed(user.gamesPlayed);
      setGamesWon(user.gamesWon);
      setTotalScore(user.totalScore);
    }
  }, [user]);

  useEffect(() => {
    try {
      const fetchOnlineUsers = async () => {
        const response = await axios.get('/api/users/online');
        setUsersOnline(response.data.users);
      };
      fetchOnlineUsers();
    } catch (err) {
      console.error('There was an error fetching users online: ' + err);
    }

    const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
      cluster: "ap2"
    });
    const channel = pusher.subscribe('users');
    channel.bind('new-user', (data) => {
      setUsersOnline(prevUsers => [...prevUsers, data.user]);
      toast.success('A new user has joined: ' + data.user.userName);
    });

    channel.bind('user-logged-out', (data) => {
      setUsersOnline(prevUsers => prevUsers.filter(user => user._id !== data.userId));
      toast.info('A user has left.');
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
        try {
            const quizzesResponse = await axios.get('/api/quiz/all-quizzes');
            const quizzesData = quizzesResponse.data.quizzes;
            setQuizzes(quizzesData);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    fetchQuizzes();
}, []);

  const handleStartQuiz = () => {
    if (isAuthenticated) {
      navigate('/quiz-waiting-lobby');
    } else {
      toast.info('Login to start a quiz');
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    navigate('/');
  };

  const data = {
    labels: ['Games Played', 'Games Won'],
    datasets: [
      {
        label: 'Games',
        data: [gamesPlayed, gamesWon],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        },
        suggestedMax: Math.max(gamesPlayed, gamesWon) + 1
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.usersOnlineContainer}>
        <h2 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faUsers} /> Users Online in Lobby
        </h2>
        <Button variant="primary" onClick={handleStartQuiz}>
          Start Quiz
        </Button>
        <ul className={styles.userList}>
          {usersOnline.map((user, index) => (
            <li key={index} className={styles.userItem}>{user.userName}</li>
          ))}
        </ul>
      </div>

      <div className={styles.contentContainer}>
        {isAuthenticated && (
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
        {!isAuthenticated && (
          <Button variant="success" onClick={handleLogin}>
            Login
          </Button>
        )}

        <div className={styles.row1}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faTrophy} /> User Stats
            </h2>
            <div className={styles.chartContainer}>
              <Bar data={data} options={options} />
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{totalScore}</span>
              <span className={styles.statLabel}>Total Score</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faClipboardList} /> Pre-Designed Quizzes
            </h2>
            <div className={styles.quizList}>
              {preDesignedQuizzes.map((quiz) => (
                <div key={quiz.id} className={styles.quizCard}>
                  <div className={styles.quizTitle}>{quiz.title}</div>
                  <div className={styles.quizDescription}>{quiz.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.section} ${styles.pastQuizzes}`}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faPlayCircle} /> Live Quizzes Played till now
            </h2>
            <div className={styles.quizList}>
              {quizzes.map((quiz)=>(
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserPanel;
