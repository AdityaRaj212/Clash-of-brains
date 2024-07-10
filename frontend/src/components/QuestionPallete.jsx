import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './QuestionPallete.module.css';
import { AuthContext } from '../context/AuthContext';

const QuestionPallete = ({ questionId, updateScore, currentScore, maxPoints }) => {
    const {user} = useContext(AuthContext);

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

    const handleOptionClick = async (index) => {
        if (!isOptionLocked) {
            setSelectedOption(index);
            setIsOptionLocked(true);

            try{
                await axios.put('/api/question/attempted-by',{
                    userId: user._id,
                    questionId
                });
    
                if (index === answer) {
                    await axios.put('/api/question/solved-by',{
                        userId: user._id,
                        questionId
                    })
    
                    updateScore(currentScore+maxPoints);
                    setFeedback('correct');
                } else {
                    updateScore(currentScore);
                    setFeedback('incorrect');
                }
    
                // Hide feedback after a delay
                setTimeout(() => {
                    setFeedback(null);
                }, 2000);
            }catch(err){
                console.error('Error while handling option click');
                throw err;
            }
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
