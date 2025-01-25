# Insurance App API Documentation

## Authentication Endpoints

### Login
POST /api/auth/login/
- Input:
```json
{
    "email": "user@example.com",
    "password": "userpassword"
}
```
- Output:
```json
{
    "access": "JWT_ACCESS_TOKEN",
    "refresh": "JWT_REFRESH_TOKEN"
}
```

### Refresh Token
POST /api/auth/refresh/
- Input:
```json
{
    "refresh": "JWT_REFRESH_TOKEN"
}
```
- Output:
```json
{
    "access": "NEW_JWT_ACCESS_TOKEN"
}
```

## User Management

### Get Current User
GET /api/users/me/
- Headers: Authorization: Bearer JWT_TOKEN
- Output:
```json
{
    "id": "uuid",
    "username": "username",
    "email": "user@example.com",
    "phone_number": "1234567890",
    "role": "Customer/Admin/Garage/InsuranceStaff",
    "nic": "NIC_number",
    "dl_number": "DL_number",
    "first_name": "First",
    "last_name": "Last"
}
```

### Create User (Admin Only)
POST /api/users/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "username": "username",
    "email": "user@example.com",
    "password": "password",
    "password2": "password",
    "phone_number": "1234567890",
    "role": "Customer/Admin/Garage/InsuranceStaff",
    "nic": "NIC_number",
    "dl_number": "DL_number",
    "first_name": "First",
    "last_name": "Last"
}
```

## Vehicle Management

### List Vehicles
GET /api/vehicles/
- Headers: Authorization: Bearer JWT_TOKEN
- Query Params: None
- Output:
```json
[
    {
        "id": "uuid",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "chassis_number": "123456",
        "engine_number": "789012",
        "license_plate": "ABC123",
        "vehicle_photos": ["photo_uuid1", "photo_uuid2"],
        "owner_email": "user@example.com",
        "owner_name": "Full Name"
    }
]
```

### Create Vehicle
POST /api/vehicles/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "chassis_number": "123456",
    "engine_number": "789012",
    "license_plate": "ABC123"
}
```

### Get Vehicle Profile
GET /api/vehicles/{id}/profile/
- Headers: Authorization: Bearer JWT_TOKEN
- Output:
```json
{
    "vehicle": {
        "id": "uuid",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "chassis_number": "123456",
        "engine_number": "789012",
        "license_plate": "ABC123",
        "vehicle_photos": ["photo_uuid1", "photo_uuid2"],
        "owner_email": "user@example.com",
        "owner_name": "Full Name",
        "created_at": "2024-01-24T14:30:00Z",
        "updated_at": "2024-01-24T14:30:00Z"
    },
    "cases": [
        {
            "id": "uuid",
            "case_name": "ABC123 - 2024-01-24 - 14:30",
            "case_status": "ACCIDENT_REPORT",
            "accident_date": "2024-01-24",
            "accident_time": "14:30",
            "accident_location": "123 Main St",
            "weather_conditions": "CLEAR",
            "number_of_vehicles": 2,
            "injuries": false,
            "police_report": true,
            "witness": false,
            "description": "Accident description",
            "case_severity": "MINOR",
            "estimate": 1500.50,
            "case_created_at": "2024-01-24T14:30:00Z",
            "case_updated_at": "2024-01-24T14:30:00Z"
        }
    ]
}
```

### Add Vehicle Photos
POST /api/vehicles/{id}/add_photos/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "photos": ["photo_uuid1", "photo_uuid2"]
}
```

## Case Management

### Create Case (Registered User)
POST /api/cases/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "vehicle": "vehicle_uuid",
    "accident_photos": {
        "front": ["uuid1"],
        "back": ["uuid2"],
        "left": ["uuid3"],
        "right": ["uuid4"],
        "interior": ["uuid5"],
        "closeup": ["uuid6"],
        "damage": ["uuid7"],
        "additional_photos": ["uuid8"],
        "property_damange": ["uuid9"]
    },
    "accident_date": "2024-01-24",
    "accident_time": "14:30",
    "accident_location": "123 Main St",
    "weather_conditions": "CLEAR",
    "number_of_vehicles": 2,
    "injuries": false,
    "police_report": true,
    "witness": false,
    "description": "Accident description"
}
```

### Create Case (Unregistered User)
POST /api/cases/unregistered/create/
- Input:
```json
{
    "license_plate": "ABC123",
    "accident_photos": {
        "front": ["uuid1"],
        "back": ["uuid2"],
        "left": ["uuid3"],
        "right": ["uuid4"],
        "damage": ["uuid5"]
    },
    "accident_date": "2024-01-24",
    "accident_time": "14:30",
    "accident_location": "123 Main St",
    "weather_conditions": "CLEAR",
    "number_of_vehicles": 2,
    "injuries": false,
    "police_report": true,
    "witness": false,
    "description": "Accident description"
}
```

