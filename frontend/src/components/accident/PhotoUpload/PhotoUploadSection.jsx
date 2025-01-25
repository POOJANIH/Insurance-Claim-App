import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Tab, 
  Alert, 
  Row, 
  Col, 
  Badge 
} from 'react-bootstrap';
import { BsExclamationCircle } from 'react-icons/bs';
import PhotoUploadCard from './PhotoUploadCard';

function PhotoUploadSection({ 
  photos, 
  onTakePhoto, 
  onFileUpload, 
  onRemovePhoto, 
  onViewExample,
  uploadProgress,
  disabled = false
}) {
  const [activeTab, setActiveTab] = useState('vehicle');

  const sections = {
    vehicle: {
      title: "Vehicle Documentation",
      description: "Capture clear photos of your entire vehicle",
      alert: "Take photos in good lighting conditions. Make sure the entire vehicle is visible.",
      items: [
        { 
          key: 'front',
          label: 'Front View',
          description: 'Full front view including license plate',
          max: 1,
          example: 'https://via.placeholder.com/300?text=Front+View',
          required: true
        },
        { 
          key: 'back',
          label: 'Back View',
          description: 'Full rear view including license plate',
          max: 1,
          example: 'https://via.placeholder.com/300?text=Back+View',
          required: true
        },
        { 
          key: 'left',
          label: 'Left Side',
          description: 'Complete left side view from front to back',
          max: 1,
          example: 'https://via.placeholder.com/300?text=Left+Side',
          required: true
        },
        { 
          key: 'right',
          label: 'Right Side',
          description: 'Complete right side view from front to back',
          max: 1,
          example: 'https://via.placeholder.com/300?text=Right+Side',
          required: true
        }
      ]
    },
    damage: {
      title: "Damage Documentation",
      description: "Document all damaged areas in detail",
      alert: "Take close-up shots of all visible damage. Our AI system will analyze the photos to assess damage severity.",
      items: [
        { 
          key: 'interior',
          label: 'Interior Damage',
          description: 'Photos of any interior damage (dashboard, seats, etc.)',
          max: 2,
          example: 'https://via.placeholder.com/300?text=Interior',
          required: false
        },
        { 
          key: 'closeup',
          label: 'Close-up Damage',
          description: 'Detailed close-up shots of specific damage areas. These will be analyzed by our AI system.',
          max: 2,
          example: 'https://via.placeholder.com/300?text=Closeup',
          required: true
        },
        { 
          key: 'damage',
          label: 'Overall Damage',
          description: 'Wider shots showing the full extent of damage. These will be analyzed by our AI system.',
          max: 4,
          example: 'https://via.placeholder.com/300?text=Damage',
          required: true
        }
      ]
    },
    additional: {
      title: "Additional Documentation",
      description: "Supplementary photos and property damage",
      alert: "Include photos of any property damage or additional context that might be relevant.",
      items: [
        { 
          key: 'additional_photos',
          label: 'Additional Photos',
          description: 'Any other relevant photos of the accident scene',
          max: 3,
          example: 'https://via.placeholder.com/300?text=Additional',
          required: false
        },
        { 
          key: 'property_damage',
          label: 'Property Damage',
          description: 'Photos of any damaged property other than vehicles',
          max: -1,
          example: 'https://via.placeholder.com/300?text=Property',
          required: false
        }
      ]
    }
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      <Alert variant="info" className="d-flex align-items-center mb-4">
        <BsExclamationCircle className="me-2" size={20} />
        <div>
          <strong>Photo Documentation Guidelines:</strong>
          <ul className="mb-0 mt-2">
            <li>Take clear, well-lit photos</li>
            <li>Ensure all damage is clearly visible</li>
            <li>Include reference objects for scale when possible</li>
            <li>Photos should be in focus and not blurry</li>
          </ul>
        </div>
      </Alert>

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        {Object.entries(sections).map(([key, section]) => (
          <Tab
            key={key}
            eventKey={key}
            title={
              <div className="d-flex align-items-center">
                {section.title}
                <Badge bg="secondary" className="ms-2">
                  {section.items.filter(item => 
                    photos[item.key] && photos[item.key].length > 0
                  ).length}
                  /{section.items.length}
                </Badge>
              </div>
            }
          >
            <div className="p-3">
              <div className="mb-4">
                <h4>{section.description}</h4>
                <Alert variant="info" className="mt-3">
                  <BsExclamationCircle className="me-2" />
                  {section.alert}
                </Alert>
              </div>

              <Row xs={1} md={2} className="g-4">
                {section.items.map(item => (
                  <Col key={item.key}>
                    <PhotoUploadCard
                      id={item.key}
                      label={item.label}
                      description={item.description}
                      example={item.example}
                      maxPhotos={item.max}
                      uploadedPhotos={photos[item.key] || []}
                      onTakePhoto={onTakePhoto}
                      onFileUpload={onFileUpload}
                      onRemovePhoto={onRemovePhoto}
                      onViewExample={onViewExample}
                      uploadProgress={uploadProgress[item.key]}
                      required={item.required}
                      disabled={disabled}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default PhotoUploadSection; 