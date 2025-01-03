import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Container,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import {
  BsCamera,
  BsUpload,
  BsTrash,
  BsImage,
  BsExclamationCircle,
} from "react-icons/bs";
import "./accident.css";

const SectionThree = () => {
  const [uploadedProperties, setUploadedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setLoading(true);
    const files = Array.from(e.target.files);
    const properties = files.map((file) => ({
      id: Math.random(),
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedProperties((prev) => [...prev, ...properties]);
    setLoading(false);
  };

  const handleRemoveProperty = (id) => {
    setUploadedProperties((prev) =>
      prev.filter((property) => property.id !== id)
    );
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFromCamera = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    await handleTakePhoto();
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="display-4 mb-3">Property Documentation</h2>
        <p className="lead text-muted">
          Upload photos of other properties affected by the accident
        </p>
        <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
          <div className="bg-light rounded-3 p-3 text-center">
            <BsImage size={24} className="text-primary mb-2" />
            <div className="fw-bold">{uploadedProperties.length}</div>
            <div className="text-muted small">Photos Added</div>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleUploadFromCamera}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            <BsCamera />
            Take Photo
          </Button>
          <Button
            variant="outline-primary"
            size="lg"
            onClick={() => document.getElementById("fileInput").click()}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            <BsUpload />
            Upload Files
          </Button>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          id="fileInput"
          style={{ display: "none" }}
        />

        {/* Guidelines Card */}
        <Card className="mb-5 border-0 shadow-sm">
          <Card.Body className="text-start">
            <div className="d-flex align-items-center gap-2 mb-3">
              <BsExclamationCircle className="text-primary" size={24} />
              <h5 className="mb-0">Photo Guidelines</h5>
            </div>
            <ul className="mb-0">
              <li>Capture clear, well-lit photos of affected properties</li>
              <li>Include wide shots showing the context of the damage</li>
              <li>Take close-up photos of specific damage areas</li>
              <li>Include relevant street signs or landmarks if applicable</li>
            </ul>
          </Card.Body>
        </Card>
      </div>

      {/* Uploaded Photos Grid */}
      {uploadedProperties.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-4 text-center">Uploaded Photos</h3>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {uploadedProperties.map((property) => (
              <Col key={property.id}>
                <Card className="h-100 shadow-sm">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={property.src}
                      alt={property.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Badge
                      bg="light"
                      text="dark"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      Property Photo
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      className="text-truncate mb-3"
                      title={property.name}
                    >
                      {property.name}
                    </Card.Title>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveProperty(property.id)}
                      className="mt-auto d-flex align-items-center justify-content-center gap-2"
                    >
                      <BsTrash />
                      Remove Photo
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <ProgressBar animated now={100} className="mb-3" />
          <p className="text-muted">Processing your request...</p>
        </div>
      )}
    </Container>
  );
};

export default SectionThree;
