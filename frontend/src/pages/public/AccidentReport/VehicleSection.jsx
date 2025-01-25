import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function VehicleSection({ onNext, formData, setFormData }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(null);

  const handleValidateVehicle = async () => {
    setIsValidating(true);
    setValidationError('');
    
    // TODO: Implement actual validation API call
    // Mock validation for now
    setTimeout(() => {
      if (vehicleNumber.length >= 5) {
        setVehicleDetails({
          make: 'Toyota',
          model: 'Camry',
          year: '2020',
          licensePlate: vehicleNumber
        });
        setFormData({
          ...formData,
          vehicle: {
            make: 'Toyota',
            model: 'Camry',
            year: '2020',
            licensePlate: vehicleNumber
          }
        });
      } else {
        setValidationError('Invalid vehicle number');
      }
      setIsValidating(false);
    }, 1000);
  };

  return (
    <div>
      <h4>Vehicle Information</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Vehicle Number</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
            />
            <Button 
              variant="primary" 
              onClick={handleValidateVehicle}
              disabled={isValidating || !vehicleNumber}
            >
              {isValidating ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Validate'
              )}
            </Button>
          </div>
        </Form.Group>

        {validationError && (
          <Alert variant="danger">
            {validationError}
          </Alert>
        )}

        {vehicleDetails && (
          <div className="mt-3">
            <Alert variant="success">
              <h6>Vehicle Details:</h6>
              <p className="mb-1">Make: {vehicleDetails.make}</p>
              <p className="mb-1">Model: {vehicleDetails.model}</p>
              <p className="mb-1">Year: {vehicleDetails.year}</p>
              <p className="mb-0">License Plate: {vehicleDetails.licensePlate}</p>
            </Alert>
          </div>
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={!vehicleDetails}
          >
            Next: Upload Photos
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default VehicleSection; 