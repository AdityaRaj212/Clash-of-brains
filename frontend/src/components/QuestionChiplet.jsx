import { useEffect, useState } from 'react';
import styles from './QuestionChiplet.module.css';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faCheckDouble, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const QuestionChiplet = ({ questionId }) => {
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const questionResponse = await axios.get(`/api/question/get-by-id/${questionId}`);
                setQuestion(questionResponse.data.question);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };
        fetchQuestion();
    }, [questionId]);
    console.log(question);

    return (
        (
            (question) 
            
            && 
            <Link to={`/question-page/${questionId}`}>
                <div className={styles.container}>
                    <div className={styles.question}>
                        {question.questionText}
                    </div>
                    <div className={styles.info}>
                        <div className={styles.difficulty}>
                            <span className={styles.label}>Difficulty</span> <span>{question.difficulty} <FontAwesomeIcon icon={faStar} /></span>
                        </div>
                        <div className={styles.time}>
                            <span className={styles.label}><FontAwesomeIcon icon={faClock} /> Time</span> {question.time} sec
                        </div>
                        <div className={styles.attemptedBy}>
                            <span className={styles.label}><FontAwesomeIcon icon={faUsers} /> Attempted By</span> {question.attemptedBy.length}
                        </div>
                        <div className={styles.correctBy}>
                            <span className={styles.label}><FontAwesomeIcon icon={faCheckDouble} /> Correct By</span> {question.solvedBy.length}
                        </div>
                    </div>
                </div>
            </Link>
        )
    );
};

export default QuestionChiplet;
