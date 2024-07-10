import { useContext, useEffect, useState } from 'react';
import styles from './QuizPage.module.css';
import axios from 'axios';
import QuestionPallete from '../components/QuestionPallete';
import { useParams, useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [quiz, setQuiz] = useState({ questionIds: [], players: [] });
    const [user1, setUser1] = useState({ userName: '' });
    const [user2, setUser2] = useState({ userName: '' });
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [user1Finished, setUser1Finished] = useState(false);
    const [user2Finished, setUser2Finished] = useState(false);
    const [loading, setLoading] = useState(true);

    const [maxTime, setMaxTime] = useState(30);
    const [maxPoints, setMaxPoints] = useState(1);
    const [timer, setTimer] = useState(maxTime);
    const [timeLeftPercentage, setTimeLeftPercentage] = useState(100);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const quizResponse = await axios.get(`/api/quiz/get-by-id/${quizId}`);
                const fetchedQuiz = quizResponse.data.quiz;
                setQuiz(fetchedQuiz);

                if (fetchedQuiz.players && fetchedQuiz.players.length >= 2) {
                    await axios.post(`/api/users/update-score`,{
                        userId: fetchedQuiz.players[0],
                        quizId,
                        newScore: 0,
                    });

                    await axios.post(`/api/users/update-score`,{
                        userId: fetchedQuiz.players[1],
                        quizId,
                        newScore: 0,
                    });
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
            }finally{
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    useEffect(()=>{
        if (currentQuestionIndex < quiz.questionIds.length - 1){
            const questionId = quiz.questionIds[currentQuestionIndex];
            
            const fetchQuestion = async ()=>{
                const questionResponse = await axios.get(`/api/question/get-by-id/${questionId}`);
                const question = questionResponse.data.question;

                console.log(question.points);
                console.log(question.time);

                setMaxPoints(question.points);
                setMaxTime(question.time);
                setTimer(question.time);
                setTimeLeftPercentage(100);
            }

            fetchQuestion();
        }
    },[currentQuestionIndex])

    useEffect(() => {
        const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
            cluster: "ap2"
        });
        // const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
        //     cluster: "ap2"
        // });

        const channel = pusher.subscribe(`quiz-${quizId}`);
        channel.bind('score-updated', data => {
            if (data.userId === quiz.players[0]) {
                setScore1(data.newScore);
            } else if (data.userId === quiz.players[1]) {
                setScore2(data.newScore);
            }
        });

        channel.bind('end-quiz', data => {
            console.log(user);
            // console.log(data);
            if(user._id===data.userId){
                toast.warning('This quiz will end in 10 seconds');
                setTimeout(() => {
                    navigate(`/result/${quizId}`);
                }, 10000);
            }
        })

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [quizId, score1, score2]);

    useEffect(() => {
        if (user1Finished && user2Finished) {
            navigate(`/result/${quizId}`);
        }
    }, [user1Finished, user2Finished, quizId]);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => {
                setTimer(timer - 0.01);
            }, 10);
            setTimeLeftPercentage((timer*100)/maxTime);
            return () => clearTimeout(countdown);
        } else {
            handleNextQuestion();
        }
    }, [timer]);

    const endQuiz= ()=>{
        // Set a timeout for 10 seconds
        setTimeout(() => {
            navigate(`/result/${quizId}`);
        }, 10000);
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questionIds.length - 1) {
            if(currentQuestionIndex===quiz.questionIds.length-2){
                let toSendUserId = quiz.players[0];
                if(user._id===quiz.players[0]){
                    toSendUserId = quiz.players[1];
                }

                const response = axios.post(`/api/quiz/end`,{
                    quizId,
                    userId: toSendUserId
                });

                toast.warning('This quiz will end in 10 seconds');

                endQuiz();
            }   
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (user._id === quiz.players[0]) {
                setUser1Finished(true);
            } else {
                setUser2Finished(true);
            }

            endQuiz();
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const updateScore1 = (newScore) => {
        setScore1(newScore);
        axios.post('/api/users/update-score', {
            quizId,
            userId: quiz.players[0],
            newScore
        });
    };

    const updateScore2 = (newScore) => {
        setScore2(newScore);
        axios.post('/api/users/update-score', {
            quizId,
            userId: quiz.players[1],
            newScore
        });
    };

    if(loading){
        return(
            <>
                Fetching quiz details...
            </>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        {user1.userName}
                    </div>
                    <div className={styles.score}>
                        {score1}
                    </div>
                </div>

                <div className={styles.questionInfo}>
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        {user2.userName}
                    </div>
                    <div className={styles.score}>
                        {score2}
                    </div>
                </div>
            </div>

            <div className={styles.questionPallete}>
                {quiz.questionIds.length > 0 && (
                    <QuestionPallete
                        questionId={quiz.questionIds[currentQuestionIndex]}
                        updateScore={quiz.players[0] === user._id ? updateScore1 : updateScore2}
                        currentScore={quiz.players[0] === user._id ? score1 : score2}
                        maxPoints = {maxPoints}
                    />
                )}
            </div>

            <button className={styles.nextButton} onClick={handleNextQuestion}>
                Next
            </button>
            <button className={styles.nextButton} onClick={handlePrevQuestion}>
                Prev
            </button>

            <div className={styles.timerContainer}>
                <div className={styles.timer}
                    style={{
                        width:  `${timeLeftPercentage}%`
                    }}
                >

                </div>
            </div>
      
        <ToastContainer />

        </div>
    );
};

export default QuizPage;
