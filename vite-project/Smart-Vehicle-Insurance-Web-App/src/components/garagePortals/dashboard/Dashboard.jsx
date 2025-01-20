import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import "./dashboard.css";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/garage/search_claims/?search=${searchTerm}`
      );
      if (response.ok) {
        const data = await response.json();
        setClaims(data);
      }
    } catch (error) {
      console.error("Error searching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Search Claims</Card.Title>
          <Card.Subtitle className="mb-4 text-muted">
            Search by DL Number or License Plate
          </Card.Subtitle>

          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter search term"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {claims.length > 0 && (
        <Row className="mt-4">
          {claims.map((claim) => (
            <Col md={6} lg={4} key={claim.id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Claim #{claim.id}</Card.Title>
                  <Card.Text>
                    <strong>Vehicle:</strong> {claim.vehicle?.make}{" "}
                    {claim.vehicle?.model}
                    <br />
                    <strong>Damage:</strong> {claim.damage_severity}
                    <br />
                    <strong>Status:</strong> {claim.claim_status}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      href={`/garage/photos/${claim.id}`}
                    >
                      View Photos
                    </Button>
                    <Button
                      variant="outline-success"
                      href={`/garage/estimation/${claim.id}`}
                    >
                      Submit Estimation
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
