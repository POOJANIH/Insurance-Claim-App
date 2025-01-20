import React, { useState, useEffect } from "react";
import { Container, Card, Table, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./InsuranceClaims.css";

const InsuranceClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch("/api/insurance/claims/");
        if (response.ok) {
          const data = await response.json();
          setClaims(data);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleClaimStatus = async (claimId, status) => {
    try {
      const response = await fetch(`/api/insurance/claims/${claimId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updatedClaims = claims.map((claim) =>
          claim.id === claimId ? { ...claim, status } : claim
        );
        setClaims(updatedClaims);
      }
    } catch (error) {
      console.error("Error updating claim status:", error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Claims</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Customer</th>
                <th>Damage Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.customer}</td>
                  <td>{claim.damage_severity}</td>
                  <td>{claim.status}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleClaimStatus(claim.id, "Accepted")}
                    >
                      Accept
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleClaimStatus(claim.id, "Rejected")}
                    >
                      Reject
                    </Button>{" "}
                    <Button
                      variant="primary"
                      size="sm"
                      as={Link}
                      to={`/insurance/claims/${claim.id}/photos`}
                    >
                      View Photos
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InsuranceClaims;
