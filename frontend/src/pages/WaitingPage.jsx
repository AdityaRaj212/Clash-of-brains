import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WaitingPage.module.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WaitingPage = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [opponent, setOpponent] = useState(null);
    // const [pusherInstance, setPusherInstance] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            const createQuiz = async () => {
                try {
                    const quizResponse = await axios.get(`/api/quiz/create/${user._id}`);
                    console.log(quizResponse);
                    if (quizResponse.data.status === 'ready to start') {
                        navigate(`/quiz/${quizResponse.data.quiz._id}`);
                    } else {
                        toast.info('Waiting for more players to join.');
                    }
                } catch (err) {
                    console.error('Error creating quiz:', err);
                    toast.error('Failed to create quiz.');
                }
            };
            createQuiz();
        }

        const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
            cluster: "ap2"
        });
        // const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
        //     cluster: "ap2"
        // });
        const channel = pusher.subscribe('quiz');

        // setPusherInstance(pusher); // Save the pusher instance

        channel.bind('new-quiz', (data) => {
            if (data.status === 'ready') {
                toast.info('Starting Quiz');
                navigate(`/quiz/${data.quiz._id}`);
            } else {
                toast.info(data.status);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            // pusher.disconnect();
        };
    }, [isAuthenticated, user, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.userSection}>
                {/* <img src={user.profilePicture} alt="User Profile" className={styles.profilePicture} /> */}
                <h2>{user.userName}</h2>
            </div>
            <div className={styles.transitionSection}>
                <div className={styles.loader}></div>
                <p>Searching for an opponent...</p>
            </div>
            <div className={styles.opponentSection}>
                {opponent ? (
                    <>
                        <img src={opponent.profilePicture} alt="Opponent Profile" className={styles.profilePicture} />
                        <h2>{opponent.userName}</h2>
                    </>
                ) : (
                    <>
                        <div className={styles.placeholderProfilePicture}></div>
                        <h2>Waiting...</h2>
                    </>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default WaitingPage;
