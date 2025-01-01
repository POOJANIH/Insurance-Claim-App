import React, { useState } from "react";
import { Button, Modal, Card, Row, Col, OverlayTrigger, Popover } from "react-bootstrap";
import "./accident.css";

const Accident = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [guidance, setGuidance] = useState([
    { id: 1, label: "Front View of the Vehicle", example: "https://via.placeholder.com/150?text=Front+View" },
    { id: 2, label: "Rear View of the Vehicle", example: "https://via.placeholder.com/150?text=Rear+View" },
    { id: 3, label: "Close-Up of Damaged Area", example: "https://via.placeholder.com/150?text=Damage+Close-Up" },
    { id: 4, label: "Scene of the Accident", example: "https://via.placeholder.com/150?text=Accident+Scene" },
    { id: 5, label: "Left Side View", example: "https://via.placeholder.com/150?text=Left+Side" },
    { id: 6, label: "Right Side View", example: "https://via.placeholder.com/150?text=Right+Side" },
    { id: 7, label: "License Plate Close-Up", example: "https://via.placeholder.com/150?text=License+Plate" },
    { id: 8, label: "Interior Dashboard", example: "https://via.placeholder.com/150?text=Dashboard" },
    { id: 9, label: "Interior Seats", example: "https://via.placeholder.com/150?text=Seats" },
    { id: 10, label: "Damage Overview", example: "https://via.placeholder.com/150?text=Damage+Overview" },
    { id: 11, label: "Nearby Road Signage", example: "https://via.placeholder.com/150?text=Road+Signage" },
    { id: 12, label: "Skid Marks on Road", example: "https://via.placeholder.com/150?text=Skid+Marks" },
    { id: 13, label: "Additional Photo 1", example: "https://via.placeholder.com/150?text=Additional+Photo" },
    { id: 14, label: "Additional Photo 2", example: "https://via.placeholder.com/150?text=Additional+Photo" },
    { id: 15, label: "Optional Additional Photo", example: "https://via.placeholder.com/150?text=Optional+Photo" },
  ]);

  const handleTakePhoto = async (id) => {
    if (!navigator.mediaDevices || !navigator.geolocation) {
      alert("Your browser does not support camera or location access.");
      return;
    }

    try {
      // Request location access
      await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      // Request camera access and capture a photo
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      // Capture a frame from the video stream
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL();

      // Stop the video stream
      stream.getTracks().forEach((track) => track.stop());

      // Update the card with the captured photo
      setUploadedPhotos((prev) =>
        prev.map((photo) => (photo.id === id ? { ...photo, src: photoDataUrl } : photo))
      );
    } catch (error) {
      alert("Could not access camera or location.");
    }
  };

  const renderPopover = (example) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Example Photo</Popover.Header>
      <Popover.Body>
        <img src={example} alt="Example" style={{ width: "100%" }} />
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="accident-container">
      <h1>Report an Accident</h1>
      <p className="description">
        Please upload photos of your vehicle and the accident scene. Follow the
        guidance below for proper angles and views. Additional photos can also
        be uploaded if needed.
      </p>
      <Row xs={2} md={3} className="g-3">
        {guidance.map((item) => (
          <Col key={item.id}>
            <Card className="upload-card">
              <Card.Img
                variant="top"
                src={
                  uploadedPhotos.find((photo) => photo.id === item.id)?.src ||
                  item.example
                }
                className="example-image"
              />
              <Card.Body>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={renderPopover(item.example)}
                >
                  <Button variant="link" className="card-title">
                    {item.label}
                  </Button>
                </OverlayTrigger>
                <Button
                  variant="primary"
                  className="take-photo-button"
                  onClick={() => handleTakePhoto(item.id)}
                >
                  Take a Photo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Accident;
