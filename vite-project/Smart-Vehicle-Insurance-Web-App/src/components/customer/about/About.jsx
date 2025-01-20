import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaShieldAlt,
  FaHandshake,
  FaClock,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import "./about.css";

const About = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Reliable Coverage",
      description: "Comprehensive insurance solutions tailored to your needs.",
    },
    {
      icon: <FaHandshake />,
      title: "Customer First",
      description: "Dedicated to providing exceptional customer service.",
    },
    {
      icon: <FaClock />,
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need it.",
    },
  ];

  const values = [
    "Integrity in all our dealings",
    "Transparency in claims processing",
    "Commitment to customer satisfaction",
    "Innovation in service delivery",
    "Excellence in customer support",
  ];

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-4 mb-3">About Us</h1>
          <p className="lead text-muted">
            Protecting what matters most with reliable insurance solutions
          </p>
        </Col>
      </Row>

      {/* Mission Statement */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto text-center">
          <Card className="mission-card">
            <Card.Body>
              <h3 className="mb-4">Our Mission</h3>
              <p>
                To provide peace of mind through reliable insurance solutions,
                exceptional customer service, and swift claim processing,
                ensuring our customers' assets are protected when they need it
                most.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Features */}
      <Row className="mb-5">
        {features.map((feature, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="feature-card h-100">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p className="text-muted">{feature.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Company Values */}
      <Row className="mb-5">
        <Col md={6}>
          <h3 className="mb-4">Our Values</h3>
          <div className="values-list">
            {values.map((value, index) => (
              <div key={index} className="value-item">
                <FaCheckCircle className="value-icon" />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-item">
                <h2>10K+</h2>
                <p>Satisfied Customers</p>
              </div>
              <div className="stats-item">
                <h2>95%</h2>
                <p>Claims Approved</p>
              </div>
              <div className="stats-item">
                <h2>24/7</h2>
                <p>Customer Support</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <Row>
        <Col className="text-center">
          <h3 className="mb-4">Our Team</h3>
          <Card className="team-card">
            <Card.Body>
              <FaUsers className="team-icon mb-3" />
              <p>
                Our dedicated team of insurance professionals is committed to
                providing you with the best service and support. With years of
                industry experience, we understand your needs and work
                tirelessly to exceed your expectations.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
