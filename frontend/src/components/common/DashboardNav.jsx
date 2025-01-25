import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth';
import logo from '../../assets/images/logo.png';

function DashboardNav({ userRole }) {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/', { replace: true });
  };

  const renderNavItems = () => {
    switch (userRole) {
      case 'Admin':
        return (
          <>
            <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
            <Nav.Link as={Link} to="/admin/garages">Garages</Nav.Link>
            <Nav.Link as={Link} to="/admin/cases">Cases</Nav.Link>
            <Button variant="success" size="sm" className="ms-2" onClick={() => navigate('/admin/users/create')}>
              Create User
            </Button>
          </>
        );
      case 'Customer':
        return (
          <>
            <Nav.Link as={Link} to="/customer/claims">Past Claims</Nav.Link>
            <Nav.Link as={Link} to="/customer/vehicles">Vehicles</Nav.Link>
            <Button variant="success" size="sm" className="ms-2" onClick={() => navigate('/report-accident')}>
              Report Accident
            </Button>
          </>
        );
      case 'Garage':
        return <Nav.Link as={Link} to="/garage/claims">Claims</Nav.Link>;
      default:
        return null;
    }
  };

  return (
    <div className="position-fixed w-100 top-0 start-0 shadow-sm" style={{ zIndex: 1000 }}>
      <Navbar bg="white" expand="lg" className="py-3">
        <Container fluid className="px-4">
          <Navbar.Brand className="fs-4 d-flex align-items-center">
            <img 
              src={logo} 
              alt="Techsure Insurance" 
              height="40" 
              className="me-3"
            />
            <div>
              <strong>Insurance Claim System</strong>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {renderNavItems()}
            </Nav>
            <div className="d-flex align-items-center">
              <span className="me-4 text-muted">Welcome, {user?.first_name || 'User'}</span>
              <Button variant="outline-danger" size="lg" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default DashboardNav; 