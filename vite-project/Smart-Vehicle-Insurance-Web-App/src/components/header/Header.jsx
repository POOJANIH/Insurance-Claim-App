import React from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  FaBell,
  FaUser,
  FaHome,
  FaFileContract,
  FaClipboardList,
  FaPhone,
} from "react-icons/fa"; // Import icons
import "./header.css";

const Header = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  return (
    <header>
      <Navbar bg="light" className="top-nav">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            <Image
              src="https://via.placeholder.com/40"
              onError={(e) => (e.target.src = "/default-logo.png")}
              alt="Logo"
              className="logo-img"
            />
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/notifications"
              className={activeTab === "/notifications" ? "active" : ""}
            >
              <FaBell className="notification-icon" />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Navbar bg="dark" variant="dark" expand={false} className="offcanvas-nav">
        <Container fluid>
          <Navbar.Toggle aria-controls="offcanvas-navbar" />
          <Navbar.Offcanvas
            id="offcanvas-navbar"
            aria-labelledby="offcanvas-navbar-label"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvas-navbar-label">
                Navigation
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/home"
                  className={activeTab === "/home" ? "active" : ""}
                >
                  <FaHome /> Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/accident"
                  state={{ step: 1 }}
                  className={activeTab === "/accident" ? "active" : ""}
                >
                  <FaClipboardList /> Report an Accident
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/claimForm"
                  className={activeTab === "/claimForm" ? "active" : ""}
                >
                  <FaFileContract /> Claim Form
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/claims"
                  className={activeTab === "/claims" ? "active" : ""}
                >
                  <FaClipboardList /> Claims
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={activeTab === "/contact" ? "active" : ""}
                >
                  <FaPhone /> Contact
                </Nav.Link>
                <Nav.Link
                  href="#theme"
                  className={activeTab === "#theme" ? "active" : ""}
                >
                  Theme
                </Nav.Link>
                <Nav.Link
                  href="#fontsize"
                  className={activeTab === "#fontsize" ? "active" : ""}
                >
                  Font Size
                </Nav.Link>
                <Dropdown align="end" className="mt-3">
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    <FaUser /> Account
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#logout">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
