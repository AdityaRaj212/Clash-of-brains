import { useEffect, useState } from 'react';
import styles from './QuestionShowcase.module.css';
import axios from 'axios';
import QuestionChiplet from './QuestionChiplet';

const QuestionShowcase = () => {
    const [questions,setQuestions] = useState([]);

    useEffect(()=>{
        const fetchQuestions = async ()=>{
            const questionResponse = await axios.get('/api/question/all');
            setQuestions(questionResponse.data.questions);
            // console.log(questionResponse.data);
            // console.log(questionResponse.data.questions[0]._id);
        }
        fetchQuestions();
    },[]);

    return(
        <div className={styles.container}>
            {questions.map((question) => (
                <QuestionChiplet key={question._id} questionId={question._id} />
            ))}
        </div>
    )
};

export default QuestionShowcase;