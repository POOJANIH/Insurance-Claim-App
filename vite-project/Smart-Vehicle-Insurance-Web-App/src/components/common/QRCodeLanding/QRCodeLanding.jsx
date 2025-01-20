import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QRCodeLanding.css";

const QRCodeLanding = () => {
  const [inputType, setInputType] = useState("credentials"); // "credentials" or "vehicleNumber"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (inputType === "credentials") {
      // Simulate login with credentials
      if (username && password) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "customer");
        navigate("/home");
      } else {
        alert("Please enter username and password.");
      }
    } else if (inputType === "vehicleNumber") {
      // Simulate login with vehicle number
      if (vehicleNumber) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "customer");
        localStorage.setItem("reportAccident", "true"); // Flag to restrict navigation
        navigate("/accident");
      } else {
        alert("Please enter a vehicle number.");
      }
    }
  };

  return (
    <div className="qr-code-landing">
      <h1>Welcome!</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Login Using:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="credentials">Credentials</option>
            <option value="vehicleNumber">Vehicle Number</option>
          </select>
        </div>

        {inputType === "credentials" ? (
          <>
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
          </>
        ) : (
          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default QRCodeLanding;
