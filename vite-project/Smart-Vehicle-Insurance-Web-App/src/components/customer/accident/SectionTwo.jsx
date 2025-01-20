import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  OverlayTrigger,
  Popover,
  Container,
  Badge,
  ProgressBar,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import {
  BsCamera,
  BsTrash,
  BsUpload,
  BsEye,
  BsExclamationCircle,
  BsCheckCircle,
  BsPlusCircle,
} from "react-icons/bs";
import "./accident.css";

const SectionTwo = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("interior");
  const fileInputRef = useRef(null);

  const categories = {
    interior: {
      title: "Interior Photos",
      description: "Capture the interior damage of your vehicle",
      items: [
        {
          id: 1,
          label: "Interior Photo 1",
          example: "https://via.placeholder.com/300?text=Interior+1",
          description: "Dashboard and front seats view",
        },
        {
          id: 2,
          label: "Interior Photo 2",
          example: "https://via.placeholder.com/300?text=Interior+2",
          description: "Back seats and floor view",
        },
      ],
    },
    closeup: {
      title: "Close-up Photos",
      description: "Detailed shots of specific damage areas",
      items: [
        {
          id: 3,
          label: "Close-up Photo 1",
          example: "https://via.placeholder.com/300?text=Close-up+1",
          description: "Detailed view of primary damage",
        },
        {
          id: 4,
          label: "Close-up Photo 2",
          example: "https://via.placeholder.com/300?text=Close-up+2",
          description: "Secondary damage details",
        },
      ],
    },
    damage: {
      title: "Damage Photos",
      description: "Overall views of damaged areas",
      items: [
        {
          id: 5,
          label: "Damage Photo 1",
          example: "https://via.placeholder.com/300?text=Damage+1",
          description: "Front damage view",
        },
        {
          id: 6,
          label: "Damage Photo 2",
          example: "https://via.placeholder.com/300?text=Damage+2",
          description: "Side damage view",
        },
        {
          id: 7,
          label: "Damage Photo 3",
          example: "https://via.placeholder.com/300?text=Damage+3",
          description: "Rear damage view",
        },
        {
          id: 8,
          label: "Damage Photo 4",
          example: "https://via.placeholder.com/300?text=Damage+4",
          description: "Additional damage view",
        },
      ],
    },
    additional: {
      title: "Additional Photos",
      description: "Wide angle and supplementary photos",
      items: [
        {
          id: 9,
          label: "Wide View Photo 1",
          example: "https://via.placeholder.com/300?text=Wide+View+1",
          description: "Full vehicle context",
        },
        {
          id: 10,
          label: "Wide View Photo 2",
          example: "https://via.placeholder.com/300?text=Wide+View+2",
          description: "Surrounding area view",
        },
        {
          id: 11,
          label: "Extra Photo",
          example: "https://via.placeholder.com/300?text=Extra+Photo",
          description: "Any additional damage or context",
        },
      ],
    },
  };

  const handleTakePhoto = async (id) => {
    if (!navigator.mediaDevices || !navigator.geolocation) {
      alert("Your browser does not support camera or location access.");
      return;
    }

    try {
      await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL();

      stream.getTracks().forEach((track) => track.stop());

      setUploadedPhotos((prev) => [...prev, { id, src: photoDataUrl }]);
    } catch (error) {
      alert("Could not access camera or location.");
    }
  };

  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhotos((prev) => [...prev, { id, src: e.target.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (id) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const ExamplePopover = (example, description) => (
    <Popover id={`popover-${example}`} className="example-popover">
      <Popover.Header as="h3">Example Photo</Popover.Header>
      <Popover.Body>
        <img src={example} alt="Example" className="w-100 mb-2" />
        <p className="text-muted mb-0">{description}</p>
      </Popover.Body>
    </Popover>
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Photos submitted successfully!");
      setLoading(false);
    } catch (error) {
      alert("Error submitting photos");
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalRequired = Object.values(categories).reduce(
      (acc, category) => acc + category.items.length,
      0
    );
    return (uploadedPhotos.length / totalRequired) * 100;
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Damage Documentation</h1>
        <p className="lead text-muted mb-4">
          Please document all damaged areas of your vehicle
        </p>
        <ProgressBar
          now={getCompletionPercentage()}
          label={`${Math.round(getCompletionPercentage())}%`}
          variant="success"
          animated={loading}
          className="mb-4"
        />
        <Alert variant="info" className="d-flex align-items-center">
          <BsExclamationCircle className="me-2" />
          Take clear, well-lit photos from multiple angles for accurate damage
          assessment
        </Alert>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        {Object.entries(categories).map(([key, category]) => (
          <Tab
            key={key}
            eventKey={key}
            title={
              <div className="d-flex align-items-center">
                {category.title}
                <Badge bg="secondary" className="ms-2">
                  {
                    uploadedPhotos.filter((photo) =>
                      category.items.some((item) => item.id === photo.id)
                    ).length
                  }
                  /{category.items.length}
                </Badge>
              </div>
            }
          >
            <div className="p-3">
              <h4 className="mb-3">{category.description}</h4>
              <Row xs={1} md={2} lg={3} className="g-4">
                {category.items.map((item) => {
                  const uploadedPhoto = uploadedPhotos.find(
                    (photo) => photo.id === item.id
                  );
                  return (
                    <Col key={item.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{item.label}</h6>
                          {uploadedPhoto && (
                            <Badge bg="success">
                              <BsCheckCircle className="me-1" />
                              Uploaded
                            </Badge>
                          )}
                        </Card.Header>
                        <Card.Img
                          variant="top"
                          src={uploadedPhoto?.src || item.example}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Card.Body>
                          <Card.Text className="text-muted mb-3">
                            {item.description}
                          </Card.Text>
                          <div className="d-grid gap-2">
                            <div className="d-flex gap-2">
                              <Button
                                variant={
                                  uploadedPhoto ? "outline-success" : "primary"
                                }
                                className="flex-grow-1"
                                onClick={() => handleTakePhoto(item.id)}
                              >
                                <BsCamera className="me-2" />
                                {uploadedPhoto ? "Retake" : "Take Photo"}
                              </Button>
                              <input
                                type="file"
                                accept="image/*"
                                className="d-none"
                                ref={fileInputRef}
                                onChange={(e) => handleFileUpload(item.id, e)}
                              />
                              <Button
                                variant="outline-primary"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <BsUpload />
                              </Button>
                            </div>
                            <div className="d-flex gap-2">
                              <OverlayTrigger
                                trigger="click"
                                placement="auto"
                                overlay={ExamplePopover(
                                  item.example,
                                  item.description
                                )}
                              >
                                <Button
                                  variant="outline-secondary"
                                  className="flex-grow-1"
                                >
                                  <BsEye className="me-2" />
                                  View Example
                                </Button>
                              </OverlayTrigger>
                              {uploadedPhoto && (
                                <Button
                                  variant="outline-danger"
                                  onClick={() => handleRemovePhoto(item.id)}
                                >
                                  <BsTrash />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Tab>
        ))}
      </Tabs>

      <div className="text-center mt-5">
        <Button
          size="lg"
          variant="success"
          onClick={handleSubmit}
          disabled={loading || uploadedPhotos.length === 0}
          className="px-5"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Submitting...
            </>
          ) : (
            <>
              <BsPlusCircle className="me-2" />
              Submit All Photos
            </>
          )}
        </Button>
      </div>
    </Container>
  );
};

export default SectionTwo;
