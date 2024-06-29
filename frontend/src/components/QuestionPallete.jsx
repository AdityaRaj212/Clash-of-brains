import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionPallete.module.css';

const QuestionPallete = ({ questionId, updateScore, currentScore }) => {
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [answer, setAnswer] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isOptionLocked, setIsOptionLocked] = useState(false);
    const [feedback, setFeedback] = useState(null);

    currentScore = Number(currentScore);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const questionResponse = await axios.get(`/api/question/get-by-id/${questionId}`);
                setQuestion(questionResponse.data.question);
                setQuestionText(questionResponse.data.question.questionText);
                setOptions(questionResponse.data.question.option);
                setAnswer(questionResponse.data.question.answer);
                setSelectedOption(null);
                setIsOptionLocked(false);
                setFeedback(null);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, [questionId]);

    const handleOptionClick = (index) => {
        if (!isOptionLocked) {
            setSelectedOption(index);
            setIsOptionLocked(true);
            if (index === answer) {
                updateScore(currentScore+1);
                setFeedback('correct');
            } else {
                updateScore(currentScore);
                setFeedback('incorrect');
            }

            // Hide feedback after a delay
            setTimeout(() => {
                setFeedback(null);
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.questionText}>
                {questionText}
            </div>
            <div className={styles.optionsContainer}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`${styles.option} ${selectedOption === index ? styles.selected : ''}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option.text}
                    </div>
                ))}
            </div>
            {feedback && (
                <div className={`${styles.feedback} ${feedback === 'correct' ? styles.correct : styles.incorrect}`}>
                    {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                </div>
            )}
        </div>
    );
};

export default QuestionPallete;
