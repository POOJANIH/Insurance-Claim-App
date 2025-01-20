import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">Contact Us</h1>
          <p className="text-center text-muted">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </Col>
      </Row>

      <Row className="mb-5 justify-content-center">
        <Col md={4}>
          <Card className="contact-card">
            <Card.Body>
              <div className="text-center">
                <FaPhone className="contact-icon" />
                <h5>Call Us</h5>
                <p className="mb-0">+1 234 567 8900</p>
                <small className="text-muted">Monday to Friday 9am-5pm</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="contact-card">
            <Card.Body>
              <div className="text-center">
                <FaEnvelope className="contact-icon" />
                <h5>Email Us</h5>
                <p className="mb-0">support@insurance.com</p>
                <small className="text-muted">
                  We'll respond within 24 hours
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="contact-card">
            <Card.Body>
              <div className="text-center">
                <FaMapMarkerAlt className="contact-icon" />
                <h5>Visit Us</h5>
                <p className="mb-0">123 Insurance Street</p>
                <small className="text-muted">New York, NY 10001</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="form-card">
            <Card.Body>
              <h3 className="text-center mb-4">Send us a Message</h3>

              {status === "success" && (
                <Alert variant="success">
                  Thank you for your message. We'll get back to you soon!
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="danger">
                  Sorry, there was an error sending your message. Please try
                  again.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="px-5"
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
