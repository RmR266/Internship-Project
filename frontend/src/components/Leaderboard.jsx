import React from "react";
import "../css/Leaderboard.css";

const Leaderboard = ({ topThree, users, page }) => {
  if (!Array.isArray(users) || !users.length) return null;

  // To prevent errors if no podium data
  const maxPoints = Math.max(
    ...(topThree.map(u => u.totalPoints)),
    ...(users.map(u => u.totalPoints)),
    1
  );

  const profileImages = [
    "/assets/gold-medal.jpg",
    "/assets/silver-medal.jpg",
    "/assets/bronze-medal.jpg",
  ];

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>

      {/* Podium Section */}
      <div className="podium">
        {topThree.map((user, index) => (
          <div className={`podium-slot slot-${index}`} key={user._id}>
            <img
              className="profile-img"
              src={profileImages[index]}
              alt={`Top ${index + 1}`}
            />
            <h3>{user.name}</h3>
            <div className="points">{user.totalPoints} points</div>
            <div className="medal-icon">{["🥇", "🥈", "🥉"][index]}</div>
          </div>
        ))}
      </div>

      {/* Ranked Users (Below Podium) */}
      <div className="ranked-list">
        {users.map((user, idx) => (
          <div className="rank-card" key={user._id}>
            {/* Corrected rank number: podium = top 3, so start from rank 4 */}
            <div className="rank-number">{(page - 1) * 15 + idx + 4}</div>
            <div className="avatar small">{user.name[0]}</div>
            <div className="rank-info">
              <div className="rank-name">{user.name}</div>
              <div className="rank-bar">
                <div
                  className="progress"
                  style={{
                    width: `${(user.totalPoints / maxPoints) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="rank-points">{user.totalPoints} points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
