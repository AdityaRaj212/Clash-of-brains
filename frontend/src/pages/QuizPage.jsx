import { useContext, useEffect, useState } from 'react';
import styles from './QuizPage.module.css';
import axios from 'axios';
import QuestionPallete from '../components/QuestionPallete';
import { useParams } from 'react-router-dom';
import Pusher from 'pusher-js';
import { AuthContext } from '../context/AuthContext';

const QuizPage = () => {
    const { quizId } = useParams();

    const {user} = useContext(AuthContext);

    const [quiz, setQuiz] = useState({ questionIds: [], players: [] });
    const [user1, setUser1] = useState({ userName: '' });
    const [user2, setUser2] = useState({ userName: '' });
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizResponse = await axios.get(`/api/quiz/get-by-id/${quizId}`);
                const fetchedQuiz = quizResponse.data.quiz;
                setQuiz(fetchedQuiz);
                // console.log(fetchedQuiz);
                // console.log('Quiz: ' + quizResponse.data);

                if (fetchedQuiz.players && fetchedQuiz.players.length >= 2) {
                    const user1Id = fetchedQuiz.players[0];
                    const user2Id = fetchedQuiz.players[1];

                    const user1Response = await axios.get(`/api/users/get-user-by-id/${user1Id}`);
                    const user2Response = await axios.get(`/api/users/get-user-by-id/${user2Id}`);
                    setUser1(user1Response.data.user);
                    setUser2(user2Response.data.user);

                    setScore1(user1Response.data.user.currentScore);
                    setScore2(user2Response.data.user.currentScore);
                } else {
                    console.error('Not enough players in the quiz');
                }
            } catch (err) {
                console.error('Error fetching quiz:', err);
            }
        };

        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
            cluster: "ap2"
        });

        const channel = pusher.subscribe(`quiz-${quizId}`);
        channel.bind('score-updated', data => {
            if (data.userId === quiz.players[0]) {
                setScore1(data.newScore);
            } else if (data.userId === quiz.players[1]) {
                setScore2(data.newScore);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [quizId, score1, score2]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questionIds.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const updateScore1 = (newScore) => {
        setScore1(newScore);
        console.log(quiz.players[0]);
        console.log('player0');
        axios.post('/api/users/update-score', {
            quizId,
            userId: quiz.players[0],
            newScore
        });
    };

    const updateScore2 = (newScore) => {
        setScore2(newScore);
        console.log(quiz.players[1]);
        console.log('player1');
        console.log(newScore);

        axios.post('/api/users/update-score', {
            quizId,
            userId: quiz.players[1],
            newScore
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {user._id===user1._id &&
                <>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user1.userName}
                        </div>
                        <div className={styles.score}>
                            {score1}
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user2.userName}
                        </div>
                        <div className={styles.score}>
                            {score2}
                        </div>
                    </div>
                </>
                }
                {user._id!=user1._id &&
                <>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user2.userName}
                        </div>
                        <div className={styles.score}>
                            {score2}
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user1.userName}
                        </div>
                        <div className={styles.score}>
                            {score1}
                        </div>
                    </div>
                </>
                }
                
            </div>

            <div className={styles.questionPallete}>
                {quiz.questionIds.length > 0 && (
                    <QuestionPallete
                    questionId={quiz.questionIds[currentQuestionIndex]}
                    updateScore={quiz.players[0] === user._id ? updateScore1 : updateScore2}
                    currentScore={quiz.players[0] === user._id ? score1 : score2}
                />
                )}
            </div>

            <button className={styles.nextButton} onClick={handleNextQuestion}>
                Next
            </button>
            <button className={styles.nextButton} onClick={handlePrevQuestion}>
                Prev
            </button>
        </div>
    );
};

export default QuizPage;
