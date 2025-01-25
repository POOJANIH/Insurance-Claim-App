import { Button } from 'react-bootstrap';

function AccidentDetailsSection({ onNext, onBack }) {
  return (
    <div>
      <h4>Accident Details</h4>
      {/* Accident details form will go here */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={onNext}>
          Next: Review
        </Button>
      </div>
    </div>
  );
}

export default AccidentDetailsSection; 