import React, { useEffect, useState } from "react";
import UserSelector from "./components/UserSelector";
import ClaimButton from "./components/ClaimButton";
import Leaderboard from "./components/Leaderboard";
import ClaimHistory from "./components/ClaimHistory";
import "./index.css";

const App = () => {
  const [topThreeUsers, setTopThreeUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchTopThree();
  }, []);

  useEffect(() => {
    fetchPaginatedUsers();
  }, [page]);

  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory]);

  const fetchTopThree = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      const sorted = data.users.sort((a, b) => b.totalPoints - a.totalPoints);
      setTopThreeUsers(sorted.slice(0, 3));
    } catch (error) {
      console.error("Error fetching top users:", error);
    }
  };

  const fetchPaginatedUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users?page=${page}`);
      const data = await res.json();

      const topThreeIds = new Set(topThreeUsers.map(user => user._id));
      const filteredUsers = (data.users || []).filter(
        user => !topThreeIds.has(user._id)
      );

      setPaginatedUsers(filteredUsers);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) return;
    await fetch(`http://localhost:5000/api/claim/${selectedUser}`, {
      method: "POST",
    });
    fetchTopThree();
    fetchPaginatedUsers();
    if (showHistory) fetchHistory();
  };

  return (
    <div className="app-container">
      <h1 className="title">Job Leaderboard</h1>
      <div className="main-content">
        <div className="left-panel">
          <UserSelector
            users={[...topThreeUsers, ...paginatedUsers]}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setUsers={() => {}}
            handleClaim={handleClaim}
            setPage={setPage}
          />
          <ClaimButton onClaim={handleClaim} />
        </div>

        <div className="center-panel">
          <Leaderboard
            topThree={topThreeUsers}
            users={paginatedUsers}
            page={page}
          />
          <div className="pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <div className="right-panel">
          <button
            onClick={() => setShowHistory(prev => !prev)}
            className="toggle-history-btn"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
          {showHistory && <ClaimHistory history={history} />}
        </div>
      </div>
    </div>
  );
};

export default App;
