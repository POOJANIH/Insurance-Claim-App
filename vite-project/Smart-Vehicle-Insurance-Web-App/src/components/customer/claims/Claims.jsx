import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaCalendar,
  FaCar,
} from "react-icons/fa";
import axios from "axios";
import "./claims.css";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/claims/");
      setClaims(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch claims. Please try again later.");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: "warning", icon: FaClock },
      Approved: { color: "success", icon: FaCheckCircle },
      Rejected: { color: "danger", icon: FaTimesCircle },
    };

    const config = statusConfig[status] || {
      color: "secondary",
      icon: FaClipboardList,
    };
    const Icon = config.icon;

    return (
      <Badge bg={config.color} className="status-badge">
        <Icon className="me-1" /> {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading claims...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (claims.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info">
          No claims found. Start by submitting a new claim.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 d-flex align-items-center">
        <FaClipboardList className="me-2" />
        Claims Status
      </h2>

      <Row xs={1} md={2} lg={3} className="g-4">
        {claims.map((claim) => (
          <Col key={claim.id}>
            <Card className="claim-card h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Claim #{claim.id}</h6>
                {getStatusBadge(claim.claim_status)}
              </Card.Header>
              <Card.Body>
                <div className="claim-details">
                  <div className="detail-item">
                    <FaCar className="icon" />
                    <div>
                      <small className="text-muted">Vehicle</small>
                      <p>
                        {claim.vehicle?.make} {claim.vehicle?.model}
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaCalendar className="icon" />
                    <div>
                      <small className="text-muted">Claim Date</small>
                      <p>{new Date(claim.claim_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaMoneyBillWave className="icon" />
                    <div>
                      <small className="text-muted">Amount Requested</small>
                      <p>${claim.amount_requested.toLocaleString()}</p>
                    </div>
                  </div>

                  {claim.amount_approved && (
                    <div className="detail-item">
                      <FaCheckCircle className="icon" />
                      <div>
                        <small className="text-muted">Amount Approved</small>
                        <p>${claim.amount_approved.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {claim.notes && (
                  <div className="mt-3">
                    <small className="text-muted">Notes:</small>
                    <p className="notes-text mb-0">{claim.notes}</p>
                  </div>
                )}

                {claim.damage_severity && (
                  <Badge
                    bg={claim.damage_severity === "High" ? "danger" : "info"}
                    className="mt-2"
                  >
                    {claim.damage_severity} Damage
                  </Badge>
                )}
              </Card.Body>
              <Card.Footer className="text-muted">
                <small>
                  Last updated: {new Date(claim.last_updated).toLocaleString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Claims;
