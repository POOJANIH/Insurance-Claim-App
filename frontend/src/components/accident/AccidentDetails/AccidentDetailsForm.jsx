import { Form, Row, Col, Card, InputGroup, Button } from 'react-bootstrap';
import { BsCalendar, BsClock, BsGeoAlt } from 'react-icons/bs';
import { useRef } from 'react';

function AccidentDetailsForm({
  accidentDetails,
  onDetailsChange,
  disabled = false
}) {
  const handleChange = (field, value) => {
    onDetailsChange(field, value);
  };

  // Add refs for the input elements
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const locationInputRef = useRef(null);

  const handleLocationClick = () => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can integrate with a geocoding service here to get the address
          // For now, just set the coordinates
          handleChange('location', `${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        {/* Date, Time, and Location Row */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date of Accident</Form.Label>
              <InputGroup className="border rounded">
                <Form.Control
                  ref={dateInputRef}
                  type="date"
                  value={accidentDetails.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  className="border-0"
                  disabled={disabled}
                />
                <div 
                  className={`d-flex align-items-center px-2 ${disabled ? '' : 'cursor-pointer'}`}
                  onClick={() => !disabled && dateInputRef.current?.showPicker()}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  <BsCalendar size={18} className={disabled ? 'text-muted' : 'text-primary'} />
                </div>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Time of Accident</Form.Label>
              <InputGroup className="border rounded">
                <Form.Control
                  ref={timeInputRef}
                  type="time"
                  value={accidentDetails.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                  className="border-0"
                  disabled={disabled}
                />
                <div 
                  className={`d-flex align-items-center px-2 ${disabled ? '' : 'cursor-pointer'}`}
                  onClick={() => !disabled && timeInputRef.current?.showPicker()}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  <BsClock size={18} className={disabled ? 'text-muted' : 'text-primary'} />
                </div>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <InputGroup className="border rounded">
                <Form.Control
                  ref={locationInputRef}
                  type="text"
                  placeholder="Enter location"
                  value={accidentDetails.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                  className="border-0"
                  disabled={disabled}
                />
                <div 
                  className={`d-flex align-items-center px-2 ${disabled ? '' : 'cursor-pointer'}`}
                  onClick={() => !disabled && handleLocationClick()}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  <BsGeoAlt size={18} className={disabled ? 'text-muted' : 'text-primary'} />
                </div>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* Weather and Vehicles Row */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Weather Conditions</Form.Label>
              <Form.Select
                value={accidentDetails.weather}
                onChange={(e) => handleChange('weather', e.target.value)}
                required
                disabled={disabled}
              >
                <option value="">Select weather condition</option>
                <option value="Clear">Clear</option>
                <option value="Rainy">Rainy</option>
                <option value="Foggy">Foggy</option>
                <option value="Snowy">Snowy</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Number of Vehicles Involved</Form.Label>
              <Form.Select
                value={accidentDetails.vehiclesInvolved}
                onChange={(e) => handleChange('vehiclesInvolved', parseInt(e.target.value))}
                required
                disabled={disabled}
              >
                <option value={1}>1 vehicle</option>
                <option value={2}>2 vehicles</option>
                <option value={3}>3 vehicles</option>
                <option value={4}>4 or more vehicles</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Yes/No Questions */}
        <div className="mb-4">
          <h5 className="mb-3">Additional Information</h5>
          <Row className="g-3">
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="mb-3">Were there any injuries?</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="injuries-yes"
                      label="Yes"
                      name="injuries"
                      checked={accidentDetails.hasInjuries}
                      onChange={() => handleChange('hasInjuries', true)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                    <Form.Check
                      type="radio"
                      id="injuries-no"
                      label="No"
                      name="injuries"
                      checked={!accidentDetails.hasInjuries}
                      onChange={() => handleChange('hasInjuries', false)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="mb-3">Was a police report filed?</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="police-yes"
                      label="Yes"
                      name="police"
                      checked={accidentDetails.hasPoliceReport}
                      onChange={() => handleChange('hasPoliceReport', true)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                    <Form.Check
                      type="radio"
                      id="police-no"
                      label="No"
                      name="police"
                      checked={!accidentDetails.hasPoliceReport}
                      onChange={() => handleChange('hasPoliceReport', false)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="mb-3">Were there any witnesses?</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="witness-yes"
                      label="Yes"
                      name="witness"
                      checked={accidentDetails.hasWitness}
                      onChange={() => handleChange('hasWitness', true)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                    <Form.Check
                      type="radio"
                      id="witness-no"
                      label="No"
                      name="witness"
                      checked={!accidentDetails.hasWitness}
                      onChange={() => handleChange('hasWitness', false)}
                      className="custom-radio"
                      disabled={disabled}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Description */}
        <Form.Group>
          <Form.Label>Accident Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Please provide a detailed description of how the accident occurred..."
            value={accidentDetails.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            disabled={disabled}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default AccidentDetailsForm; 