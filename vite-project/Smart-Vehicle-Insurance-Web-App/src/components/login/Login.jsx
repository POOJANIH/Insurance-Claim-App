import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate login logic (replace with actual API call)
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role); // Save the selected role

      // Redirect based on role
      if (role === "customer") {
        navigate("/home");
      } else if (role === "garage") {
        navigate("/garage/dashboard");
      } else if (role === "insurance") {
        navigate("/insurance/dashboard");
      }
    } else {
      alert("Please enter username and password.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="garage">Garage</option>
            <option value="insurance">Insurance Company</option>
          </select>
        </div>

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

export default Login;