### List Cases
GET /api/cases/
- Headers: Authorization: Bearer JWT_TOKEN
- Output:
```json
[
    {
        "id": "uuid",
        "case_name": "ABC123 - 2024-01-24 - 14:30",
        "case_status": "ACCIDENT_REPORT",
        "user_email": "user@example.com",
        "user_name": "Full Name",
        "vehicle_details": {
            "id": "uuid",
            "make": "Toyota",
            "model": "Camry",
            "year": 2020,
            "license_plate": "ABC123",
            "owner_email": "user@example.com",
            "owner_name": "Full Name"
        },
        "accident_photos": {
            "front": ["uuid1"],
            "back": ["uuid2"],
            "left": ["uuid3"],
            "right": ["uuid4"],
            "interior": ["uuid5"],
            "closeup": ["uuid6"],
            "damage": ["uuid7"],
            "additional_photos": ["uuid8"],
            "property_damange": ["uuid9"]
        },
        "accident_date": "2024-01-24",
        "accident_time": "14:30",
        "accident_location": "123 Main St",
        "weather_conditions": "CLEAR",
        "number_of_vehicles": 2,
        "injuries": false,
        "police_report": true,
        "witness": false,
        "description": "Accident description",
        "case_severity": "MINOR",
        "claim_form": "form_uuid",
        "garage_details": {
            "id": "uuid",
            "name": "Garage Name",
            "contact_number": "1234567890",
            "email": "garage@example.com",
            "is_active": true
        },
        "estimate": 1500.50,
        "case_created_at": "2024-01-24T14:30:00Z",
        "case_updated_at": "2024-01-24T14:30:00Z"
    }
]
```

### Upload Claim Form
POST /api/cases/{id}/upload_claim_form/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "claim_form_uuid": "form_uuid"
}
```

### Assign Garage (Staff Only)
POST /api/cases/{id}/assign_garage/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "garage_id": "garage_uuid"
}
```

### Submit Estimate (Garage Only)
POST /api/cases/{id}/submit_estimate/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "estimate": 1500.50
}
```

### Evaluate Severity (Staff Only)
POST /api/cases/{id}/evaluate_severity/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "severity": "MINOR/MAJOR"
}
```

### Get Estimate Details
GET /api/cases/{id}/estimate_details/
- Headers: Authorization: Bearer JWT_TOKEN
- Output:
```json
{
    "case_id": "uuid",
    "case_name": "ABC123 - 2024-01-24 - 14:30",
    "garage_name": "Garage Name",
    "garage_contact": "1234567890",
    "estimate_amount": 1500.50,
    "status": "CLAIM_ESTIMATE_GIVEN_BY_GARAGE",
    "last_updated": "2024-01-24T14:30:00Z"
}
```

## Garage Management

### List Garages
GET /api/garages/
- Headers: Authorization: Bearer JWT_TOKEN
- Output:
```json
[
    {
        "id": "uuid",
        "name": "Garage Name",
        "address": "456 Service St",
        "contact_number": "1234567890",
        "email": "garage@example.com",
        "user_email": "user@example.com",
        "user_name": "Full Name",
        "is_active": true
    }
]
```

### Create Garage (Staff Only)
POST /api/garages/
- Headers: Authorization: Bearer JWT_TOKEN
- Input:
```json
{
    "name": "Garage Name",
    "address": "456 Service St",
    "contact_number": "1234567890",
    "email": "garage@example.com",
    "user": "user_uuid"
}
```

### Toggle Garage Status (Staff Only)
POST /api/garages/{id}/toggle_active/
- Headers: Authorization: Bearer JWT_TOKEN
- No Input Required
- Output: Updated garage details

## File Management

### Upload File
POST /api/files/
- Headers: Authorization: Bearer JWT_TOKEN
- Input: Multipart Form Data
```
file: (file)
file_type: "VEHICLE_PHOTO/ACCIDENT_PHOTO/CLAIM_FORM/OTHER"
original_name: "filename.jpg"
```
- Output:
```json
{
    "id": "uuid",
    "file_url": "http://domain.com/media/path/to/file",
    "file_type": "VEHICLE_PHOTO",
    "original_name": "filename.jpg",
    "mime_type": "image/jpeg",
    "size": 1024,
    "uploaded_at": "2024-01-24T14:30:00Z"
}
```

### List Files
GET /api/files/
- Headers: Authorization: Bearer JWT_TOKEN
- Query Params: ?type=VEHICLE_PHOTO (optional)
- Output:
```json
[
    {
        "id": "uuid",
        "file_url": "http://domain.com/media/path/to/file",
        "file_type": "VEHICLE_PHOTO",
        "original_name": "filename.jpg",
        "mime_type": "image/jpeg",
        "size": 1024,
        "uploaded_at": "2024-01-24T14:30:00Z"
    }
]
```

## Enums and Constants

### Case Status Values
- ACCIDENT_REPORT: Initial stage when case is created
- ACCIDENT_REPORT_EVALUATED: After staff evaluates the severity
- CLAIM_CREATED: After user uploads claim form
- CLAIM_ASSIGNED_TO_GARAGE: After staff assigns a garage
- CLAIM_ESTIMATE_GIVEN_BY_GARAGE: After garage submits estimate

### Case Severity Values
- MINOR: Minor damage
- MAJOR: Major damage

### Weather Conditions
- CLEAR: Clear weather
- RAINY: Rainy weather
- FOGGY: Foggy weather
- SNOWY: Snowy weather
- OTHER: Other weather conditions

### File Types
- VEHICLE_PHOTO: Vehicle photos
- ACCIDENT_PHOTO: Accident scene photos
- CLAIM_FORM: Insurance claim form
- OTHER: Other document types

### User Roles
- Customer: Regular user who owns vehicles
- Admin: System administrator
- Garage: Garage staff user
- InsuranceStaff: Insurance company staff

Note: All endpoints that require authentication should include the Authorization header with a valid JWT token:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... 