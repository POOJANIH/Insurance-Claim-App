import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCar } from "react-icons/fa";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    nic: "",
    dl_number: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/profile/");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="profile-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Profile Information</h3>
              <Button
                variant={isEditing ? "secondary" : "primary"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Card.Header>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">Profile updated successfully!</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="profile-section">
                  <div className="profile-icon">
                    <FaUser />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>

                <div className="profile-section">
                  <div className="profile-icon">
                    <FaEnvelope />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>

                <div className="profile-section">
                  <div className="profile-icon">
                    <FaPhone />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>

                <div className="profile-section">
                  <div className="profile-icon">
                    <FaIdCard />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>NIC Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="nic"
                      value={profile.nic}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>

                <div className="profile-section">
                  <div className="profile-icon">
                    <FaCar />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Driver's License Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="dl_number"
                      value={profile.dl_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>

                {isEditing && (
                  <div className="text-center mt-4">
                    <Button type="submit" variant="success" size="lg">
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
