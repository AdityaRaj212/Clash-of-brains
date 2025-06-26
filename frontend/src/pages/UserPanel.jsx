import React, { useContext, useEffect, useState } from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy, faPlayCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { GiBrain } from "react-icons/gi";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import LeaderboardTable from '../components/LeaderboardTable';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserPanel = () => {
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [usersForLeaderboard, setUsersForLeaderboard] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userId = user._id;
        const userResponse = await axios.get(`/api/users/get-user-by-id/${userId}`);
        const userData = userResponse.data.user;
        setGamesPlayed(userData.gamesPlayed);
        setGamesWon(userData.gamesWon);
        setTotalScore(userData.totalScore);
      }
    };
    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResponse = await axios.get('/api/users/leaderboard');
      setUsersForLeaderboard(usersResponse.data.users);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesResponse = await axios.get('/api/quiz/all-quizzes');
      setQuizzes(quizzesResponse.data.quizzes);
    };
    fetchQuizzes();
  }, []);

  const UserAvatar = ({ seed }) => (
    <div
      className="w-12 h-12 rounded-full overflow-hidden bg-white"
      dangerouslySetInnerHTML={{ __html: multiavatar(seed) }}
    />
  );

  const handleStartQuiz = () => {
    if (isAuthenticated) {
      navigate('/quiz-waiting-lobby');
    } else {
      toast.info('Login to start a quiz');
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const handleSwitchToAdmin = () => {
    navigate('/admin-panel');
  };

  // Chart Data
  const data = {
    labels: ['Games Played', 'Games Won'],
    datasets: [
      {
        label: 'Games',
        data: [gamesPlayed, gamesWon],
        backgroundColor: [
          'rgba(96, 165, 250, 0.6)',
          'rgba(251, 191, 36, 0.6)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        borderRadius: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  // Avatar helper
  const getAvatar = (id, name) =>
    `https://api.multiavatar.com/${id || name || 'guest'}.svg`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-rose-50 to-yellow-50 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <header className="w-full py-6 px-4 md:px-12 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-lg rounded-b-3xl">
        <div className="flex items-center gap-3">
          <GiBrain className="text-4xl text-blue-500 drop-shadow" />
          <span className="font-extrabold text-3xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent tracking-tight">
            Clash of Brains
          </span>
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar seed={user?._id} />
          <div className="text-right">
            <div className="font-semibold text-gray-700">{user?.userName || 'Guest'}</div>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-10">
        {/* Left: Stats + Quizzes */}
        <section className="flex-1 flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <FontAwesomeIcon icon={faUsers} className="text-blue-400 text-3xl mb-2 group-hover:text-blue-600 transition" />
              <div className="text-4xl font-bold text-blue-600">{gamesPlayed}</div>
              <div className="text-gray-500 font-medium mt-1">Games Played</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-3xl mb-2 group-hover:text-yellow-600 transition" />
              <div className="text-4xl font-bold text-yellow-600">{gamesWon}</div>
              <div className="text-gray-500 font-medium mt-1">Games Won</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform group">
              <GiBrain className="text-3xl text-pink-400 mb-2 group-hover:text-pink-600 transition" />
              <div className="text-4xl font-bold text-pink-600">{totalScore}</div>
              <div className="text-gray-500 font-medium mt-1">Total Score</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-800">Performance Overview</h2>
              <button
                onClick={handleStartQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-pink-400 text-white px-5 py-2 rounded-full shadow-md font-semibold text-base hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faPlayCircle} className="text-xl" />
                Start New Quiz
              </button>
            </div>
            <div className="h-56 md:h-72">
              <Bar data={data} options={options} />
            </div>
          </div>

          {/* Quizzes List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-800">Available Quizzes</h2>
              <button
                onClick={handleSwitchToAdmin}
                className="text-sm text-blue-500 hover:underline font-semibold"
              >
                Admin Panel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          </div>
        </section>

        {/* Right: Leaderboard */}
        <aside className="lg:w-[350px] w-full flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-2xl" />
              <h2 className="font-bold text-xl text-gray-800">Leaderboard</h2>
            </div>
            <LeaderboardTable users={usersForLeaderboard} />
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white/70 rounded-t-3xl mt-8">
        Made with <span className="text-pink-400">♥</span> for Knowledge Battles.
      </footer>
    </div>
  );
};

export default UserPanel;
