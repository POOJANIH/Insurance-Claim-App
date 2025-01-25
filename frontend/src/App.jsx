import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login';
import AccidentReportForm from './pages/public/AccidentReport/AccidentReportForm';
import SubmissionSuccess from './pages/public/AccidentReport/SubmissionSuccess';
import AdminDashboard from './pages/admin/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';
import GarageDashboard from './pages/garage/Dashboard';
import StaffDashboard from './pages/staff/Dashboard';
import ClaimForm from './pages/customer/ClaimForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/report-accident" element={<AccidentReportForm />} />
        <Route path="/submission-success" element={<SubmissionSuccess />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/users/create" element={<AdminDashboard />} />
        <Route path="/admin/garages" element={<AdminDashboard />} />
        <Route path="/admin/cases" element={<AdminDashboard />} />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/claims" element={<CustomerDashboard />} />
        <Route path="/customer/vehicles" element={<CustomerDashboard />} />
        <Route path="/customer/case/:caseId/claim" element={<ClaimForm />} />
        
        {/* Garage Routes */}
        <Route path="/garage/dashboard" element={<GarageDashboard />} />
        <Route path="/garage/claims" element={<GarageDashboard />} />
        
        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
