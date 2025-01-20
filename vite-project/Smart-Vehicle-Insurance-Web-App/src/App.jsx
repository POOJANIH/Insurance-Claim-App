import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Customer Components
import Header from "./components/customer/header/Header";
import Welcome from "./components/customer/welcome/Welcome";
import Home from "./components/customer/home/Home";
import About from "./components/customer/about/About";
import Contact from "./components/customer/contact/Contact";
import Profile from "./components/customer/profile/Profile";
import Settings from "./components/customer/settings/Settings";

// Accident Report Components
import Accident from "./components/customer/accident/Accident";
import SectionOne from "./components/customer/accident/SectionOne";
import SectionTwo from "./components/customer/accident/SectionTwo";
import SectionThree from "./components/customer/accident/SectionThree";
import SectionFour from "./components/customer/accident/SectionFour";
import SectionFive from "./components/customer/accident/SectionFive";

// Claims Management Components
import ClaimForm from "./components//customer/claimForm/ClaimForm";
import Claims from "./components/customer/claims/Claims";
import Notifications from "./components/customer/notifications/Notifications";

// Garage Portal Components
import GarageLayout from "./components/garagePortals/GarageLayout";
import Dashboard from "./components/garagePortals/dashboard/Dashboard";
import GarageViewPhotos from "./components/garagePortals/GarageViewPhotos/GarageViewPhotos";
import SubmitEstimation from "./components/garagePortals/submitEstimation/SubmitEstimation";

// Insurance Company Components
import InsuranceLayout from "./components/insuranceCompanyPortal/InsuranceLayout";
import InsuranceDashboard from "./components/insuranceCompanyPortal/insuranceDashboard/InsuranceDashboard";
import InsuranceClaims from "./components/insuranceCompanyPortal/insuranceClaims/InsuranceClaims";
import InsuranceViewPhotos from "./components/insuranceCompanyPortal/insuranceViewPhotos/InsuranceViewPhotos";
import InsuranceClaimForms from "./components/insuranceCompanyPortal/insuranceClaimForms/InsuranceClaimForms";

function AppContent() {
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vehicles/")
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
    <div>
      {/* Conditionally render header based on path */}
      {location.pathname.startsWith("/garage") ||
      location.pathname.startsWith("/insurance") ? null : (
        <Header />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Customer Routes */}
        <Route path="/home" element={<Home vehicles={vehicles} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Accident Report Routes */}
        <Route path="/accident" element={<Accident />}>
          <Route index element={<SectionOne />} />
          <Route path="section-one" element={<SectionOne />} />
          <Route path="section-two" element={<SectionTwo />} />
          <Route path="section-three" element={<SectionThree />} />
          <Route path="section-four" element={<SectionFour />} />
          <Route path="section-five" element={<SectionFive />} />
        </Route>

        {/* Claims Management Routes */}
        <Route path="/claimForm" element={<ClaimForm />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Garage Portal Routes */}
        <Route path="/garage" element={<GarageLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="photos/:claimId?" element={<GarageViewPhotos />} />
          <Route path="estimation/:claimId?" element={<SubmitEstimation />} />
        </Route>

        {/* Insurance Company Routes */}
        <Route path="/insurance" element={<InsuranceLayout />}>
          <Route index element={<InsuranceDashboard />} />
          <Route path="dashboard" element={<InsuranceDashboard />} />
          <Route path="claims" element={<InsuranceClaims />} />
          <Route
            path="claims/:claimId/photos"
            element={<InsuranceViewPhotos />}
          />
          <Route path="claim-forms" element={<InsuranceClaimForms />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
