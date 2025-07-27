import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/search?query=${searchTerm}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/view-profile/${id}`);
  };

  return (
    <div className="search-container" style={{ padding: "20px", color: "white" }}>
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Enter username or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {results.map((user) => (
          <div
            key={user._id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              background: "#1c1c1c",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => handleViewProfile(user._id)}
          >
            <img
              src={user.profileImage}
              alt="profile"
              width="40"
              height="40"
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />
            <strong>{user.username}</strong> — {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
