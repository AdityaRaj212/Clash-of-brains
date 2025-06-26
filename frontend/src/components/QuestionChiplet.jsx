import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faCheckDouble, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

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

  if (!question) {
    return (
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 animate-pulse h-40" />
    );
  }

  return (
    <Link to={`/question-page/${questionId}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:scale-[1.025] transition-all border border-gray-100 group-hover:border-blue-400 flex flex-col gap-4 h-full">
        <div className="font-semibold text-lg text-gray-800 line-clamp-2">{question.questionText}</div>
        <div className="flex flex-wrap gap-2 text-sm mt-2">
          <span className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 ${difficultyColors[question.difficulty] || "bg-gray-100 text-gray-700"}`}>
            {question.difficulty}
            <FontAwesomeIcon icon={faStar} className="ml-1" />
          </span>
          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} /> {question.time}s
          </span>
          <span className="px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faUsers} /> {question.attemptedBy.length}
          </span>
          <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 flex items-center gap-1">
            <FontAwesomeIcon icon={faCheckDouble} /> {question.solvedBy.length}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default QuestionChiplet;
