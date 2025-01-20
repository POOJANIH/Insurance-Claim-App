import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import "./InsuranceDashboard.css";

const InsuranceDashboard = () => {
  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Insurance Dashboard</Card.Title>
          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Claims</Card.Title>
                  <Card.Text>100</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Pending Claims</Card.Title>
                  <Card.Text>30</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Resolved Claims</Card.Title>
                  <Card.Text>70</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InsuranceDashboard;
