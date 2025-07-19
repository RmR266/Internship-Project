import React, { useEffect, useState } from 'react';
import UserSelector from './components/UserSelector';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import ClaimHistory from './components/ClaimHistory';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [history, setHistory] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchHistory = async () => {
    const res = await fetch('http://localhost:5000/api/history');
    const data = await res.json();
    setHistory(data);
  };

  const handleClaim = async (userId) => {
    await fetch(`http://localhost:5000/api/claim/${userId}`, { method: 'POST' });
    fetchUsers();
    fetchHistory();
  };

  const handleAddUser = async (name) => {
    await fetch(`http://localhost:5000/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Leaderboard App</h1>
      <UserSelector users={users} onSelect={setSelectedUser} onAddUser={handleAddUser} />
      <ClaimButton userId={selectedUser} onClaim={handleClaim} />
      <Leaderboard users={users} />
      <ClaimHistory history={history} />
    </div>
  );
}

export default App;
