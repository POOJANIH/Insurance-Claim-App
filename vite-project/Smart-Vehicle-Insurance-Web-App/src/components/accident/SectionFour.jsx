import React, { useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import "./accident.css";

const SectionFour = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const documents = files.map((file) => ({
            id: Math.random(),
            name: file.name,
        }));
        setUploadedDocuments((prev) => [...prev, ...documents]);
    };

    const handleRemoveDocument = (id) => {
        setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    return (
        <div className="section-four-container">
            <h2>Upload Other Documents</h2>
            <p>Please upload any other relevant documents related to the accident, such as insurance papers or police reports.</p>
            
            <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                multiple
                onChange={handleFileChange}
            />
            <Row xs={1} md={2} className="g-4 mt-3">
                {uploadedDocuments.map((doc) => (
                    <Col key={doc.id}>
                        <Card className="upload-card">
                            <Card.Body>
                                <Card.Title>{doc.name}</Card.Title>
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveDocument(doc.id)}
                                >
                                    Remove
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SectionFour;
