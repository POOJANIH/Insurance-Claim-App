import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Welcome from './components/welcome/Welcome';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Accident from './components/accident/Accident';
import ClaimForm from './components/claimForm/ClaimForm';
import Notifications from './components/notifications/Notifications';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Simulate successful login
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Welcome Page Route */}
          {!isLoggedIn ? (
            <Route path="/" element={<Welcome />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          {/* Login Page Route */}
          {!isLoggedIn && (
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          )}
          {/* Home Page Route */}
          <Route path="/home" element={<Home />} />
          {/* Report Accident Page Route */}
          <Route path="/accident" element={<Accident />} />
          {/* Claim Form Page Route */}
          <Route path="/claimForm" element={<ClaimForm />} />
          {/* Real-time notifications Page Route */}
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
