import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logout.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="logout-container">
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
