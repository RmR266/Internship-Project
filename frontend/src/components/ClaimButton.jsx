import React from "react";
import "../css/ClaimButton.css";

const ClaimButton = ({ onClaim }) => {
  return (
    <div className="claim-button-container">
      <button onClick={onClaim}>Claim Points</button>
    </div>
  );
};

export default ClaimButton;
