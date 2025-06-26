import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';

const ResultPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [user1, setUser1] = useState({});
  const [user2, setUser2] = useState({});
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizResponse = await axios.get(`/api/quiz/get-by-id/${quizId}`);
        const fetchedQuiz = quizResponse.data.quiz;
        setQuiz(fetchedQuiz);

        if (fetchedQuiz.players && fetchedQuiz.players.length >= 2) {
          const user1Response = await axios.get(`/api/users/get-user-by-id/${fetchedQuiz.players[0]}`);
          const user2Response = await axios.get(`/api/users/get-user-by-id/${fetchedQuiz.players[1]}`);

          setUser1(user1Response.data.user);
          setUser2(user2Response.data.user);

          const s1 = user1Response.data.user.currentScore;
          const s2 = user2Response.data.user.currentScore;
          setScore1(s1);
          setScore2(s2);

          if (s1 > s2) {
            setWinner(user1Response.data.user.userName);
          } else if (s2 > s1) {
            setWinner(user2Response.data.user.userName);
          } else {
            setWinner(null);
            setIsTie(true);
          }

          await axios.post('/api/quiz/attempted-by', {
            userId: fetchedQuiz.players[0],
            quizId,
          });

          await axios.post('/api/quiz/attempted-by', {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
        <span className="text-lg text-blue-500 animate-pulse">Loading results...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 px-4">
      {winner && <Confetti />}
      <div className="bg-white/80 rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6 max-w-lg w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight mb-2">Quiz Results</h1>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-700">{user1.userName}</span>
              <span className="text-2xl font-bold text-blue-500">{score1}</span>
            </div>
            <span className="text-3xl font-black text-gray-400">vs</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-pink-700">{user2.userName}</span>
              <span className="text-2xl font-bold text-pink-500">{score2}</span>
            </div>
          </div>
          <div className="mt-6">
            {isTie ? (
              <h2 className="text-2xl font-bold text-yellow-500 animate-pulse">It's a tie! 🤝</h2>
            ) : (
              <h2 className="text-2xl font-bold text-green-600 animate-bounce">
                Winner: <span className="text-pink-500">{winner}</span> 🎉
              </h2>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Redirecting to dashboard in 5 seconds...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
