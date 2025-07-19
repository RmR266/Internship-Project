import React from "react";
import "../css/ClaimHistory.css";

const ClaimHistory = ({ history }) => {
  return (
    <div className="history-container">
      <h3>Claim History</h3>
      <ul>
        {history.map((entry) => (
          <li key={entry._id}>
            {entry.userId?.name} claimed {entry.points} points on{" "}
            {new Date(entry.claimedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClaimHistory;
