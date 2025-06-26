import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const QuestionPallete = ({ questionId, updateScore, currentScore, maxPoints }) => {
  const { user } = useContext(AuthContext);

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

      try {
        await axios.put('/api/question/attempted-by', {
          userId: user._id,
          questionId
        });

        if (index === answer) {
          await axios.put('/api/question/solved-by', {
            userId: user._id,
            questionId
          });

          updateScore(currentScore + maxPoints);
          setFeedback('correct');
        } else {
          updateScore(currentScore);
          setFeedback('incorrect');
        }

        // Hide feedback after a delay
        setTimeout(() => {
          setFeedback(null);
        }, 2000);
      } catch (err) {
        console.error('Error while handling option click');
        throw err;
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-lg font-semibold mb-4 text-gray-800">
        {questionText}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 border border-gray-300 rounded-lg hover:bg-blue-50 transition
              ${selectedOption === index ? 'bg-blue-100 border-blue-500' : ''}
              ${isOptionLocked ? 'pointer-events-none opacity-70' : ''}
            `}
            onClick={() => handleOptionClick(index)}
          >
            {option.text}
          </div>
        ))}
      </div>
      {feedback && (
        <div className={`mt-4 p-3 rounded-lg text-center font-semibold
          ${feedback === 'correct'
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
};

export default QuestionPallete;
