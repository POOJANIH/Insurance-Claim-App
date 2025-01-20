import React from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Add logic for login authentication
    alert('Incorrect username or password. Please try again.');
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to Smart Insurance Claims</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Facing issues logging in?{' '}
        <Link to="/contact">Contact Insurance Company</Link>
      </p>
    </div>
  );
};

export default Welcome;
