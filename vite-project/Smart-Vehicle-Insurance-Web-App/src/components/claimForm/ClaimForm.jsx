import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";
import "./claimForm.css"; // Importing the CSS file

function ClaimForm() {
  const { Formik } = formik;
  const [policyData, setPolicyData] = useState(null); // State to store fetched policy data

  const schema = yup.object().shape({
    policyNumber: yup.string().required("Policy number is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip code is required"),
    policyholderDriving: yup
      .string()
      .required("Please specify if the policyholder was driving"),
    terms: yup.bool().required().oneOf([true], "You must accept the terms"),
  });

  const fetchPolicyData = async (policyNumber) => {
    // Replace with your API endpoint
    const response = await fetch(`/api/policies/${policyNumber}`);
    const data = await response.json();
    return data;
  };

  const handlePolicyNumberChange = async (event, setFieldValue) => {
    const policyNumber = event.target.value;
    setFieldValue("policyNumber", policyNumber);

    if (policyNumber) {
      const data = await fetchPolicyData(policyNumber);
      if (data) {
        setPolicyData(data);
        setFieldValue("firstName", data.firstName || "");
        setFieldValue("lastName", data.lastName || "");
        setFieldValue("city", data.city || "");
        setFieldValue("state", data.state || "");
        setFieldValue("zip", data.zip || "");
        setFieldValue("policyholderDriving", data.policyholderDriving || "");
      }
    } else {
      setPolicyData(null);
      setFieldValue("firstName", "");
      setFieldValue("lastName", "");
      setFieldValue("city", "");
      setFieldValue("state", "");
      setFieldValue("zip", "");
      setFieldValue("policyholderDriving", "");
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        console.log("Form Data:", values);
        alert(JSON.stringify(values, null, 2));
      }}
      initialValues={{
        policyNumber: "",
        firstName: "",
        lastName: "",
        city: "",
        state: "",
        zip: "",
        policyholderDriving: "",
        terms: false,
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikPolicyNumber"
            >
              <Form.Label>Policy Number</Form.Label>
              <Form.Control
                type="text"
                name="policyNumber"
                value={values.policyNumber}
                onChange={(event) =>
                  handlePolicyNumberChange(event, setFieldValue)
                }
                isInvalid={touched.policyNumber && !!errors.policyNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.policyNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik01">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                isInvalid={touched.firstName && !!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik02">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                isInvalid={touched.lastName && !!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik03">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                isInvalid={touched.city && !!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik04">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                name="state"
                value={values.state}
                onChange={handleChange}
                isInvalid={touched.state && !!errors.state}
              />
              <Form.Control.Feedback type="invalid">
                {errors.state}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik05">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zip"
                name="zip"
                value={values.zip}
                onChange={handleChange}
                isInvalid={touched.zip && !!errors.zip}
              />
              <Form.Control.Feedback type="invalid">
                {errors.zip}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormikDriving">
              <Form.Label>Was the policyholder driving?</Form.Label>
              <Form.Select
                name="policyholderDriving"
                value={values.policyholderDriving}
                onChange={handleChange}
                isInvalid={
                  touched.policyholderDriving && !!errors.policyholderDriving
                }
              >
                <option value="">Choose...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.policyholderDriving}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Check
              required
              name="terms"
              label="Agree to terms and conditions"
              onChange={handleChange}
              isInvalid={!!errors.terms}
              feedback={errors.terms}
              feedbackType="invalid"
              id="validationFormikTerms"
            />
          </Form.Group>
          <Button type="submit">Submit form</Button>
        </Form>
      )}
    </Formik>
  );
}

export default ClaimForm;
