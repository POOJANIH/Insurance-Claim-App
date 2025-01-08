import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Welcome from "./components/welcome/Welcome";
import Home from "./components/home/Home";
import Accident from "./components/accident/Accident";
import SectionOne from "./components/accident/SectionOne";
import SectionTwo from "./components/accident/SectionTwo";
import SectionThree from "./components/accident/SectionThree";
import SectionFour from "./components/accident/SectionFour";
import SectionFive from "./components/accident/SectionFive";
import ClaimForm from "./components/claimForm/ClaimForm";
import Notifications from "./components/notifications/Notifications";

function App() {
  // State for vehicles
  const [vehicles, setVehicles] = useState([]);

  // Fetch vehicles when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vehicles/?format=api")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        return response.json();
      })
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
      });
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Welcome Page Route */}
          <Route path="/" element={<Welcome />} />

          {/* Home Page Route */}
          <Route path="/home" element={<Home vehicles={vehicles} />} />

          {/* Report Accident Page Route */}
          <Route path="/accident" element={<Accident />} />
          <Route path="/accident/section-one" element={<SectionOne />} />
          <Route path="/accident/section-two" element={<SectionTwo />} />
          <Route path="/accident/section-three" element={<SectionThree />} />
          <Route path="/accident/section-four" element={<SectionFour />} />
          <Route path="/accident/section-five" element={<SectionFive />} />

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
