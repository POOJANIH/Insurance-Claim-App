import React from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function VehicleInfoForm({
  vehicleData,
  onVehicleNumberChange,
  onValidate,
  isValidating,
  validationError
}) {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Vehicle Number</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            value={vehicleData.vehicleNumber}
            onChange={(e) => onVehicleNumberChange(e.target.value)}
            placeholder="Enter vehicle number"
          />
          <Button 
            variant="primary" 
            onClick={onValidate}
            disabled={isValidating || !vehicleData.vehicleNumber}
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

      {vehicleData.make && (
        <Alert variant="success">
          <h6>Vehicle Details:</h6>
          <p className="mb-1">Make: {vehicleData.make}</p>
          <p className="mb-1">Model: {vehicleData.model}</p>
          <p className="mb-1">Year: {vehicleData.year}</p>
          <p className="mb-0">License Plate: {vehicleData.licensePlate}</p>
        </Alert>
      )}
    </div>
  );
}

export default VehicleInfoForm; 