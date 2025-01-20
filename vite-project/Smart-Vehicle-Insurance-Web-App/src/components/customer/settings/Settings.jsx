import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import {
  FaLock,
  FaBell,
  FaLanguage,
  FaPalette,
  FaToggleOn,
} from "react-icons/fa";
import "./settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: "light",
    language: "english",
    fontSize: "medium",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [alert, setAlert] = useState(null);

  const handleNotificationChange = (type) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setAlert({ type: "danger", message: "New passwords do not match" });
      return;
    }

    try {
      // API call to change password
      setAlert({ type: "success", message: "Password updated successfully" });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      setAlert({ type: "danger", message: "Failed to update password" });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {alert && (
            <Alert
              variant={alert.type}
              onClose={() => setAlert(null)}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          {/* Password Settings */}
          <Card className="settings-card mb-4">
            <Card.Header>
              <h4 className="mb-0">
                <FaLock className="me-2" /> Password Settings
              </h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Notification Settings */}
          <Card className="settings-card mb-4">
            <Card.Header>
              <h4 className="mb-0">
                <FaBell className="me-2" /> Notification Settings
              </h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Check
                  type="switch"
                  id="email-notifications"
                  label="Email Notifications"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange("email")}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="push-notifications"
                  label="Push Notifications"
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange("push")}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="sms-notifications"
                  label="SMS Notifications"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange("sms")}
                />
              </Form>
            </Card.Body>
          </Card>

          {/* Appearance Settings */}
          <Card className="settings-card">
            <Card.Header>
              <h4 className="mb-0">
                <FaPalette className="me-2" /> Appearance Settings
              </h4>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Theme</Form.Label>
                <Form.Select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Font Size</Form.Label>
                <Form.Select
                  value={settings.fontSize}
                  onChange={(e) =>
                    handleSettingChange("fontSize", e.target.value)
                  }
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
