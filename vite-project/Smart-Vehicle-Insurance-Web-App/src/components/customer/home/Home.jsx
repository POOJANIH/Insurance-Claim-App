import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "./home.css";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vehicles/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        return response.json();
      })
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleCardToggle = (vehicleId) => {
    setExpandedCard(expandedCard === vehicleId ? null : vehicleId);
  };

  if (loading) {
    return (
      <div className="home-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return <div className="home-container">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Vehicle Information</h1>
      <Row className="g-4">
        {vehicles.map((vehicle) => (
          <Col md={4} key={vehicle.id}>
            <Card className="vehicle-card">
              {/* Default fallback image */}
              <Card.Img
                variant="top"
                src="/path/to/default-image.jpg"
                alt={`Image of ${vehicle.make} ${vehicle.model}`}
              />
              <Card.Body>
                <Card.Title>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </Card.Title>
                <Card.Text>License Plate: {vehicle.license_plate}</Card.Text>
                <Card.Text>Chassis Number: {vehicle.chassis_number}</Card.Text>
                <Card.Text>Engine Number: {vehicle.engine_number}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleCardToggle(vehicle.id)}
                >
                  {expandedCard === vehicle.id
                    ? "Hide Details"
                    : "View Details"}
                </Button>

                {expandedCard === vehicle.id && (
                  <div className="mt-3">
                    <Button
                      as={Link}
                      to="/accident"
                      variant="success"
                      className="me-2"
                    >
                      Report Accident
                    </Button>
                    <Button
                      as={Link}
                      to="/claimForm"
                      variant="info"
                      className="me-2"
                    >
                      Claim Form
                    </Button>
                    <Button as={Link} to="/claims" variant="warning">
                      Claim Status
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
