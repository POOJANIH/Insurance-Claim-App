import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import "./submitEstimation.css";

const SubmitEstimation = () => {
  const { claimId } = useParams(); // Get the claimId from the URL
  const [estimationAmount, setEstimationAmount] = useState("");
  const [estimationDetails, setEstimationDetails] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotos(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Add logic to submit the estimation
    console.log("Estimation Amount:", estimationAmount);
    console.log("Estimation Details:", estimationDetails);
    console.log("PDF File:", pdfFile);
    console.log("Photos:", photos);
    // You can also send this data to your backend API
    setLoading(false);
  };

  return (
    <Container className="submit-estimation-container">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Submit Estimation</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Estimation Amount</Form.Label>
              <Form.Control
                type="number"
                value={estimationAmount}
                onChange={(e) => setEstimationAmount(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estimation Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={estimationDetails}
                onChange={(e) => setEstimationDetails(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload PDF Estimation</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                required
              />
              {pdfFile && <p>Selected file: {pdfFile.name}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Photos</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
              {photos.length > 0 && (
                <p>
                  Selected files: {photos.map((photo) => photo.name).join(", ")}
                </p>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Submit Estimation"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubmitEstimation;
