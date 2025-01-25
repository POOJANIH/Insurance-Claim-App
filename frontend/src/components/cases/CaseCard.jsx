import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Badge, Button, Modal, Row, Col, ListGroup, Image, Spinner, Form, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../constants';
import AuthService from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaFileDownload, FaUpload, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

function CaseCard({ caseData }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [photos, setPhotos] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState('');
  const [garages, setGarages] = useState([]);
  const [loadingGarages, setLoadingGarages] = useState(false);
  const [claimFormDetails, setClaimFormDetails] = useState(null);
  const [loadingClaimForm, setLoadingClaimForm] = useState(false);
  const [estimateFile, setEstimateFile] = useState(null);
  const [uploadingEstimate, setUploadingEstimate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [estimateFileDetails, setEstimateFileDetails] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const user = AuthService.getUser();
  const isAdmin = user?.role === 'Admin';
  const isCustomer = user?.role === 'Customer';
  const isGarage = user?.role === 'Garage';

  const fetchPhotoUrls = async () => {
    setLoadingPhotos(true);
    const photoUrls = {};
    
    try {
      for (const [category, photoIds] of Object.entries(caseData.accident_photos)) {
        photoUrls[category] = [];
        for (const photoId of photoIds) {
          const response = await fetch(`${API_ENDPOINTS.FILE_UPLOAD}${photoId}/`, {
            headers: {
              'Authorization': `Bearer ${AuthService.getAccessToken()}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            photoUrls[category].push(data.file_url);
          }
        }
      }
      setPhotos(photoUrls);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchFileDetails = async (fileId, setFileDetails, setLoading) => {
    if (!fileId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.FILE_UPLOAD}${fileId}/`, {
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file details');
      }

      const data = await response.json();
      setFileDetails(data);
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchPhotoUrls();
      if (caseData.claim_form) {
        fetchFileDetails(caseData.claim_form, setClaimFormDetails, setLoadingClaimForm);
      }
      if (caseData.estimate_file) {
        fetchFileDetails(caseData.estimate_file, setEstimateFileDetails, setLoadingEstimate);
      }
    }
  }, [showModal, caseData.claim_form, caseData.estimate_file]);

  useEffect(() => {
    if (showEstimateModal) {
      fetchPhotoUrls();
    }
  }, [showEstimateModal]);

  useEffect(() => {
    if (showGarageModal) {
      const fetchGarages = async () => {
        setLoadingGarages(true);
        try {
          const response = await fetch(API_ENDPOINTS.GARAGES, {
            headers: {
              'Authorization': `Bearer ${AuthService.getAccessToken()}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch garages');
          }

          const data = await response.json();
          setGarages(data.results);
        } catch (error) {
          console.error('Error fetching garages:', error);
        } finally {
          setLoadingGarages(false);
        }
      };

      fetchGarages();
    }
  }, [showGarageModal, caseData.claim_form]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACCIDENT_REPORT':
        return 'warning';
      case 'CLAIM_CREATED':
        return 'info';
      case 'CLAIM_ASSIGNED_TO_GARAGE':
        return 'primary';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const renderPhotoSection = (title, photoUrls = []) => {
    if (!photoUrls.length) return null;
    
    return (
      <div className="mb-4">
        <h6 className="mb-3">{title}</h6>
        <Row xs={2} md={3} lg={4} className="g-3">
          {photoUrls.map((url, index) => (
            <Col key={index}>
              <div style={{ aspectRatio: '1', overflow: 'hidden' }} className="rounded">
                <Image 
                  src={url} 
                  alt={`${title} ${index + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(url, '_blank')}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const handleClaimFormUpload = () => {
    navigate(`/customer/case/${caseData.id}/claim`);
  };

  const handleGarageAssign = async () => {
    if (!selectedGarage) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGN_GARAGE(caseData.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          garage_id: selectedGarage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to assign garage');
      }

      setShowGarageModal(false);
      window.location.reload(); // Refresh to get updated case status
    } catch (error) {
      console.error('Error assigning garage:', error);
    }
  };

  const handleFileDownload = async (fileDetails, fileName) => {
    if (!fileDetails?.file_url) return;
    
    try {
      const response = await fetch(fileDetails.file_url, {
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || fileDetails.original_name;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setToastMessage("Failed to download file. Please try again.");
      setShowToast(true);
    }
  };

  const handleEstimateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file");
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError("File size must be less than 5MB");
      e.target.value = null;
      return;
    }

    setEstimateFile(file);
    setUploadError(null);
  };

  const handleEstimateSubmit = async () => {
    if (!estimateFile) return;

    setUploadingEstimate(true);
    try {
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append('file', estimateFile);
      formData.append('file_type', 'ESTIMATE');
      formData.append('original_name', estimateFile.name);

      const uploadResponse = await fetch(API_ENDPOINTS.FILE_UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload estimate file');
      }

      const fileData = await uploadResponse.json();

      // Step 2: Associate the estimate with the case
      const associateResponse = await fetch(API_ENDPOINTS.SUBMIT_ESTIMATE(caseData.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estimate_file_uuid: fileData.id
        })
      });

      if (!associateResponse.ok) {
        throw new Error('Failed to associate estimate with case');
      }

      setToastMessage("Estimate uploaded successfully!");
      setShowToast(true);
      setShowEstimateModal(false);
      window.location.reload(); // Refresh to get updated case status
    } catch (error) {
      console.error('Error submitting estimate:', error);
      setUploadError("Failed to upload estimate. Please try again.");
      setToastMessage("Failed to upload estimate. Please try again.");
      setShowToast(true);
    } finally {
      setUploadingEstimate(false);
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center px-5 py-4">
          <div className="d-flex align-items-center" style={{ flex: 1 }}>
            <div style={{ flex: 1 }}>
              <h4 className="mb-3 fs-3">{caseData.case_name}</h4>
              <div className="d-flex align-items-center">
                <Badge 
                  bg={getStatusBadgeVariant(caseData.case_status)} 
                  className="me-4 px-3 py-2 fs-6"
                >
                  {caseData.case_status.split('_').join(' ')}
                </Badge>
                <span className="text-muted fs-5">
                  <strong>Vehicle:</strong> {caseData.vehicle_details.license_plate}
                </span>
                <span className="mx-4 fs-4">•</span>
                <span className="text-muted fs-5">
                  <strong>Date:</strong> {caseData.accident_date}
                </span>
              </div>
            </div>
            <div className="d-flex gap-3">
              {isCustomer && caseData.case_status === 'ACCIDENT_REPORT' && (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="px-4 py-2 fs-5"
                  onClick={handleClaimFormUpload}
                >
                  Upload Claim Form
                </Button>
              )}
              {isAdmin && caseData.case_status === 'CLAIM_CREATED' && (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="px-4 py-2 fs-5"
                  onClick={() => setShowGarageModal(true)}
                >
                  Assign a Garage
                </Button>
              )}
              {isGarage && caseData.case_status === 'CLAIM_ASSIGNED_TO_GARAGE' && (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="px-4 py-2 fs-5"
                  onClick={() => setShowEstimateModal(true)}
                >
                  Add an Estimate
                </Button>
              )}
              {!isGarage && (
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="px-4 py-2 fs-5"
                  onClick={() => setShowModal(true)}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" fullscreen="lg-down">
        <Modal.Header closeButton>
          <Modal.Title>Case Details: {caseData.case_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="mb-3">Case Information</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Status:</strong>{' '}
                  <Badge bg={getStatusBadgeVariant(caseData.case_status)}>
                    {caseData.case_status.replace('_', ' ')}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Severity:</strong> {caseData.case_severity}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {new Date(caseData.case_created_at).toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Updated:</strong>{' '}
                  {new Date(caseData.case_updated_at).toLocaleString()}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <h5 className="mb-3">Documents</h5>
              <ListGroup variant="flush">
                {loadingClaimForm || loadingEstimate ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <p className="mt-2">Loading documents...</p>
                  </div>
                ) : (
                  <>
                    {claimFormDetails && (
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FaFilePdf className="text-danger me-2" size={24} />
                          <div>
                            <h6 className="mb-0">Claim Form</h6>
                            <small className="text-muted">
                              Uploaded: {new Date(claimFormDetails.uploaded_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleFileDownload(claimFormDetails, 'claim_form.pdf')}
                        >
                          <FaFileDownload className="me-2" />
                          Download
                        </Button>
                      </ListGroup.Item>
                    )}
                    {estimateFileDetails && (
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FaFilePdf className="text-danger me-2" size={24} />
                          <div>
                            <h6 className="mb-0">Repair Estimate</h6>
                            <small className="text-muted">
                              Uploaded: {new Date(estimateFileDetails.uploaded_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleFileDownload(estimateFileDetails, 'repair_estimate.pdf')}
                        >
                          <FaFileDownload className="me-2" />
                          Download
                        </Button>
                      </ListGroup.Item>
                    )}
                    {!claimFormDetails && !estimateFileDetails && (
                      <ListGroup.Item>
                        <Alert variant="info" className="mb-0">
                          No documents available
                        </Alert>
                      </ListGroup.Item>
                    )}
                  </>
                )}
              </ListGroup>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5 className="mb-3">Vehicle Information</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>License Plate:</strong>{' '}
                  {caseData.vehicle_details.license_plate}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Make/Model:</strong>{' '}
                  {caseData.vehicle_details.make} {caseData.vehicle_details.model}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Year:</strong> {caseData.vehicle_details.year}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Owner:</strong> {caseData.vehicle_details.owner_name}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h5 className="mb-3">Accident Details</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Date & Time:</strong>{' '}
                  {caseData.accident_date} {caseData.accident_time}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Location:</strong> {caseData.accident_location}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Weather:</strong>{' '}
                  {caseData.weather_conditions.toLowerCase()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Vehicles Involved:</strong>{' '}
                  {caseData.number_of_vehicles}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Injuries:</strong> {caseData.injuries ? 'Yes' : 'No'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Police Report:</strong>{' '}
                  {caseData.police_report ? 'Yes' : 'No'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Witnesses:</strong> {caseData.witness ? 'Yes' : 'No'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description:</strong> {caseData.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <div className="mt-4">
            <h5 className="mb-4">Accident Photos</h5>
            {loadingPhotos ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading photos...</p>
              </div>
            ) : (
              <>
                {renderPhotoSection('Vehicle Front View', photos.front)}
                {renderPhotoSection('Vehicle Back View', photos.back)}
                {renderPhotoSection('Vehicle Left Side', photos.left)}
                {renderPhotoSection('Vehicle Right Side', photos.right)}
                {renderPhotoSection('Interior Damage', photos.interior)}
                {renderPhotoSection('Close-up Damage', photos.closeup)}
                {renderPhotoSection('Overall Damage', photos.damage)}
                {renderPhotoSection('Property Damage', photos.property_damage)}
                {renderPhotoSection('Additional Photos', photos.additional_photos)}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {isAdmin && (
        <Modal show={showGarageModal} onHide={() => setShowGarageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Assign Garage</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info" className="mb-4">
              User has submitted this claim form. Please verify and assign a garage.
            </Alert>

            {loadingClaimForm ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" />
                <p className="mt-2">Loading claim form...</p>
              </div>
            ) : claimFormDetails ? (
              <Card className="mb-4">
                <Card.Body className="py-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaFilePdf className="text-danger me-2" size={24} />
                      <div>
                        <h6 className="mb-0">{claimFormDetails.original_name}</h6>
                        <small className="text-muted">
                          Uploaded: {new Date(claimFormDetails.uploaded_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.open(claimFormDetails.file_url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleFileDownload(claimFormDetails, 'claim_form.pdf')}
                      >
                        <FaFileDownload className="me-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="warning">No claim form found.</Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Select Garage</Form.Label>
              {loadingGarages ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <Form.Select 
                  value={selectedGarage}
                  onChange={(e) => setSelectedGarage(e.target.value)}
                >
                  <option value="">Choose a garage...</option>
                  {garages.map(garage => (
                    <option key={garage.id} value={garage.id}>
                      {garage.name} - {garage.address}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGarageModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleGarageAssign}
              disabled={!selectedGarage || loadingGarages}
            >
              Assign Garage
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {isGarage && (
        <Modal show={showEstimateModal} onHide={() => setShowEstimateModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Add Estimate - {caseData.case_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Row className="mb-4">
              <Col md={6}>
                <h5 className="mb-3">Case Information</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Severity:</strong> {caseData.case_severity}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Vehicle:</strong> {caseData.vehicle_details.make} {caseData.vehicle_details.model} ({caseData.vehicle_details.year})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>License Plate:</strong> {caseData.vehicle_details.license_plate}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <h5 className="mb-3">Damage Description</h5>
                <Card className="bg-light">
                  <Card.Body>
                    <p className="mb-0">{caseData.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="mt-4 mb-4">
              <h5 className="mb-4">Accident Photos</h5>
              {loadingPhotos ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading photos...</p>
                </div>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {photos.front?.map((url, index) => (
                    <Col key={`front-${index}`}>
                      <Card className="h-100">
                        <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                          <Image 
                            src={url} 
                            alt={`Front View ${index + 1}`}
                            className="w-100 h-100 object-fit-cover"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                        <Card.Footer className="text-muted">Front View {index + 1}</Card.Footer>
                      </Card>
                    </Col>
                  ))}
                  {photos.back?.map((url, index) => (
                    <Col key={`back-${index}`}>
                      <Card className="h-100">
                        <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                          <Image 
                            src={url} 
                            alt={`Back View ${index + 1}`}
                            className="w-100 h-100 object-fit-cover"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                        <Card.Footer className="text-muted">Back View {index + 1}</Card.Footer>
                      </Card>
                    </Col>
                  ))}
                  {photos.damage?.map((url, index) => (
                    <Col key={`damage-${index}`}>
                      <Card className="h-100">
                        <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                          <Image 
                            src={url} 
                            alt={`Damage View ${index + 1}`}
                            className="w-100 h-100 object-fit-cover"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                        <Card.Footer className="text-muted">Damage View {index + 1}</Card.Footer>
                      </Card>
                    </Col>
                  ))}
                  {photos.closeup?.map((url, index) => (
                    <Col key={`closeup-${index}`}>
                      <Card className="h-100">
                        <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                          <Image 
                            src={url} 
                            alt={`Close-up View ${index + 1}`}
                            className="w-100 h-100 object-fit-cover"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                        <Card.Footer className="text-muted">Close-up View {index + 1}</Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>

            <div className="mt-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white d-flex align-items-center">
                  <FaUpload className="me-2" />
                  <h5 className="mb-0">Upload Estimate Document</h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="info" className="d-flex align-items-center">
                    <FaInfoCircle className="me-2" />
                    Please upload your repair cost estimate in PDF format
                  </Alert>

                  {uploadError && (
                    <Alert variant="danger" className="d-flex align-items-center">
                      <FaExclamationTriangle className="me-2" />
                      {uploadError}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Select your file</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleEstimateUpload}
                      accept=".pdf"
                      className="form-control-lg"
                      disabled={uploadingEstimate}
                    />
                    <Form.Text className="text-muted">
                      Accepted format: PDF (Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {estimateFile && (
                    <div className="selected-file mb-3 d-flex align-items-center bg-light p-3 rounded">
                      <FaFilePdf className="me-2 text-danger" />
                      <span className="me-2">{estimateFile.name}</span>
                      <Badge bg="secondary">
                        {(estimateFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  )}

                  <Button
                    variant="success"
                    onClick={handleEstimateSubmit}
                    disabled={!estimateFile || uploadingEstimate}
                    className="w-100 py-2"
                    size="lg"
                  >
                    {uploadingEstimate ? (
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
                        Upload Estimate
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </Modal.Body>
        </Modal>
      )}

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
    </>
  );
}

CaseCard.propTypes = {
  caseData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    case_name: PropTypes.string.isRequired,
    case_status: PropTypes.string.isRequired,
    case_severity: PropTypes.string.isRequired,
    case_created_at: PropTypes.string.isRequired,
    case_updated_at: PropTypes.string.isRequired,
    accident_date: PropTypes.string.isRequired,
    accident_time: PropTypes.string.isRequired,
    accident_location: PropTypes.string.isRequired,
    weather_conditions: PropTypes.string.isRequired,
    number_of_vehicles: PropTypes.number.isRequired,
    injuries: PropTypes.bool.isRequired,
    police_report: PropTypes.bool.isRequired,
    witness: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    vehicle_details: PropTypes.shape({
      license_plate: PropTypes.string.isRequired,
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      owner_name: PropTypes.string.isRequired,
    }).isRequired,
    accident_photos: PropTypes.objectOf(
      PropTypes.arrayOf(PropTypes.string)
    ).isRequired,
    claim_form: PropTypes.string,
    estimate_file: PropTypes.string,
  }).isRequired,
};

export default CaseCard; 