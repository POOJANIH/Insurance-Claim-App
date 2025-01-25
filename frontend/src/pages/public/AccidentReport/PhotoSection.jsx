import { Button } from 'react-bootstrap';

function PhotoSection({ onNext, onBack }) {
  return (
    <div>
      <h4>Photo Upload</h4>
      {/* Photo upload implementation will go here */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={onNext}>
          Next: Accident Details
        </Button>
      </div>
    </div>
  );
}

export default PhotoSection; 