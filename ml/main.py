from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os


app = FastAPI(title="Damage Classification API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the model at startup
MODEL_PATH = "models"  # Directory containing your .h5 files


def load_latest_model():
    """Load the file  alled damage_model.h5."""
    model_path = os.path.join(MODEL_PATH, 'damage_model.h5')
    if not os.path.exists(model_path):
        raise FileNotFoundError("damage_model.h5 not found in models directory")
    return tf.keras.models.load_model(model_path)

def preprocess_image(image_data):
    """Preprocess the uploaded image."""
    # Open image and convert to RGB
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    # Resize image
    image = image.resize((150, 150))
    # Convert to array and normalize
    image_array = tf.keras.preprocessing.image.img_to_array(image)
    image_array = image_array / 255.0
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def classify_damage(predicted_class):
    """Convert model prediction to damage classification."""
    if predicted_class == 0: 
        return 'Major Damage'
    else:
        return 'Minor Damage'

# Load model at startup
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        model = load_latest_model()
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Damage Classification API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and preprocess the image
        contents = await file.read()
        image_array = preprocess_image(contents)
        
        # Make prediction
        prediction = model.predict(image_array)
        predicted_class = np.argmax(prediction[0])
        damage_type = classify_damage(predicted_class)
        confidence = float(prediction[0][predicted_class])  # Convert to float for JSON serialization
        
        return JSONResponse(content={
            "filename": file.filename,
            "damage_type": damage_type,
            "confidence": confidence,
            "status": "success"
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "message": "Error processing image",
                "error": str(e),
                "status": "error"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 