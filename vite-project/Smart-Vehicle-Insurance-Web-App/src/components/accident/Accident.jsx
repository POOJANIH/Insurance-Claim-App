import React, { useState } from "react";
import { Button, Modal } from 'react-bootstrap'; // Import Bootstrap components
import "./accident.css";

const Accident = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [guidance, setGuidance] = useState([
    {
      id: 1,
      label: "Front View of the Vehicle",
      example: "https://via.placeholder.com/150?text=Front+View",
    },
    {
      id: 2,
      label: "Rear View of the Vehicle",
      example: "https://via.placeholder.com/150?text=Rear+View",
    },
    {
      id: 3,
      label: "Close-Up of Damaged Area",
      example: "https://via.placeholder.com/150?text=Damage+Close-Up",
    },
    {
      id: 4,
      label: "Scene of the Accident",
      example: "https://via.placeholder.com/150?text=Accident+Scene",
    },
  ]);
  const [severity, setSeverity] = useState(null); // To hold the severity response
  const [loading, setLoading] = useState(false); // Loading state for ML response
  const [showModal, setShowModal] = useState(false); // Control visibility of modal

  const handlePhotoUpload = (event, id) => {
    const files = Array.from(event.target.files);
    const updatedPhotos = [...uploadedPhotos];
    files.forEach((file) => {
      updatedPhotos.push({ id, file });
    });
    setUploadedPhotos(updatedPhotos);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate calling the ML model with the uploaded images
    // Replace this with your actual API call
    const simulatedMLResponse = await mockApiCall();
    setSeverity(simulatedMLResponse);
    setLoading(false);
    setShowModal(true); // Show modal after getting the response
  };

  const mockApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate ML response: "major" or "minor"
        resolve(Math.random() > 0.5 ? "major" : "minor");
      }, 2000); // Simulate API delay
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="accident-container">
      <h1>Report an Accident</h1>
      <p className="description">
        Please upload photos of your vehicle and the accident scene. Follow the
        guidance below for proper angles and views.
      </p>
      <div className="guidance-list">
        {guidance.map((item) => (
          <div className="guidance-item" key={item.id}>
            <h3>{item.label}</h3>
            <img
              src={item.example}
              alt={`${item.label} Example`}
              className="example-photo"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoUpload(e, item.id)}
            />
          </div>
        ))}
      </div>
      <div className="uploaded-photos">
        <h2>Uploaded Photos</h2>
        {uploadedPhotos.length > 0 ? (
          <ul>
            {uploadedPhotos.map((photo, index) => (
              <li key={index}>
                {photo.file.name} ({guidance.find((g) => g.id === photo.id)?.label})
              </li>
            ))}
          </ul>
        ) : (
          <p>No photos uploaded yet.</p>
        )}
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Submit Photos"}
      </button>

      {/* Modal for displaying severity message */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Accident Severity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {severity === "major" ? (
            <p>This is a major accident. Please wait for an assessor.</p>
          ) : (
            <p>This is a minor accident. You can proceed with the documentation.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {severity === "minor" && (
            <Button variant="primary" onClick={() => {/* Redirect to claims form */}}>
              Proceed to Claim Form
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Accident;
