import { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionChiplet from './QuestionChiplet';

const QuestionShowcase = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionResponse = await axios.get('/api/question/all');
        setQuestions(questionResponse.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        All Questions ({questions.length})
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionChiplet key={question._id} questionId={question._id} />
        ))}
      </div>
      
      {questions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No questions found</p>
          <p className="text-gray-400 mt-2">Create your first question to get started</p>
        </div>
      )}
    </div>
  );
};

export default QuestionShowcase;
