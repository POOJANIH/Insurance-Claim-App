import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./insuranceLogin.css";

const InsuranceLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate login logic
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "insurance");
      navigate("/insurance/dashboard");
    } else {
      alert("Please enter username and password.");
    }
  };

  return (
    <div className="insurance-login">
      <h1>Insurance Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default InsuranceLogin;
