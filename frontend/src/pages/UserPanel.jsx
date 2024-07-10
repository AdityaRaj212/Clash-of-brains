import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserPanel.module.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Pusher from 'pusher-js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserPanel = () => {
  const {isAuthenticated, signOut} = useContext(AuthContext);

  const navigate = useNavigate();

  // Dummy data
  const [usersOnline, setUsersOnline] = useState([]);
  const preDesignedQuizzes = [
    { id: 1, title: "General Knowledge", description: "Test your general knowledge." },
    { id: 2, title: "Science Quiz", description: "A quiz on various scientific topics." }
  ];
  const liveQuizzes = [
    { id: 1, title: "Math Quiz", description: "Live quiz on mathematics." },
    { id: 2, title: "History Quiz", description: "Test your knowledge on history." }
  ];

  useEffect(()=>{
    try{
      const fetchOnlineUsers = async ()=>{
        const response = await axios.get('/api/users/online');
        console.log(response);
        setUsersOnline(response.data.users);
      }
      fetchOnlineUsers();
    }catch(err){
      console.error('There was an error fetching users online: ' + err);
    }

    const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
      cluster: "ap2"
    });
    // const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
    //   cluster: "ap2"
    // });
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
      // pusher.disconnect();
  };
  },[]);

  const handleStartQuiz = ()=>{
    if(isAuthenticated){
      navigate('/quiz-waiting-lobby');
    }else{
      toast.info('Login to start a quiz');
    }
  }

  const handleLogout = ()=>{
    signOut();
  }

  const handleLogin = ()=>{
    navigate('/');
  }

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
        {isAuthenticated &&
          (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )
        }
        {!isAuthenticated &&
          (
            <Button variant="success" onClick={handleLogin}>
              Login
            </Button>
          )
        }

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
      <ToastContainer />
    </div>
  );
};

export default UserPanel;
