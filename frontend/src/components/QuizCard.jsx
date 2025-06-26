import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBattleNet } from "react-icons/fa";
import multiavatar from '@multiavatar/multiavatar/esm';

const QuizCard = ({ quiz }) => {
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [creationDate, setCreationDate] = useState("");
  const [maxScore, setMaxScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (quiz.players && quiz.players.length >= 2) {
        const player1Id = quiz.players[0];
        const player2Id = quiz.players[1];
        const player1Response = await axios.get(`/api/users/get-user-by-id/${player1Id}`);
        const player2Response = await axios.get(`/api/users/get-user-by-id/${player2Id}`);
        setPlayer1(player1Response.data.user);
        setPlayer2(player2Response.data.user);
        setScore1(quiz.scores[0]);
        setScore2(quiz.scores[1]);
      }
      setCreationDate(quiz.createdAt);
      setMaxScore(quiz.totalScore);
      setHighestScore(quiz.highestScore);
    };
    fetchDetails();
  }, [quiz]);

  // Use local multiavatar for SVG avatars
  const renderAvatar = (seed) => (
    <span
      className="w-12 h-12 rounded-full bg-white shadow overflow-hidden border-2 border-blue-200"
      dangerouslySetInnerHTML={{ __html: multiavatar(seed || 'guest') }}
    />
  );

  return (
    <div
      className={`transition-all duration-300 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.025] p-6 mb-4 flex flex-col gap-4 border-2 ${
        isHovered ? 'border-blue-400' : 'border-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quiz Title and Icon */}
      <div className="flex items-center gap-3 mb-2">
        <FaBattleNet className="text-2xl text-blue-400 drop-shadow" />
        <span className="font-bold text-xl text-blue-700">{quiz.title || 'Quiz Battle'}</span>
      </div>
      {/* Players */}
      <div className="flex items-center gap-4">
        {renderAvatar(player1._id)}
        <span className="font-semibold text-gray-700">{player1.userName || 'Player 1'}</span>
        <span className="font-bold text-blue-400 text-lg">vs</span>
        {renderAvatar(player2._id)}
        <span className="font-semibold text-gray-700">{player2.userName || 'Player 2'}</span>
      </div>
      {/* Scores */}
      <div className="flex gap-6 mt-2">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Score</span>
          <span className="text-lg font-bold text-blue-600">{score1}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Score</span>
          <span className="text-lg font-bold text-pink-600">{score2}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Max</span>
          <span className="text-lg font-bold text-yellow-600">{maxScore}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">High</span>
          <span className="text-lg font-bold text-green-600">{highestScore}</span>
        </div>
      </div>
      {/* Quiz Description */}
      <div className="mt-2 text-gray-600 italic">{quiz.description}</div>
      {/* Date and CTA */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">
          {creationDate ? new Date(creationDate).toLocaleString() : ''}
        </span>
        <button className="bg-gradient-to-r from-blue-500 to-pink-400 text-white px-4 py-2 rounded-full shadow font-semibold hover:scale-105 transition-transform">
          Challenge Again
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
