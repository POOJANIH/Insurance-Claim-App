import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ProgressBar,
  Row,
  Col,
  ButtonGroup,
  Alert,
} from "react-bootstrap";
import {
  Calendar,
  MapPin,
  Clock,
  Camera,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const SectionFive = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    accidentDate: new Date().toISOString().split("T")[0],
    accidentTime: new Date().toTimeString().slice(0, 5),
    location: "",
    weatherConditions: "",
    vehiclesDamaged: "2",
    injuriesInvolved: "no",
    policeReport: "no",
    reportNumber: "",
    description: "",
    witnesses: "no",
    witnessDetails: "",
    photos: [],
  });

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setFormData((prev) => ({
            ...prev,
            location: `Latitude: ${latitude}, Longitude: ${longitude}`,
          }));
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form submitted:", formData);
    console.log("Location data:", location);
  };

  const renderStep1 = () => (
    <Form>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>When did it happen?</Form.Label>
            <Form.Control
              type="date"
              name="accidentDate"
              value={formData.accidentDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>What time?</Form.Label>
            <div className="position-relative">
              <Clock
                className="position-absolute top-50 translate-middle-y"
                style={{ left: "10px" }}
              />
              <Form.Control
                type="time"
                name="accidentTime"
                value={formData.accidentTime}
                onChange={handleInputChange}
                style={{ paddingLeft: "35px" }}
                required
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Where did it happen?</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter address or use current location"
            value={formData.location}
            onChange={handleInputChange}
          />
          <Button
            variant="primary"
            onClick={getCurrentLocation}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            <MapPin size={16} />
            {loading ? "Getting location..." : "Current Location"}
          </Button>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Add photos of the accident</Form.Label>
        <div>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="d-none"
            id="photo-upload"
          />
          <Button
            variant="outline-primary"
            onClick={() => document.getElementById("photo-upload").click()}
            className="d-flex align-items-center gap-2"
          >
            <Camera size={16} />
            Upload Photos
          </Button>
          {formData.photos.length > 0 && (
            <small className="text-muted mt-2 d-block">
              {formData.photos.length} photos selected
            </small>
          )}
        </div>
      </Form.Group>
    </Form>
  );

  const renderStep2 = () => (
    <Form>
      <Form.Group className="mb-4">
        <Form.Label>What were the weather conditions?</Form.Label>
        <ButtonGroup className="d-flex flex-wrap gap-2">
          {["Clear", "Rainy", "Foggy", "Snowy"].map((weather) => (
            <Button
              key={weather}
              variant={
                formData.weatherConditions === weather
                  ? "primary"
                  : "outline-primary"
              }
              onClick={() =>
                handleInputChange({
                  target: { name: "weatherConditions", value: weather },
                })
              }
              className="flex-grow-1"
            >
              {weather}
            </Button>
          ))}
        </ButtonGroup>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>How many vehicles were involved?</Form.Label>
        <ButtonGroup className="d-flex">
          {["1", "2", "3+"].map((num) => (
            <Button
              key={num}
              variant={
                formData.vehiclesDamaged === num ? "primary" : "outline-primary"
              }
              onClick={() =>
                handleInputChange({
                  target: { name: "vehiclesDamaged", value: num },
                })
              }
            >
              {num}
            </Button>
          ))}
        </ButtonGroup>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Were there any injuries?</Form.Label>
        <div className="d-flex gap-3">
          <Form.Check
            type="radio"
            name="injuriesInvolved"
            label="Yes"
            value="yes"
            checked={formData.injuriesInvolved === "yes"}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            name="injuriesInvolved"
            label="No"
            value="no"
            checked={formData.injuriesInvolved === "no"}
            onChange={handleInputChange}
          />
        </div>
      </Form.Group>
    </Form>
  );

  const renderStep3 = () => (
    <Form>
      <Form.Group className="mb-4">
        <Form.Label>Was a police report filed?</Form.Label>
        <div className="d-flex gap-3">
          <Form.Check
            type="radio"
            name="policeReport"
            label="Yes"
            value="yes"
            checked={formData.policeReport === "yes"}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            name="policeReport"
            label="No"
            value="no"
            checked={formData.policeReport === "no"}
            onChange={handleInputChange}
          />
        </div>
      </Form.Group>

      {formData.policeReport === "yes" && (
        <Form.Group className="mb-4">
          <Form.Label>Police Report Number</Form.Label>
          <Form.Control
            type="text"
            name="reportNumber"
            value={formData.reportNumber}
            onChange={handleInputChange}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-4">
        <Form.Label>What happened?</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          rows={4}
          placeholder="Please describe how the accident occurred..."
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Were there any witnesses?</Form.Label>
        <div className="d-flex gap-3">
          <Form.Check
            type="radio"
            name="witnesses"
            label="Yes"
            value="yes"
            checked={formData.witnesses === "yes"}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            name="witnesses"
            label="No"
            value="no"
            checked={formData.witnesses === "no"}
            onChange={handleInputChange}
          />
        </div>
      </Form.Group>

      {formData.witnesses === "yes" && (
        <Form.Group className="mb-4">
          <Form.Label>Witness Details</Form.Label>
          <Form.Control
            as="textarea"
            name="witnessDetails"
            rows={3}
            placeholder="Please provide names and contact information of witnesses"
            value={formData.witnessDetails}
            onChange={handleInputChange}
          />
        </Form.Group>
      )}
    </Form>
  );

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Calendar size={20} />
            <h4 className="mb-0">Road Accident Report</h4>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Step {currentStep} of 3</small>
            <ProgressBar
              now={(currentStep / 3) * 100}
              style={{ height: "0.5rem", width: "50%" }}
            />
          </div>
        </Card.Header>

        <Card.Body>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </Card.Body>

        <Card.Footer className="bg-white">
          <div className="d-flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline-secondary" onClick={prevStep}>
                <ArrowLeft size={16} className="me-1" /> Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={nextStep} className="ms-auto">
                Next <ArrowRight size={16} className="ms-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ms-auto">
                Submit Report
              </Button>
            )}
          </div>
          {submitted && (
            <Alert variant="success" className="mt-3 mb-0">
              Your report has been submitted successfully. An insurance
              representative will contact you shortly.
            </Alert>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SectionFive;
