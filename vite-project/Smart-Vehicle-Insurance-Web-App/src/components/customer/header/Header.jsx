import React from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  FaBell,
  FaUser,
  FaHome,
  FaFileContract,
  FaClipboardList,
  FaPhone,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <header>
      <Navbar bg="light" expand={false} className="top-nav">
        <Container fluid>
          {/* Hamburger Menu */}
          <Navbar.Toggle aria-controls="offcanvas-nav">
            <FaBars />
          </Navbar.Toggle>

          <Navbar.Brand as={Link} to="/" className="logo">
            Insurance Claims
          </Navbar.Brand>

          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Nav.Link
              as={Link}
              to="/notifications"
              className={activeTab === "/notifications" ? "active" : ""}
            >
              <FaBell className="notification-icon" />
            </Nav.Link>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-account"
                className="account-dropdown"
              >
                <FaUser /> John Doe
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          {/* Off-canvas Navigation */}
          <Navbar.Offcanvas
            id="offcanvas-nav"
            aria-labelledby="offcanvas-nav-label"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvas-nav-label">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/home"
                  className={activeTab === "/home" ? "active" : ""}
                >
                  <FaHome className="me-2" /> Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/accident"
                  state={{ step: 1 }}
                  className={activeTab === "/accident" ? "active" : ""}
                >
                  <FaClipboardList className="me-2" /> Report an Accident
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/claimForm"
                  className={activeTab === "/claimForm" ? "active" : ""}
                >
                  <FaFileContract className="me-2" /> Claim Form
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/claims"
                  className={activeTab === "/claims" ? "active" : ""}
                >
                  <FaClipboardList className="me-2" /> Claims
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={activeTab === "/contact" ? "active" : ""}
                >
                  <FaPhone className="me-2" /> Contact
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
