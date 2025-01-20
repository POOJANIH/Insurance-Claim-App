import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./garageNavBar.css";

const GarageNavBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="garage-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/garage/dashboard">
          Garage Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="garage-nav" />
        <Navbar.Collapse id="garage-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/garage/dashboard"
              active={location.pathname === "/garage/dashboard"}
            >
              Search Claims
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/garage/photos"
              active={location.pathname.includes("/garage/photos")}
            >
              View Photos
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/garage/estimation"
              active={location.pathname.includes("/garage/estimation")}
            >
              Submit Estimation
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default GarageNavBar;
