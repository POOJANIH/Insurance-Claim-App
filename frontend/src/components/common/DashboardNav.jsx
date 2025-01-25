import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth';
import logo from '../../assets/images/logo.png';

function DashboardNav({ userRole }) {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="position-fixed w-100 top-0 start-0 shadow-sm" style={{ zIndex: 1000 }}>
      <Navbar bg="white" expand="lg" className="py-3">
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <Navbar.Brand className="fs-4 d-flex align-items-center">
              <img 
                src={logo} 
                alt="Techsure Insurance" 
                height="40" 
                className="me-3"
              />
              <div>
                <strong>Insurance Claim System</strong>
                <span className="ms-2 text-muted">| {userRole}</span>
              </div>
            </Navbar.Brand>
            <div className="d-flex align-items-center">
              <span className="me-4 text-muted">Welcome, {user?.first_name || 'User'}</span>
              <Button variant="outline-danger" size="lg" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default DashboardNav; 