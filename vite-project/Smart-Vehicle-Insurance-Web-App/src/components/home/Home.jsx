import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./home.css";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  // Hardcoded vehicle data
  const vehicles = [
    {
      vehicleId: 1,
      name: "Vehicle 1",
      vehicleNumber: "ABC123",
      imageUrl: "https://via.placeholder.com/300x180",
    },
    {
      vehicleId: 2,
      name: "Vehicle 2",
      vehicleNumber: "DEF456",
      imageUrl: "https://via.placeholder.com/300x180",
    },
    {
      vehicleId: 3,
      name: "Vehicle 3",
      vehicleNumber: "GHI789",
      imageUrl: "https://via.placeholder.com/300x180",
    },
  ];

  // State for expanded card
  const [expandedCard, setExpandedCard] = useState(null);

  // Toggle the expanded state
  const handleCardToggle = (vehicleId) => {
    setExpandedCard(expandedCard === vehicleId ? null : vehicleId);
  };

  return (
    <div className="home-container">
      <h1>Vehicle Information</h1>
      <Row className="g-4">
        {vehicles.map((vehicle) => (
          <Col md={4} key={vehicle.vehicleId}>
            <Card>
              <Card.Img
                variant="top"
                src={vehicle.imageUrl}
                alt={vehicle.vehicleNumber}
              />
              <Card.Body>
                <Card.Title>{vehicle.name}</Card.Title>
                <Card.Text>Vehicle Number: {vehicle.vehicleNumber}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleCardToggle(vehicle.vehicleId)}
                >
                  {expandedCard === vehicle.vehicleId
                    ? "Hide Details"
                    : "View Details"}
                </Button>

                {expandedCard === vehicle.vehicleId && (
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
