import React, { useState, useEffect, useRef } from "react";
import "../css/UserSelector.css";

const UserSelector = ({
  users,
  selectedUser,
  setSelectedUser,
  setUsers,
  handleClaim,
  setPage, // <-- new prop to optionally reset page
}) => {
  const [newUser, setNewUser] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === selectRef.current && e.key === "Enter") {
        e.preventDefault();
        if (selectedUser) {
          handleClaim();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUser, handleClaim]);

  const handleAddUser = async () => {
    const trimmedName = newUser.trim();
    if (!trimmedName) {
      alert("User name cannot be empty.");
      return;
    }

    const nameExists = users.some(
      (user) => user.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameExists) {
      alert("User with this name already exists.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create user.");
        return;
      }

      // Refresh page 1 user list
      const updatedRes = await fetch("http://localhost:5000/api/users?page=1");
      const data = await updatedRes.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
      if (setPage) setPage(1); // Reset to page 1 if provided
      setNewUser("");
    } catch (err) {
      alert("Something went wrong. Try again later.");
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    handleAddUser();
  };

  return (
    <div className="user-selector-wrapper">
      {/* Claim Points Section */}
      <form className="claim-section" onSubmit={(e) => e.preventDefault()}>
        <h3>Claim Points</h3>
        <select
          ref={selectRef}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          className="claim-btn"
          onClick={handleClaim}
          disabled={!selectedUser}
          type="button"
          title={!selectedUser ? "Select a user first" : ""}
        >
          Claim Points
        </button>
      </form>

      {/* Add New User Section */}
      <form className="add-user-section" onSubmit={handleAddUserSubmit}>
        <h3>Add New User</h3>
        <div className="add-user">
          <input
            type="text"
            value={newUser}
            placeholder="Enter new user name"
            onChange={(e) => setNewUser(e.target.value)}
            autoFocus
          />
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default UserSelector;
