import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/auth';
import { TOAST_MESSAGES } from '../../constants';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await AuthService.login(email, password);
      
      // Redirect based on user role
      switch (data.user.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Customer':
          navigate('/customer/dashboard');
          break;
        case 'Garage':
          navigate('/garage/dashboard');
          break;
        case 'InsuranceStaff':
          navigate('/staff/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || TOAST_MESSAGES.LOGIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={12} className="mx-auto">
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Insurance Claim System</h2>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>

              <Alert variant="danger" className="d-flex align-items-center justify-content-between">
                <div>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Want to report an accident without registering?
                </div>
                <Link to="/report-accident">
                  <Button variant="danger">Report Accident</Button>
                </Link>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login; 