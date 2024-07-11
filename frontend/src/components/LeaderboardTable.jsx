import React from 'react';
import styles from './LeaderboardTable.module.css';

const LeaderboardTable = ({ users }) => {
    // const getRandomAvatarUrl = (seed) => {
    //     return `https://api.multiavatar.com/${seed}.svg`;
    // };

    // const [userAvatar, setUserAvatar] = useState('');

    // useEffect(()=>{
    //     console.log(user._id);
    //     setUserAvatar(getRandomAvatarUrl(user._id));
    // },[users]);

  return (
    <div className={styles.leaderboardContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User Profile</th>
            <th>User Name</th>
            <th>Games Played</th>
            <th>Games Won</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <img 
                  src={`https://api.multiavatar.com/${user._id}.svg`} 
                  alt={`${user.userName} profile`} 
                  className={styles.profileImage}
                />
              </td>
              <td>{user.userName}</td>
              <td>{user.gamesPlayed}</td>
              <td>{user.gamesWon}</td>
              <td>{user.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
