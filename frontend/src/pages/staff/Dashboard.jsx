import { Container, Card } from 'react-bootstrap';
import DashboardNav from '../../components/common/DashboardNav';

function StaffDashboard() {
  return (
    <div className="min-vh-100 bg-light">
      <DashboardNav userRole="Insurance Staff" />
      <Container className="py-4" style={{ marginTop: '80px' }}>
        <Card>
          <Card.Body>
            <h1>Hello! This is Insurance Staff Page</h1>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default StaffDashboard; 