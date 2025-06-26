import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import QuestionPallete from '../components/QuestionPallete';
import { useParams, useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState({ questionIds: [], players: [], scores: [] });
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
  const [hasEnded, setHasEnded] = useState(false);

  // Fetch quiz and user info
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizResponse = await axios.get(`/api/quiz/get-by-id/${quizId}`);
        const fetchedQuiz = quizResponse.data.quiz;
        setQuiz(fetchedQuiz);

        if (fetchedQuiz.players && fetchedQuiz.players.length >= 2) {
          // Reset scores for both users
          await axios.post(`/api/users/update-score`, { userId: fetchedQuiz.players[0], quizId, newScore: 0 });
          await axios.post(`/api/users/update-score`, { userId: fetchedQuiz.players[1], quizId, newScore: 0 });

          const user1Id = fetchedQuiz.players[0];
          const user2Id = fetchedQuiz.players[1];
          const user1Response = await axios.get(`/api/users/get-user-by-id/${user1Id}`);
          const user2Response = await axios.get(`/api/users/get-user-by-id/${user2Id}`);
          setUser1(user1Response.data.user);
          setUser2(user2Response.data.user);
          setScore1(user1Response.data.user.currentScore);
          setScore2(user2Response.data.user.currentScore);
        } else {
          toast.error('Not enough players in the quiz');
        }
      } catch (err) {
        toast.error('Error fetching quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Fetch question details when question changes
  useEffect(() => {
    if (currentQuestionIndex < quiz.questionIds.length) {
      const questionId = quiz.questionIds[currentQuestionIndex];
      const fetchQuestion = async () => {
        const questionResponse = await axios.get(`/api/question/get-by-id/${questionId}`);
        const question = questionResponse.data.question;
        setMaxPoints(question.points);
        setMaxTime(question.time);
        setTimer(question.time);
        setTimeLeftPercentage(100);
      };
      fetchQuestion();
    }
  }, [currentQuestionIndex, quiz.questionIds]);

  // Real-time updates with Pusher
  useEffect(() => {
    const pusher = new Pusher("cee81b1a4f2e2de34ad5", { cluster: "ap2" });
    const channel = pusher.subscribe(`quiz-${quizId}`);
    channel.bind('score-updated', data => {
      if (data.userId === quiz.players[0]) setScore1(data.newScore);
      else if (data.userId === quiz.players[1]) setScore2(data.newScore);
    });
    channel.bind('end-quiz', data => {
      if (!hasEnded) {
        setHasEnded(true);
        if (user._id === data.userId) endQuiz();
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [quizId, score1, score2, hasEnded, quiz.players, user]);

  // Navigate to result page when both finish
  useEffect(() => {
    if (user1Finished && user2Finished) navigate(`/result/${quizId}`);
  }, [user1Finished, user2Finished, quizId, navigate]);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 0.01);
      }, 10);
      setTimeLeftPercentage((timer * 100) / maxTime);
      return () => clearTimeout(countdown);
    } else {
      handleNextQuestion();
    }
  }, [timer, maxTime]);

  // End quiz logic
  const endQuiz = async () => {
    toast.warning('This quiz will end in 10 seconds');
    await axios.post('/api/quiz/warn', { quizId, userId: (user._id === user1._id) ? user2._id : user1._id });
    setTimeout(async () => {
      await axios.post('/api/quiz/update-score', { quizId, userId: user._id, score: (user._id === user1._id) ? score1 : score2 });
      await axios.post('/api/quiz/end', { quizId, userId: (user._id === user1._id) ? user2._id : user1._id });
      navigate(`/result/${quizId}`);
    }, 10000);
  };

  // Navigation logic
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questionIds.length - 1) {
      if (currentQuestionIndex === quiz.questionIds.length - 2) {
        endQuiz();
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (user._id === quiz.players[0]) setUser1Finished(true);
      else setUser2Finished(true);
      endQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  // Score update handlers
  const updateScore1 = (newScore) => {
    setScore1(newScore);
    axios.post('/api/users/update-score', { quizId, userId: quiz.players[0], newScore });
  };
  const updateScore2 = (newScore) => {
    setScore2(newScore);
    axios.post('/api/users/update-score', { quizId, userId: quiz.players[1], newScore });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
        <span className="text-xl text-blue-500 animate-pulse">Fetching quiz details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-4 flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header: Players and Scores */}
      <div className="w-full max-w-3xl flex items-center justify-between bg-white/80 rounded-xl shadow-lg px-6 py-4 mt-6 mb-8">
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-600">{user1.userName}</span>
          <span className="text-2xl font-extrabold text-blue-500">{score1}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-pink-600">{user2.userName}</span>
          <span className="text-2xl font-extrabold text-pink-500">{score2}</span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full max-w-2xl mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-400 to-pink-400 h-4 rounded-full transition-all"
            style={{ width: `${timeLeftPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Time Left</span>
          <span>{timer.toFixed(1)}s</span>
        </div>
      </div>

      {/* Question Palette */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 mb-6">
        {quiz.questionIds.length > 0 && (
          <QuestionPallete
            questionId={quiz.questionIds[currentQuestionIndex]}
            updateScore={user._id === quiz.players[0] ? updateScore1 : updateScore2}
            currentScore={user._id === quiz.players[0] ? score1 : score2}
            maxPoints={maxPoints}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-2xl flex justify-between gap-4">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-lg font-semibold shadow transition-all ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextQuestion}
          className="px-6 py-3 rounded-lg font-semibold bg-pink-500 text-white shadow hover:bg-pink-600 transition-all"
        >
          {currentQuestionIndex < quiz.questionIds.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
