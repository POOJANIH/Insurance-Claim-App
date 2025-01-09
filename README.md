# Insurance-Claim-App

# Vehicle Insurance Application

This project is a comprehensive vehicle insurance application, featuring a React-based frontend and a Django-based backend. The application allows users to register, log in, report accidents, check claim statuses, update account details, and view garage estimations. A QR code feature enables users to log in via their insurance card.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Backend Models](#backend-models)
- [QR Code Functionality](#qr-code-functionality)

## Features

- User registration and authentication.
- QR code generation for user profiles.
- Vehicle management.
- Accident reporting and claims.
- Notifications.
- Garage quotes and estimations.
- Secure access for insurance staff, customers, and garages.

## Technologies Used

- **Frontend:** React, Vite, Bootstrap
- **Backend:** Django, Django REST Framework
- **Database:** MySQL
- **QR Code Generation:** Python qrcode library
- **Authentication:** JWT (JSON Web Tokens)

### Prerequisites

- Node.js
- Python 3
- MySQL

### Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows, use `env\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure the database in `backend/settings.py`.
5. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication

- **POST** `/api/register/` - User registration
- **POST** `/api/login/` - User login

### Vehicles

- **GET** `/api/vehicles/` - Retrieve all vehicles

## Backend Models

- **UserProfile:** Extended user details with roles and QR code.
- **Vehicle:** Stores vehicle details linked to users.
- **Claim:** Tracks accident claims and statuses.
- **Notification:** Stores user notifications.
- **GarageQuote:** Tracks estimates from garages.

## QR Code Functionality

- Each user is assigned a unique QR code upon registration.
- The QR code is stored as a base64-encoded string in the database.
- Scanning the QR code redirects users to their account page for authentication.

---
