import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./insuranceNavBar.css";

const InsuranceNavBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="insurance-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/insurance/dashboard">
          Insurance Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="insurance-nav" />
        <Navbar.Collapse id="insurance-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/insurance/dashboard"
              active={location.pathname === "/insurance/dashboard"}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/insurance/claims"
              active={location.pathname.includes("/insurance/claims")}
            >
              Claims
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/insurance/claim-forms"
              active={location.pathname.includes("/insurance/claim-forms")}
            >
              Claim Forms
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default InsuranceNavBar;
