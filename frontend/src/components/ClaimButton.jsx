import React from 'react';

export default function ClaimButton({ userId, onClaim }) {
  return (
    <button onClick={() => onClaim(userId)} disabled={!userId}>
      Claim Points
    </button>
  );
}
