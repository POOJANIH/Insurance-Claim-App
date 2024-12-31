import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./claimForm.css";

const ClaimForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Claim submitted successfully!");
  };

  return (
    <div className="claim-form-container">
      <h1>Submit Your Claim</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Claim Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default ClaimForm;
