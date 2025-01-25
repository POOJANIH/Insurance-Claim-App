import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Modal,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VehicleInfoForm from '../../../components/accident/VehicleInfo/VehicleInfoForm';
import PhotoUploadCard from '../../../components/accident/PhotoUpload/PhotoUploadCard';
import AccidentDetailsForm from '../../../components/accident/AccidentDetails/AccidentDetailsForm';
import PhotoUploadSection from '../../../components/accident/PhotoUpload/PhotoUploadSection';
import { API_ENDPOINTS, FILE_TYPES, TOAST_MESSAGES } from '../../../constants';
import '../../../components/accident/accident.css';

function AccidentReportForm() {
  const navigate = useNavigate();
  
  // Vehicle Section States
  const [vehicleData, setVehicleData] = useState({
    vehicleNumber: '',
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Photo States
  const [photos, setPhotos] = useState({
    front: [],
    back: [],
    left: [],
    right: [],
    interior: [],
    closeup: [],
    damage: [],
    additional_photos: [],
    property_damage: []
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Accident Details States
  const [accidentDetails, setAccidentDetails] = useState({
    date: '',
    time: '',
    location: '',
    weather: '',
    vehiclesInvolved: 1,
    hasInjuries: false,
    hasPoliceReport: false,
    hasWitness: false,
    description: ''
  });

  // Add new state for toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Add a new state for vehicle validation
  const [isVehicleValidated, setIsVehicleValidated] = useState(false);

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo Categories Configuration
  const photoSections = [
    { key: 'front', label: 'Front View', description: 'Capture the entire front of your vehicle', max: 1, example: 'https://via.placeholder.com/300?text=Front+View' },
    { key: 'back', label: 'Back View', description: 'Include the entire back of your vehicle', max: 1, example: 'https://via.placeholder.com/300?text=Back+View' },
    { key: 'left', label: 'Left Side', description: 'Full left side view', max: 1, example: 'https://via.placeholder.com/300?text=Left+Side' },
    { key: 'right', label: 'Right Side', description: 'Full right side view', max: 1, example: 'https://via.placeholder.com/300?text=Right+Side' },
    { key: 'interior', label: 'Interior View', description: 'Interior damage photos', max: 2, example: 'https://via.placeholder.com/300?text=Interior' },
    { key: 'closeup', label: 'Close-up Photos', description: 'Detailed damage photos', max: 2, example: 'https://via.placeholder.com/300?text=Closeup' },
    { key: 'damage', label: 'Damage Photos', description: 'Overall damage views', max: 4, example: 'https://via.placeholder.com/300?text=Damage' },
    { key: 'additional_photos', label: 'Additional Photos', description: 'Any additional relevant photos', max: 3, example: 'https://via.placeholder.com/300?text=Additional' },
    { key: 'property_damage', label: 'Property Damage', description: 'Photos of property damage', max: -1, example: 'https://via.placeholder.com/300?text=Property' }
  ];

  // Handlers
  const handleVehicleNumberChange = (value) => {
    setVehicleData(prev => ({ ...prev, vehicleNumber: value }));
  };

  const handleValidateVehicle = async () => {
    setIsValidating(true);
    setValidationError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.VALIDATE_VEHICLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_plate: vehicleData.vehicleNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Vehicle validation failed');
      }

      if (data.valid) {
        setVehicleData({
          ...vehicleData,
          make: data.vehicle.make,
          model: data.vehicle.model,
          year: data.vehicle.year.toString(),
          licensePlate: data.vehicle.license_plate
        });
        setIsVehicleValidated(true);
      } else {
        setValidationError('Invalid vehicle number');
        setIsVehicleValidated(false);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setValidationError(err.message || 'Failed to validate vehicle');
      setIsVehicleValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleTakePhoto = async (sectionKey) => {
    if (!navigator.mediaDevices || !navigator.geolocation) {
      setToast({
        show: true,
        message: TOAST_MESSAGES.CAMERA_ERROR,
        type: 'danger'
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await new Promise(resolve => video.onloadedmetadata = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      stream.getTracks().forEach(track => track.stop());

      // Create a File object from the blob with a proper name
      const fileName = `camera_photo_${sectionKey}_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Use the same upload function
      await handlePhotoUpload(sectionKey, [file]);
    } catch (err) {
      console.error('Camera error:', err);
      setToast({
        show: true,
        message: TOAST_MESSAGES.CAMERA_ERROR,
        type: 'danger'
      });
    }
  };

  const handlePhotoUpload = async (sectionKey, files) => {
    setUploadProgress(prev => ({ ...prev, [sectionKey]: 0 }));
    
    try {
      const uploadedUrls = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_type', FILE_TYPES.ACCIDENT_PHOTO);
        formData.append('original_name', file.name);

        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({ ...prev, [sectionKey]: progress }));
          }
        };

        // Create a promise to handle the upload
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            // Check for both 200 and 201 status codes
            if (xhr.status === 200 || xhr.status === 201) {
              const response = JSON.parse(xhr.responseText);
              resolve({
                url: response.file_url,
                id: response.id
              });
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('Network error during upload'));
        });

        xhr.open('POST', API_ENDPOINTS.FILE_UPLOAD);
        xhr.send(formData);

        // Wait for the upload to complete
        const uploadedFile = await uploadPromise;
        uploadedUrls.push(uploadedFile);
      }

      // Update photos state with the uploaded URLs and IDs
      setPhotos(prev => ({
        ...prev,
        [sectionKey]: [
          ...(prev[sectionKey] || []),
          ...uploadedUrls.map(file => ({
            url: file.url,
            id: file.id
          }))
        ]
      }));

      // Show success toast
      setToast({
        show: true,
        message: TOAST_MESSAGES.UPLOAD_SUCCESS,
        type: 'success'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({
        show: true,
        message: TOAST_MESSAGES.UPLOAD_ERROR,
        type: 'danger'
      });
    } finally {
      // Reset progress
      setUploadProgress(prev => ({ ...prev, [sectionKey]: 0 }));
    }
  };

  const handleRemovePhoto = async (sectionKey, photoIndex) => {
    const photoToDelete = photos[sectionKey][photoIndex];
    
    if (photoToDelete?.id) {
      try {
        await fetch(`${API_ENDPOINTS.FILE_UPLOAD}${photoToDelete.id}/`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    setPhotos(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, index) => index !== photoIndex)
    }));

    setToast({
      show: true,
      message: TOAST_MESSAGES.DELETE_SUCCESS,
      type: 'success'
    });
  };

  const handleDetailsChange = (field, value) => {
    setAccidentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Format the photos data - extract IDs from the photo objects
      const formattedPhotos = {
        front: photos.front.map(photo => photo.id),
        back: photos.back.map(photo => photo.id),
        left: photos.left.map(photo => photo.id),
        right: photos.right.map(photo => photo.id),
        interior: photos.interior.map(photo => photo.id),
        closeup: photos.closeup.map(photo => photo.id),
        damage: photos.damage.map(photo => photo.id),
        additional_photos: photos.additional_photos.map(photo => photo.id),
        property_damage: photos.property_damage.map(photo => photo.id)
      };

      // Prepare the submission data
      const submissionData = {
        license_plate: vehicleData.vehicleNumber,
        accident_photos: formattedPhotos,
        accident_date: accidentDetails.date,
        accident_time: accidentDetails.time,
        accident_location: accidentDetails.location,
        weather_conditions: accidentDetails.weather.toUpperCase(),
        number_of_vehicles: accidentDetails.vehiclesInvolved,
        injuries: accidentDetails.hasInjuries,
        police_report: accidentDetails.hasPoliceReport,
        witness: accidentDetails.hasWitness,
        description: accidentDetails.description,
        case_severity: 'MINOR'
      };

      console.log('Submitting data:', submissionData); // For debugging

      const response = await fetch(API_ENDPOINTS.CREATE_CASE_UNREGISTERED, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Submission failed with status: ${response.status}`);
      }

      const caseData = await response.json();

      setToast({
        show: true,
        message: TOAST_MESSAGES.SUBMIT_SUCCESS,
        type: 'success'
      });

      navigate('/submission-success', { state: { caseData } });
    } catch (err) {
      console.error('Submission error:', err);
      setToast({
        show: true,
        message: err.message || TOAST_MESSAGES.SUBMIT_ERROR,
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // TODO: Implement image deletion API call
    navigate('/');
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col className="mx-auto" style={{ width: '1200px', maxWidth: '100%' }}>
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-5">Report an Accident</h2>
              
              <Form>
                {/* Vehicle Section */}
                <section className="mb-5">
                  <h4 className="mb-4">Vehicle Information</h4>
                  <VehicleInfoForm
                    vehicleData={vehicleData}
                    onVehicleNumberChange={handleVehicleNumberChange}
                    onValidate={handleValidateVehicle}
                    isValidating={isValidating}
                    validationError={validationError}
                  />
                </section>

                {!isVehicleValidated && (
                  <Alert variant="warning" className="my-4">
                    Please validate your vehicle information before proceeding.
                  </Alert>
                )}

                <hr className="my-5" />

                {/* Photo Upload Section */}
                <section className={`mb-5 ${!isVehicleValidated ? 'opacity-50' : ''}`}>
                  <h4 className="mb-4">Accident Documentation</h4>
                  <PhotoUploadSection
                    photos={photos}
                    onTakePhoto={handleTakePhoto}
                    onFileUpload={handlePhotoUpload}
                    onRemovePhoto={handleRemovePhoto}
                    onViewExample={setPreviewImage}
                    uploadProgress={uploadProgress}
                    disabled={!isVehicleValidated}
                  />
                </section>

                <hr className="my-5" />

                {/* Accident Details Section */}
                <section className={`mb-5 ${!isVehicleValidated ? 'opacity-50' : ''}`}>
                  <h4 className="mb-4">Accident Details</h4>
                  <AccidentDetailsForm
                    accidentDetails={accidentDetails}
                    onDetailsChange={handleDetailsChange}
                    disabled={!isVehicleValidated}
                  />
                </section>

                <hr className="my-5" />

                {/* Form Actions */}
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="danger" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={handleSubmit}
                    disabled={!isVehicleValidated || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Toast Container */}
      <ToastContainer 
        position="top-end" 
        className="p-3" 
        style={{ zIndex: 1060 }}
      >
        <Toast 
          show={toast.show} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          delay={3000}
          autohide
          bg={toast.type}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toast.type === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Example Photo Preview Modal */}
      <Modal 
        show={!!previewImage} 
        onHide={() => setPreviewImage(null)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {previewImage?.includes('placeholder.com') ? 'Example Photo' : 'Uploaded Photo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-100" 
            style={{ maxHeight: '80vh', objectFit: 'contain' }} 
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AccidentReportForm; 