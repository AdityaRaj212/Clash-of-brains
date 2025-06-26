import React from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';

const LeaderboardTable = ({ users = [] }) => {
  const UserAvatar = ({ seed }) => (
    <div
      className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border border-gray-300"
      dangerouslySetInnerHTML={{ __html: multiavatar(seed) }}
    />
  );

  // Sort users by totalScore in descending order
  const sortedUsers = [...users].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="overflow-x-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200">
      {sortedUsers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-6 italic">No users to display.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-300 to-indigo-400 text-white text-sm font-semibold">
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">User Profile</th>
              <th className="px-6 py-4 text-left">User Name</th>
              <th className="px-6 py-4 text-left">Games Played</th>
              <th className="px-6 py-4 text-left">Games Won</th>
              <th className="px-6 py-4 text-left">Total Score</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {sortedUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-indigo-100 cursor-pointer transition-colors duration-300`}
              >
                <td className="px-6 py-4 font-semibold text-indigo-700">{index + 1}</td>
                <td className="px-6 py-4">
                  <UserAvatar seed={user._id} />
                </td>
                <td className="px-6 py-4 font-medium text-indigo-800 hover:underline">
                  {user.userName}
                </td>
                <td className="px-6 py-4 text-center">{user.gamesPlayed}</td>
                <td className="px-6 py-4 text-center">{user.gamesWon}</td>
                <td className="px-6 py-4 font-bold text-indigo-900 text-right">
                  {user.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardTable;
