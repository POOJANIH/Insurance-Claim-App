import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import SectionFour from "./SectionFour";
import SectionFive from "./SectionFive";
import "./accident.css";

const Accident = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(
    location.state?.step || 1 // Default to Step 1, use passed state if available
  );

  // Step details
  const steps = [
    { id: 1, label: "Step 1: Vehicle Info", component: <SectionOne /> },
    { id: 2, label: "Step 2: Upload Photos", component: <SectionTwo /> },
    { id: 3, label: "Step 3: Driver Details", component: <SectionThree /> },
    { id: 4, label: "Step 4: Accident Details", component: <SectionFour /> },
    { id: 5, label: "Step 5: Review & Submit", component: <SectionFive /> },
  ];

  // Navigation Handlers
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="accident-container">
      {/* Progress Bar */}
      <ProgressBar
        now={(currentStep / steps.length) * 100}
        label={steps[currentStep - 1].label}
        className="accident-progress-bar"
      />

      {/* Step Content */}
      <div className="step-content">{steps[currentStep - 1].component}</div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentStep === steps.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Accident;
