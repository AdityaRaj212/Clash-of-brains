import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import styles from './ResultPage.module.css';

const ResultPage = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [winner, setWinner] = useState(null);
    const [isTie, setIsTie] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizResponse = await axios.get(`/api/quiz/get-by-id/${quizId}`);
                const fetchedQuiz = quizResponse.data.quiz;
                setQuiz(fetchedQuiz);

                if (fetchedQuiz.players && fetchedQuiz.players.length >= 2) {
                    const user1Response = await axios.get(`/api/users/get-user-by-id/${fetchedQuiz.players[0]}`);
                    const user2Response = await axios.get(`/api/users/get-user-by-id/${fetchedQuiz.players[1]}`);
                    const score1 = user1Response.data.user.currentScore;
                    const score2 = user2Response.data.user.currentScore;

                    if (score1 > score2) {
                        setWinner(user1Response.data.user.userName);
                    } else if (score2 > score1) {
                        setWinner(user2Response.data.user.userName);
                    } else {
                        setWinner(null);
                        setIsTie(true);
                    }

                    // await axios.post(`/api/users/update-score`,{
                    //     userId: fetchedQuiz.players[0],
                    //     quizId,
                    //     newScore: 0,
                    // });

                    // await axios.post(`/api/users/update-score`,{
                    //     userId: fetchedQuiz.players[1],
                    //     quizId,
                    //     newScore: 0,
                    // });

                    await axios.post('/api/quiz/attempted-by',{
                        userId: fetchedQuiz.players[0],
                        quizId,
                    });

                    await axios.post('/api/quiz/attempted-by',{
                        userId: fetchedQuiz.players[1],
                        quizId,
                    });
                }
            } catch (err) {
                console.error('Error fetching quiz:', err);
            }
        };

        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigate(`/user-panel`);
        }, 5000);

        return () => clearTimeout(timeoutId); 
    }, [navigate]);

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.resultContainer}>
            {winner && <Confetti />}
            <h1 className={styles.title}>Quiz Results</h1>
            <div className={styles.resultContent}>
                {isTie ? (
                    <h2 className={styles.winnerText}>It's a tie!</h2>
                ) : (
                    <h2 className={styles.winnerText}>Winner: {winner}</h2>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
