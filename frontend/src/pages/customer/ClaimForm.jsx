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
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaFileDownload,
  FaUpload,
  FaFilePdf,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { API_ENDPOINTS, FILE_TYPES } from "../../constants";
import DashboardNav from "../../components/common/DashboardNav";
import { useParams, useNavigate } from "react-router-dom";
import "./ClaimForm.css";

const ClaimForm = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!caseId) {
      setError("No case ID provided. Please try again from your case details.");
      setLoading(false);
    } else {
      fetchForms();
    }
  }, [caseId]);

  const fetchForms = async () => {
    try {
      // Log request details
      console.log('Making API request to:', API_ENDPOINTS.CLAIM_FORMS);
      console.log('Request headers:', {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });

      const response = await fetch(API_ENDPOINTS.CLAIM_FORMS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Log response details for debugging
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      setForms(data);
      setLoading(false);
    } catch (error) {
      console.error('Loading error details:', {
        message: error.message,
        stack: error.stack
      });
      setError(`Failed to load forms: ${error.message}`);
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download form');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setToastMessage("Form downloaded successfully!");
      setShowToast(true);
    } catch (error) {
      console.error('Download error:', error);
      setError("Failed to download form. Please try again.");
      setToastMessage("Failed to download form. Please try again.");
      setShowToast(true);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
        setUploadStatus(null);
        setError(null);
      } else {
        setError("File size must be less than 5MB.");
        event.target.value = null;
      }
    } else {
      setError("Please select a PDF or image file (JPG, PNG).");
      event.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !caseId) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_type", FILE_TYPES.CLAIM_FORM);

    try {
      setUploadProgress(0);
      setUploadStatus("uploading");

      // First API call - Upload the file
      const uploadResponse = await fetch(API_ENDPOINTS.FILE_UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const fileData = await uploadResponse.json();
      
      // Second API call - Associate the file with the case
      const associateResponse = await fetch(`${API_ENDPOINTS.CASES}${caseId}/upload_claim_form/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claim_form_uuid: fileData.id
        })
      });

      if (!associateResponse.ok) {
        throw new Error('Failed to associate claim form with case');
      }

      setUploadStatus("success");
      setSelectedFile(null);
      setToastMessage("Form uploaded and associated with your case successfully!");
      setShowToast(true);

      // Redirect to dashboard after successful upload
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 2000);

    } catch (error) {
      setError("Failed to upload form: " + error.message);
      console.error('Upload error:', error);
      setToastMessage("Failed to upload form. Please try again.");
      setShowToast(true);
      setUploadStatus(null);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNav userRole="Customer" />
        <Container className="d-flex justify-content-center align-items-center min-vh-50 py-5" style={{ marginTop: '80px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading forms...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <DashboardNav userRole="Customer" />
      <Container className="py-4" style={{ marginTop: '80px' }}>
        <div className="claim-form-header text-center mb-4">
          <h2>Insurance Claim Process</h2>
          <p className="text-muted">Case ID: {caseId}</p>
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
                      <h6 className="mb-1">{form.original_name}</h6>
                      <small className="text-muted">
                        Last updated: {new Date(form.uploaded_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleDownload(form.file_url, form.original_name)}
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
                Accepted formats: PDF, JPG, PNG (Max 5MB)
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
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  animated
                />
              </div>
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

        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <FaCheckCircle className="me-2 text-success" />
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </>
  );
};

export default ClaimForm; 