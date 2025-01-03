import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./accident.css";

const SectionFive = () => {
    const [answers, setAnswers] = useState({
        description: "",
        witnesses: "",
        additionalInfo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Answers:", answers);
        // Here you can add logic to handle form submission, e.g., send to API
    };

    return (
        <div className="section-five-container">
            <h2>Questions Related to the Accident</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDescription">
                    <Form.Label>Brief Description of the Accident</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={answers.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formWitnesses">
                    <Form.Label>Were there any witnesses? If yes, please provide their details.</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="witnesses"
                        value={answers.witnesses}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formAdditionalInfo">
                    <Form.Label>Any additional information?</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="additionalInfo"
                        value={answers.additionalInfo}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="success" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default SectionFive;
