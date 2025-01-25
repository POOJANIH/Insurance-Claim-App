import React, { useRef } from 'react';
import { Card, Button, Form, Badge, Row, Col, ProgressBar } from 'react-bootstrap';
import { BsCamera, BsUpload, BsEye, BsTrash } from 'react-icons/bs';

function PhotoUploadCard({ 
  id, 
  label, 
  description, 
  example, 
  maxPhotos, 
  uploadedPhotos, 
  onTakePhoto, 
  onFileUpload, 
  onRemovePhoto, 
  onViewExample,
  required,
  uploadProgress 
}) {
  const fileInputRef = useRef(null);
  const isUploaded = uploadedPhotos?.length > 0;
  const isMaxReached = maxPhotos !== -1 && uploadedPhotos?.length >= maxPhotos;
  const photoCount = uploadedPhotos?.length || 0;
  const remainingPhotos = maxPhotos === -1 ? '∞' : maxPhotos - photoCount;
  const isUploading = uploadProgress > 0 && uploadProgress < 100;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            {label}
            {required && <Badge bg="danger" className="ms-2">Required</Badge>}
          </h5>
        </div>
        <div className="d-flex align-items-center">
          {isUploaded && <Badge bg="success" className="me-2">✓</Badge>}
          <small className="text-muted">
            {photoCount}/{maxPhotos === -1 ? '∞' : maxPhotos} photos
          </small>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text className="text-muted mb-3">
          {description}
          {maxPhotos !== -1 && (
            <small className="d-block mt-1">
              {remainingPhotos} photo{remainingPhotos !== 1 ? 's' : ''} remaining
            </small>
          )}
        </Card.Text>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mb-3">
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`}
              variant="info"
              animated
            />
          </div>
        )}

        {/* Thumbnails Section */}
        {isUploaded && (
          <div className="mb-3">
            <Row xs={3} className="g-2">
              {uploadedPhotos.map((photo, index) => (
                <Col key={index}>
                  <div className="position-relative" style={{ aspectRatio: '1' }}>
                    <img
                      src={photo.url}
                      alt={`${label} ${index + 1}`}
                      className="w-100 h-100 object-fit-cover rounded"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onViewExample(photo.url)}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1 p-0"
                      style={{ width: '20px', height: '20px', minWidth: 'unset' }}
                      onClick={() => onRemovePhoto(id, index)}
                    >
                      <BsTrash size={12} />
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div className="d-grid gap-2">
          <div className="d-flex gap-2">
            <Button
              variant={isUploaded ? "outline-success" : "primary"}
              className="flex-grow-1"
              onClick={() => onTakePhoto(id)}
              disabled={isMaxReached || isUploading}
            >
              <BsCamera className="me-2" />
              Take Photo
            </Button>
            <input
              type="file"
              accept="image/*"
              className="d-none"
              ref={fileInputRef}
              onChange={(e) => onFileUpload(id, e.target.files)}
              multiple={maxPhotos !== 1}
              disabled={isUploading}
            />
            <Button
              variant="outline-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isMaxReached || isUploading}
            >
              <BsUpload />
            </Button>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="flex-grow-1"
              onClick={() => onViewExample(example)}
            >
              <BsEye className="me-2" />
              View Example
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PhotoUploadCard; 