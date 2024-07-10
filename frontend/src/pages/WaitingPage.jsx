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
    const [countdown, setCountdown] = useState(0);
    const [userAvatar, setUserAvatar] = useState('');
    const [opponentAvatar, setOpponentAvatar] = useState('');

    const getRandomAvatarUrl = (seed) => {
        return `https://api.multiavatar.com/${seed}.svg`;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            const createQuiz = async () => {
                try {
                    const quizResponse = await axios.get(`/api/quiz/create/${user._id}`);
                    console.log(quizResponse);
                    if (quizResponse.data.status === 'ready to start') {
                        const opponentId = quizResponse.data.quiz.players.find(player => player !== user._id);
                        try {
                            const opponentResponse = await axios.get(`/api/users/get-user-by-id/${opponentId}`);
                            const opponent = opponentResponse.data.user;
                            console.log(opponentResponse);
                            setOpponent(opponent);
                            setOpponentAvatar(getRandomAvatarUrl(opponentId));

                            setCountdown(5); // Start countdown from 5

                            const timer = setInterval(() => {
                                setCountdown(prev => {
                                    if (prev <= 1) {
                                        clearInterval(timer);
                                        navigate(`/quiz/${quizResponse.data.quiz._id}`);
                                    }
                                    return prev - 1;
                                });
                            }, 1000);
                        } catch (err) {
                            console.error('Error fetching opponent:', err);
                            toast.error('Failed to fetch opponent information.');
                        }
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
        const channel = pusher.subscribe('quiz');

        channel.bind('new-quiz', async (data) => {
            if (data.status === 'ready') {
                const opponentId = data.quiz.players.find(player => player !== user._id);
                console.log(opponentId);

                try {
                    const opponentResponse = await axios.get(`/api/users/get-user-by-id/${opponentId}`);
                    const opponent = opponentResponse.data.user;
                    console.log(opponentResponse);
                    setOpponent(opponent);
                    setOpponentAvatar(getRandomAvatarUrl(opponentId));

                    setCountdown(5); // Start countdown from 5

                    const timer = setInterval(() => {
                        setCountdown(prev => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate(`/quiz/${data.quiz._id}`);
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } catch (err) {
                    console.error('Error fetching opponent:', err);
                    toast.error('Failed to fetch opponent information.');
                }
            } else {
                toast.info(data.status);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (user) {
            setUserAvatar(getRandomAvatarUrl(user._id));
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <div className={styles.userSection}>
                <img src={userAvatar} alt="User Profile" className={styles.profilePicture} />
                <h2>{user.userName}</h2>
            </div>
            <div className={styles.transitionSection}>
                {countdown > 0 ? (
                    <div className={styles.countdown}>
                        <div className={styles.loader}></div>
                        <p>Quiz starts in {countdown}...</p>
                    </div>
                ) : (
                    <div className={styles.loader}></div>
                )}
                {countdown === 0 && <p>Searching for an opponent...</p>}
            </div>
            <div className={styles.opponentSection}>
                {opponent ? (
                    <>
                        <img src={opponentAvatar} alt="Opponent Profile" className={styles.profilePicture} />
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
