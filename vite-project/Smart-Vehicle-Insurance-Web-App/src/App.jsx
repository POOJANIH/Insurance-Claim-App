import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Welcome from './components/welcome/Welcome';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Accident from './components/accident/Accident';
import SectionOne from './components/accident/SectionOne';
import SectionTwo from './components/accident/SectionTwo';
import SectionThree from './components/accident/SectionThree';
import SectionFour from './components/accident/SectionFour';
import SectionFive from './components/accident/SectionFive';
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
           <Route path="/section-one" element={<SectionOne />} />
           <Route path="/accident" element={<SectionTwo />} />
           <Route path="/accident" element={<SectionThree />} />
           <Route path="/accident" element={<SectionFour />} />
           <Route path="/accident" element={<SectionFive />} />
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
