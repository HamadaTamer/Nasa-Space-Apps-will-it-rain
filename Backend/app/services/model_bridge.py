from datetime import datetime
from app.Model.final_predictor import WeatherPredictor
import os

# Initialize the model predictor
model_path = os.path.join(os.path.dirname(__file__), '..', 'Model')
predictor = WeatherPredictor(model_path)

def predict_activity(input_data: dict) -> dict:
    """
    Bridge function to convert API input to model input and call the predictor.
    
    Args:
        input_data: Dictionary with 'date', 'lat', 'lon', 'activity'
        
    Returns:
        Dictionary with prediction results including all available data
    """
    # Extract date components
    date_obj = datetime.fromisoformat(input_data['date'])
    year = date_obj.year
    month = date_obj.month
    
    # Call the model's predict_single method
    result = predictor.predict_single(
        year=year,
        lat=input_data['lat'],
        lon=input_data['lon'],
        month=month
    )
    
    # Return ALL available data from the model
    return {
        'humidity': result['predictions']['humidity'],
        'temperature': result['predictions']['temperature'],
        'rain': result['predictions']['rain'],
        'wind_speed': result['predictions']['wind_speed'],
        'rain_confidence': result['predictions']['rain_confidence'] 
    }