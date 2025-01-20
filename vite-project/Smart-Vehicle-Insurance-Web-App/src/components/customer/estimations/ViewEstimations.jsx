import React from "react";
import "./viewEstimations.css";

const ViewEstimations = () => {
  // Mock data for testing
  const estimations = [
    {
      id: 1,
      fileName: "Estimation1.pdf",
      fileType: "pdf",
      url: "https://www.africau.edu/images/default/sample.pdf", // Sample PDF URL
    },
    {
      id: 2,
      fileName: "Estimation2.png",
      fileType: "png",
      url: "https://www.w3schools.com/w3css/img_lights.jpg", // Sample PNG URL
    },
  ];

  return (
    <div className="view-estimations-container">
      <h1>View Estimations</h1>
      <div className="estimations-list">
        {estimations.map((estimation) => (
          <div key={estimation.id} className="estimation-item">
            <h3>{estimation.fileName}</h3>
            {estimation.fileType === "pdf" ? (
              <embed
                src={estimation.url}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            ) : (
              <img
                src={estimation.url}
                alt={estimation.fileName}
                className="estimation-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEstimations;
