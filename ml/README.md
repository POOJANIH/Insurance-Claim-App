# Insurance Damage Classification API

This is a FastAPI-based API that classifies vehicle damage as either major or minor using a deep learning model.

## Setup and Running Instructions

### Prerequisites
- Python 3.12 or higher
- pip (Python package installer)

### Installation

1. Create and activate a virtual environment:
```bash
# Create virtual environment
python@3.12 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

1. Ensure you have the model file `damage_model.h5` in the `models` directory.

2. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8080`

### API Endpoints

- `GET /`: Health check endpoint
- `POST /predict`: Upload an image for damage classification
  - Accepts form data with an image file
  - Returns damage classification (Major/Minor) with confidence score

### Project Structure
```
.
├── main.py           # FastAPI application
├── models/           # Directory for model files
│   └── damage_model.h5
└── requirements.txt  # Project dependencies
```
