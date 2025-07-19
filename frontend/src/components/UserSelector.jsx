import React, { useState } from 'react';

export default function UserSelector({ users, onSelect, onAddUser }) {
  const [newUser, setNewUser] = useState('');

  return (
    <div>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Select User --</option>
        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
      </select>
      <input
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
        placeholder="Add user name"
      />
      <button onClick={() => { onAddUser(newUser); setNewUser(''); }}>Add</button>
    </div>
  );
}
