import React, { useState } from "react";
import { Container, Card, Form, Button, Table, Spinner } from "react-bootstrap";
import "./insuranceClaimForms.css";

const InsuranceClaimForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/insurance/claim-forms/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setForms([...forms, data]);
      }
    } catch (error) {
      console.error("Error uploading claim form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formId) => {
    try {
      const response = await fetch(
        `/api/insurance/claim-forms/${formId}/download/`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `claim-form-${formId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error("Error downloading claim form:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Claim Forms</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Upload Claim Form</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} required />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
            </Button>
          </Form>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Form ID</th>
                <th>File Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id}>
                  <td>{form.id}</td>
                  <td>{form.file_name}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(form.id)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InsuranceClaimForms;
