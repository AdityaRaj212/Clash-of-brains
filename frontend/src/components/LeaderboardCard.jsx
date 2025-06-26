import React from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';

const LeaderboardCard = ({ user, rank }) => {
  // Generate avatar SVG using multiavatar
  const avatarSvg = multiavatar(user._id || user.userName || 'guest');
  
  // Rank-based styling
  const rankColors = {
    1: 'bg-gradient-to-r from-yellow-400 to-yellow-200 border-yellow-500',
    2: 'bg-gradient-to-r from-gray-300 to-gray-100 border-gray-400',
    3: 'bg-gradient-to-r from-amber-700 to-amber-500 border-amber-800',
    default: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
  };

  const rankStyle = rankColors[rank] || rankColors.default;

  return (
    <div className={`flex items-center rounded-2xl p-4 mb-3 shadow-md hover:shadow-xl transition-all border ${rankStyle}`}>
      <div className="flex-shrink-0">
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg"
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
          />
          {rank <= 3 && (
            <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              <span className="font-bold text-lg">{rank}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-lg font-bold text-gray-800 truncate">{user.userName}</h3>
          <span className="text-lg font-bold text-blue-600">{user.totalScore} pts</span>
        </div>
        
        <div className="flex mt-2 space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Played</span>
            <span className="font-semibold">{user.gamesPlayed}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Won</span>
            <span className="font-semibold">{user.gamesWon}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Win Rate</span>
            <span className="font-semibold">
              {user.gamesPlayed > 0 
                ? `${Math.round((user.gamesWon / user.gamesPlayed) * 100)}%` 
                : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
