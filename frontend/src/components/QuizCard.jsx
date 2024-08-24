import { useEffect, useState } from 'react';
import styles from './QuizCard.module.css';
import axios from 'axios';

import { FaBattleNet } from "react-icons/fa";

const QuizCard = ({quiz}) => {
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [player1Avatar, setPlayer1Avatar] = useState("");
    const [player2Avatar, setPlayer2Avatar] = useState("");
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [creationDate, setCreationDate] = useState("");
    const [maxScore, setMaxScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [isHovered, setIsHovered] = useState(false); // State to track hover

    const getRandomAvatarUrl = (seed) => {
        return `https://api.multiavatar.com/${seed}.svg`;
    };
    
    useEffect(() => {
        const fetchDetails = async () => {
            console.log(quiz);
            const player1Id = quiz.players[0];
            const player2Id = quiz.players[1];

            const player1Response = await axios.get(`/api/users/get-user-by-id/${player1Id}`);
            const player2Response = await axios.get(`/api/users/get-user-by-id/${player2Id}`);

            setPlayer1(player1Response.data.user);
            setPlayer2(player2Response.data.user);

            console.log(quiz, player2Id, player2Response.data.user);

            setPlayer1Avatar(getRandomAvatarUrl(player1Id));
            setPlayer2Avatar(getRandomAvatarUrl(player2Id));

            setScore1(quiz.scores[0]);
            setScore2(quiz.scores[1]);

            setCreationDate(quiz.createdAt);
            setMaxScore(quiz.totalScore);
            setHighestScore(quiz.highestScore);
        };

        fetchDetails();
    }, [quiz]);

    return (
        <div 
            className={styles.container}
            onMouseEnter={() => setIsHovered(true)}  // Handle mouse enter
            onMouseLeave={() => setIsHovered(false)} // Handle mouse leave
        >
            <div className={`${styles.quizCard} ${isHovered ? styles.quizCardHovered : ''}`}>
                <h3 className={styles.quizTitle}>Quiz ID: {quiz._id}</h3>
                <div className={styles.quizDetails}>
                    <div className={`${styles.playerCard} ${isHovered ? styles.fighting : ''}`}>
                        <div className={styles.profileImage}>
                            <img src={player1Avatar} alt="Player-1 Profile"/>
                        </div>
                        <div className={styles.userName}>
                            <strong>{player1.userName}</strong>
                        </div>
                        <div className={styles.score}>
                            <strong>Score:</strong> {score1}
                        </div>
                    </div>

                    <FaBattleNet className={styles.battleIcon} />

                    <div className={`${styles.playerCard} ${isHovered ? styles.fighting : ''}`}>
                        <div className={styles.profileImage}>
                            <img src={player2Avatar} alt="Player-2 Profile"/>
                        </div>
                        <div className={styles.userName}>
                            <strong>{player2.userName}</strong>
                        </div>
                        <div className={styles.score}>
                            <strong>Score:</strong> {score2}
                        </div>
                    </div>

                    <div className={styles.quizInfoCard}>
                        <p><strong>Players:</strong> {player1.userName} vs {player2.userName}</p>
                        <p><strong>Total Score:</strong> {maxScore}</p>
                        <p><strong>Highest Score:</strong> {highestScore}</p>
                        <p><strong>Date:</strong> {new Date(creationDate).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;
