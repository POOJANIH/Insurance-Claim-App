import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';

function SubmissionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const caseData = location.state?.caseData;

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={11} lg={11} xl={10} xxl={10} className="mx-3">
          <Card className="text-center shadow">
            <Card.Body className="p-5">
              <BsCheckCircleFill className="text-success mb-4" size={64} />
              <h2 className="mb-4">Submission Successful!</h2>
              
              <div className="mb-4">
                <p className="mb-2">Your accident report has been successfully submitted.</p>
                
                <div className="bg-light p-4 rounded mb-4">
                  <h5 className="text-muted mb-2">Your Case Reference</h5>
                  <h3 className="text-primary mb-0">{caseData?.case_name || 'N/A'}</h3>
                </div>
                
                <div className="border-start border-4 border-info p-4 bg-light text-start mb-4">
                  <h5 className="text-info mb-3">Next Steps</h5>
                  <p className="mb-2">Your report has been stored in our system. To proceed with this case:</p>
                  <ol className="mb-0">
                    <li>Login to your account using your credentials</li>
                    <li>Navigate to the Cases section</li>
                    <li>Use your case reference to track the progress</li>
                  </ol>
                </div>
                
                <p className="text-muted">
                  Please save this reference number for future correspondence.
                </p>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleBackToHome}
                className="px-5"
              >
                Back to Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SubmissionSuccess; 