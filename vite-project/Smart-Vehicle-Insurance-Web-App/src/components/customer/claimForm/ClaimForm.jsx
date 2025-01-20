import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Spinner,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import {
  FaFileDownload,
  FaUpload,
  FaFilePdf,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import "./claimForm.css";

const ClaimForm = () => {
  const [forms, setForms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/claim-forms/"
      );
      setForms(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load forms");
      setLoading(false);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/claim-forms/${id}/download/`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download form");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setSelectedFile(file);
      setUploadStatus(null);
      setError(null);
    } else {
      setError("Please select a PDF or image file");
      event.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("title", selectedFile.name);

    try {
      setUploadProgress(0);
      setUploadStatus("uploading");

      await axios.post("http://127.0.0.1:8000/api/claim-forms/", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });

      setUploadStatus("success");
      setSelectedFile(null);
      fetchForms();
    } catch (err) {
      setUploadStatus("error");
      setError("Failed to upload form. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading forms...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="claim-form-header text-center mb-4">
        <h2>Insurance Claim Process</h2>
        <p className="text-muted">Follow these steps to submit your claim</p>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {/* Steps Guide */}
      <div className="steps-guide mb-4">
        <div className="step-item">
          <div className="step-number">1</div>
          <div className="step-content">
            <h5>Download Claim Form</h5>
            <p>Download the official insurance claim form</p>
          </div>
        </div>
        <div className="step-item">
          <div className="step-number">2</div>
          <div className="step-content">
            <h5>Fill Out the Form</h5>
            <p>Complete all required information in the form</p>
          </div>
        </div>
        <div className="step-item">
          <div className="step-number">3</div>
          <div className="step-content">
            <h5>Upload Completed Form</h5>
            <p>Submit your filled claim form</p>
          </div>
        </div>
      </div>

      {/* Available Forms */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaFilePdf className="me-2" />
          <h5 className="mb-0">Available Claim Forms</h5>
        </Card.Header>
        <Card.Body>
          {forms.length === 0 ? (
            <Alert variant="info">
              <FaInfoCircle className="me-2" />
              No forms are currently available
            </Alert>
          ) : (
            forms.map((form) => (
              <div key={form.id} className="form-item">
                <div className="form-info">
                  <FaFilePdf className="text-danger me-2" />
                  <div>
                    <h6 className="mb-1">{form.title}</h6>
                    <small className="text-muted">
                      Last updated:{" "}
                      {new Date(form.updated_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={() => handleDownload(form.id, form.title)}
                  className="download-btn"
                >
                  <FaFileDownload className="me-2" />
                  Download Form
                </Button>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Upload Section */}
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white d-flex align-items-center">
          <FaUpload className="me-2" />
          <h5 className="mb-0">Upload Completed Form</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="d-flex align-items-center">
            <FaInfoCircle className="me-2" />
            Please upload your completed claim form in PDF or image format
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>Select your file</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
              className="form-control-lg"
            />
            <Form.Text className="text-muted">
              Accepted formats: PDF, JPG, PNG
            </Form.Text>
          </Form.Group>

          {selectedFile && (
            <div className="selected-file mb-3">
              <FaFilePdf className="me-2" />
              <span>{selectedFile.name}</span>
              <Badge bg="secondary" className="ms-2">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </div>
          )}

          {uploadStatus === "uploading" && (
            <div className="mb-3">
              <ProgressBar
                animated
                now={uploadProgress}
                label={`${uploadProgress}%`}
              />
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert variant="success" className="d-flex align-items-center">
              <FaCheckCircle className="me-2" />
              Form uploaded successfully!
            </Alert>
          )}

          <Button
            variant="success"
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="upload-btn"
          >
            {uploadStatus === "uploading" ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="me-2" />
                Upload Form
              </>
            )}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClaimForm;
