import React from 'react';

export default function Leaderboard({ users }) {
  return (
    <table border="1">
      <thead>
        <tr><th>Rank</th><th>Name</th><th>Points</th></tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={user._id}>
            <td>{idx + 1}</td>
            <td>{user.name}</td>
            <td>{user.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
