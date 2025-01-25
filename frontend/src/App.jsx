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
        <Route path="/" element={<Login />} />
        <Route path="/report-accident" element={<AccidentReportForm />} />
        <Route path="/submission-success" element={<SubmissionSuccess />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/garage/dashboard" element={<GarageDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/customer/case/:caseId/claim" element={<ClaimForm />} />
      </Routes>
    </Router>
  );
}

export default App;
