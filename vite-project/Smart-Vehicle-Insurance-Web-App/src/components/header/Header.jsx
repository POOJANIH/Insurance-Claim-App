import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import "./header.css";

const Header = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("#home");

  // Handler for changing tabs
  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  return (
    <header>
      {/* Top Navigation Bar */}
      <Navbar bg="light" expand="lg" className="top-nav">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            Insurance App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="top-navbar" />
          <Navbar.Collapse id="top-navbar" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/notifications" eventKey="#notifications">
                🔔 Notifications
              </Nav.Link>
              <Nav.Link href="#theme">Theme</Nav.Link>
              <Nav.Link href="#fontsize">Font Size</Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <Image
                    src="https://via.placeholder.com/30"
                    roundedCircle
                    className="user-icon"
                  />
                  Account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Bottom Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="bottom-nav">
        <Container>
          <Nav
            className="mx-auto"
            activeKey={activeTab}
            onSelect={handleSelect} // Handle tab selection
          >
            <Nav.Link as={Link} to="/home" eventKey="#home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/accident" eventKey="#accident">
              Report an Accident
            </Nav.Link>
            <Nav.Link as={Link} to="/claimForm" eventKey="#claimForm">
              Claim Form
            </Nav.Link>
            <Nav.Link as={Link} to="/claims" eventKey="#claims">
              Claims
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" eventKey="#contact">
              Contact
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
