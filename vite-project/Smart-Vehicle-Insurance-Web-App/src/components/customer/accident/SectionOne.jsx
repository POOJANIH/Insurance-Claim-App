import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Container,
  ProgressBar,
  Badge,
  Form,
} from "react-bootstrap";
import {
  BsCamera,
  BsTrash,
  BsUpload,
  BsPlayCircle,
  BsImage,
  BsEye,
} from "react-icons/bs";
import "./accident.css";

const SectionOne = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [modalExample, setModalExample] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const guidance = [
    {
      id: 1,
      label: "Front View of the Vehicle",
      example: "https://via.placeholder.com/300?text=Front+View",
      description:
        "Capture the entire front of your vehicle, including license plate",
    },
    {
      id: 2,
      label: "Rear View of the Vehicle",
      example: "https://via.placeholder.com/300?text=Rear+View",
      description: "Include the entire back of your vehicle and license plate",
    },
    {
      id: 3,
      label: "Left Side View",
      example: "https://via.placeholder.com/300?text=Left+Side",
      description: "Full left side view from front to back",
    },
    {
      id: 4,
      label: "Right Side View",
      example: "https://via.placeholder.com/300?text=Right+Side",
      description: "Full right side view from front to back",
    },
  ];

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

      setUploadedPhotos((prev) => [
        ...prev.filter((photo) => photo.id !== id),
        { id, src: photoDataUrl },
      ]);
    } catch (error) {
      alert("Could not access camera or location.");
    }
  };

  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhotos((prev) => [
          ...prev.filter((photo) => photo.id !== id),
          { id, src: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedVideo({
          src: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (id) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
  };

  const handleShowExample = (example) => {
    setModalExample(example);
  };

  const handleCloseModal = () => {
    setModalExample(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await mockApiCall({ photos: uploadedPhotos, video: uploadedVideo });
      alert("Media submitted successfully!");
    } catch (error) {
      alert("Failed to submit media. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mockApiCall = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Submitted data:", data);
        resolve();
      }, 2000);
    });
  };

  const getCompletionPercentage = () => {
    return (uploadedPhotos.length / guidance.length) * 100;
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Vehicle Documentation</h1>
        <p className="lead text-muted">
          Capture photos and video of your vehicle damage
        </p>
        <ProgressBar
          now={getCompletionPercentage()}
          label={`${Math.round(getCompletionPercentage())}%`}
          className="mt-4"
          variant="success"
          animated={loading}
        />
      </div>

      <Row xs={1} md={2} className="g-4 mb-5">
        {guidance.map((item) => {
          const isUploaded = uploadedPhotos.some(
            (photo) => photo.id === item.id
          );
          return (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{item.label}</h5>
                  {isUploaded && <Badge bg="success">✓ Uploaded</Badge>}
                </Card.Header>
                <Card.Img
                  variant="top"
                  src={
                    uploadedPhotos.find((photo) => photo.id === item.id)?.src ||
                    item.example
                  }
                  className="example-image"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Text className="text-muted mb-3">
                    {item.description}
                  </Card.Text>
                  <div className="d-grid gap-2">
                    <div className="d-flex gap-2">
                      <Button
                        variant={isUploaded ? "outline-success" : "primary"}
                        className="flex-grow-1"
                        onClick={() => handleTakePhoto(item.id)}
                      >
                        <BsCamera className="me-2" />
                        Take Photo
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
                      <Button
                        variant="outline-secondary"
                        className="flex-grow-1"
                        onClick={() => handleShowExample(item.example)}
                      >
                        <BsEye className="me-2" />
                        View Example
                      </Button>
                      {isUploaded && (
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

      {/* Video Upload Section */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Vehicle Damage Video (Optional)</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-3 align-items-center">
            <div className="flex-grow-1">
              {uploadedVideo ? (
                <div className="d-flex align-items-center">
                  <BsPlayCircle className="me-2" size={24} />
                  <span>{uploadedVideo.name}</span>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Upload a video showing the damage to your vehicle (max 30
                  seconds)
                </p>
              )}
            </div>
            <div className="d-flex gap-2">
              <input
                type="file"
                accept="video/*"
                className="d-none"
                ref={videoInputRef}
                onChange={handleVideoUpload}
              />
              <Button
                variant="outline-primary"
                onClick={() => videoInputRef.current.click()}
              >
                <BsUpload className="me-2" />
                Upload Video
              </Button>
              {uploadedVideo && (
                <Button variant="outline-danger" onClick={handleRemoveVideo}>
                  <BsTrash />
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button
          size="lg"
          variant="success"
          onClick={handleSubmit}
          disabled={loading || uploadedPhotos.length < guidance.length}
          className="px-5"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            "Submit All Media"
          )}
        </Button>
      </div>

      <Modal show={!!modalExample} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Example Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {modalExample && (
            <img
              src={modalExample}
              alt="Example"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SectionOne;
