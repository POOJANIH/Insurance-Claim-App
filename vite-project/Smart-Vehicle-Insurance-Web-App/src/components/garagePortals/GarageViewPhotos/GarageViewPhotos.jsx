import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./garageViewPhotos.css";

const GarageViewPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { claimId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/claims/${claimId}/photos/`);
        if (response.ok) {
          const data = await response.json();
          setPhotos(data);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (claimId) {
      fetchPhotos();
    }
  }, [claimId]);

  if (loading) {
    return (
      <div className="photos-container">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  return (
    <div className="photos-container">
      <Container className="mt-4">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>Claim Photos</Card.Title>
            <Row className="g-4">
              {photos.map((photo, index) => (
                <Col md={4} key={index}>
                  <div
                    className="photo-card"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.image_url}
                      alt={`Claim ${claimId} - Photo ${index + 1}`}
                      className="photo-thumbnail"
                    />
                    <div className="photo-info">
                      <p className="upload-date">
                        {new Date(photo.upload_date).toLocaleDateString()}
                      </p>
                      {photo.description && (
                        <p className="description">{photo.description}</p>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Modal
          show={selectedPhoto !== null}
          onHide={() => setSelectedPhoto(null)}
          size="lg"
          centered
          className="photo-modal"
        >
          <Modal.Body>
            {selectedPhoto && (
              <img
                src={selectedPhoto.image_url}
                alt="Full size"
                className="modal-image"
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default GarageViewPhotos;
