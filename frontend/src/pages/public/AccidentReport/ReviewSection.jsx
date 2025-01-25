import { Button } from 'react-bootstrap';

function ReviewSection({ onBack, formData }) {
  return (
    <div>
      <h4>Review Your Report</h4>
      {/* Review content will go here */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="success">
          Submit Report
        </Button>
      </div>
    </div>
  );
}

export default ReviewSection; 