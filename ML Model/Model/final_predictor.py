# weather_predictor.py
import numpy as np
import pandas as pd
import joblib
import pickle
from tensorflow.keras.models import load_model
from datetime import datetime
import json
import sys
import os

class WeatherPredictor:
    """
    Automated weather prediction system that loads model and makes predictions.
    Outputs results to CSV and JSON files.
    """
    
    def __init__(self, model_dir=None):
        """Initialize and automatically load the model and preprocessing components."""
        self.model = None
        self.scaler = None
        self.le = None
        self.loaded = False
        
        # Determine the directory to look for files
        if model_dir is None:
            # Look in current directory and script directory
            self.model_dir = os.path.dirname(os.path.abspath(__file__))
        else:
            self.model_dir = model_dir
        
        # Auto-load on initialization
        self._auto_load()
    
    def _find_file(self, filename):
        """Find file in multiple possible locations."""
        possible_paths = [
            os.path.join(self.model_dir, filename),  # Same directory as script
            filename,  # Current working directory
            os.path.join('.', filename),  # Relative path
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                print(f"   ✅ Found {filename} at: {path}")
                return path
        
        print(f"   ❌ Could not find {filename} in:")
        for path in possible_paths:
            print(f"      - {path}")
        return None
    
    def _auto_load(self):
        """Automatically load all required components."""
        try:
            print("🔄 Loading weather prediction model...")
            print(f"📁 Looking for model files in: {self.model_dir}")
            
            # Find and load model
            model_path = self._find_file('weather_prediction_model.keras')
            if not model_path:
                return
            
            scaler_path = self._find_file('scaler.pkl')
            if not scaler_path:
                return
                
            encoder_path = self._find_file('label_encoder.pkl')
            if not encoder_path:
                return
            
            # Load components
            print("   📥 Loading model components...")
            self.model = load_model(model_path)
            self.scaler = joblib.load(scaler_path)
            
            with open(encoder_path, 'rb') as f:
                self.le = pickle.load(f)
            
            self.loaded = True
            print("🎉 Weather predictor ready!")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
    
    def list_available_files(self):
        """List all files in the current directory to help debug."""
        print("\n📁 Files in current directory:")
        current_dir = os.getcwd()
        for file in os.listdir(current_dir):
            file_path = os.path.join(current_dir, file)
            if os.path.isfile(file_path):
                size = os.path.getsize(file_path)
                print(f"   {file} ({size} bytes)")
    
    def predict_single(self, year, lat, lon, month):
        """
        Make a single weather prediction.
        
        Args:
            year: Integer year (e.g., 2024)
            lat: Float latitude (e.g., 22.0)
            lon: Float longitude (e.g., 25.625)
            month: Integer month (1-12)
            
        Returns:
            Dictionary with prediction results
        """
        if not self.loaded:
            raise ValueError("Model not loaded. Please check the error messages above.")
        
        # Prepare input
        input_data = np.array([[year, lat, lon, month]])
        input_scaled = self.scaler.transform(input_data)
        
        # Make prediction
        humidity_pred, temperature_pred, wind_speed_pred, rain_pred = self.model.predict(input_scaled, verbose=0)
        
        # Process results
        rain_class_idx = np.argmax(rain_pred[0])
        rain_class = self.le.inverse_transform([rain_class_idx])[0]
        rain_confidence = float(rain_pred[0][rain_class_idx])
        
        return {
            'input': {
                'year': year,
                'latitude': lat,
                'longitude': lon,
                'month': month
            },
            'predictions': {
                'humidity': float(humidity_pred[0][0]),
                'temperature': float(temperature_pred[0][0]),
                'wind_speed': float(wind_speed_pred[0][0]),
                'rain': rain_class,
                'rain_confidence': rain_confidence
            },
            'metadata': {
                'prediction_timestamp': datetime.now().isoformat(),
                'model_loaded': True
            }
        }
    
    def predict_batch(self, predictions_list):
        """
        Make multiple predictions at once.
        
        Args:
            predictions_list: List of dictionaries with ['year', 'lat', 'lon', 'month']
            
        Returns:
            List of prediction results
        """
        if not self.loaded:
            raise ValueError("Model not loaded.")
            
        results = []
        for i, params in enumerate(predictions_list):
            print(f"🔍 Predicting {i+1}/{len(predictions_list)}...")
            result = self.predict_single(**params)
            results.append(result)
        
        return results
    
    def save_predictions(self, predictions, output_filename="weather_predictions"):
        """
        Save predictions to CSV and JSON files.
        
        Args:
            predictions: List of prediction dictionaries
            output_filename: Base name for output files (without extension)
        """
        if not predictions:
            print("❌ No predictions to save.")
            return
        
        # Extract data for CSV
        csv_data = []
        for pred in predictions:
            row = {
                'prediction_id': len(csv_data) + 1,
                'year': pred['input']['year'],
                'latitude': pred['input']['latitude'],
                'longitude': pred['input']['longitude'],
                'month': pred['input']['month'],
                'predicted_humidity': pred['predictions']['humidity'],
                'predicted_temperature': pred['predictions']['temperature'],
                'predicted_wind_speed': pred['predictions']['wind_speed'],
                'predicted_rain': pred['predictions']['rain'],
                'rain_confidence': pred['predictions']['rain_confidence'],
                'prediction_timestamp': pred['metadata']['prediction_timestamp']
            }
            csv_data.append(row)
        
        # Save to CSV
        df = pd.DataFrame(csv_data)
        csv_path = f"{output_filename}.csv"
        df.to_csv(csv_path, index=False)
        
        # Save to JSON
        json_output = {
            'metadata': {
                'export_date': datetime.now().isoformat(),
                'total_predictions': len(predictions),
                'model_version': '1.0',
                'output_files': [f"{output_filename}.csv", f"{output_filename}.json"]
            },
            'predictions': predictions
        }
        
        json_path = f"{output_filename}.json"
        with open(json_path, 'w') as f:
            json.dump(json_output, f, indent=2)
        
        print(f"✅ Predictions saved successfully!")
        print(f"   📄 CSV: {csv_path}")
        print(f"   📄 JSON: {json_path}")
        
        return df

def main():
    """
    Main function with example usage and command-line interface.
    """
    print("=" * 50)
    print("🌤️  AUTOMATED WEATHER PREDICTION SYSTEM")
    print("=" * 50)
    
    # Initialize predictor (automatically loads model)
    predictor = WeatherPredictor()
    
    # If model didn't load, show available files and exit
    if not predictor.loaded:
        print("\n🔍 Let's check what files are available...")
        predictor.list_available_files()
        print("\n💡 Solution: Make sure these files are in the same directory as this script:")
        print("   - weather_prediction_model.keras")
        print("   - scaler.pkl") 
        print("   - label_encoder.pkl")
        return
    
    # Example predictions
    example_predictions = [
        {'year': 2024, 'lat': 22.0, 'lon': 25.625, 'month': 6},
        {'year': 2024, 'lat': 22.0, 'lon': 26.25, 'month': 7},
        {'year': 2024, 'lat': 22.0, 'lon': 26.875, 'month': 8},
        {'year': 2024, 'lat': 22.0, 'lon': 27.5, 'month': 9},
        {'year': 2025, 'lat': 22.0, 'lon': 25.625, 'month': 1},
    ]
    
    print(f"\n🎯 Making {len(example_predictions)} example predictions...")
    
    # Make predictions
    results = predictor.predict_batch(example_predictions)
    
    # Save results
    predictor.save_predictions(results, "example_weather_predictions")
    
    # Display summary
    print(f"\n📊 PREDICTION SUMMARY:")
    print(f"   • Total predictions: {len(results)}")
    print(f"   • Temperature range: {min(r['predictions']['temperature'] for r in results):.1f}°C - {max(r['predictions']['temperature'] for r in results):.1f}°C")
    print(f"   • Rain conditions: {len([r for r in results if 'No Rain' in r['predictions']['rain']])} no rain, {len([r for r in results if 'No Rain' not in r['predictions']['rain']])} rain events")
    
    # Show first prediction as example
    print(f"\n🔍 SAMPLE PREDICTION:")
    first_result = results[0]
    print(f"   📍 Location: Lat {first_result['input']['latitude']}, Lon {first_result['input']['longitude']}")
    print(f"   📅 Date: Month {first_result['input']['month']}, {first_result['input']['year']}")
    print(f"   🌡️  Temperature: {first_result['predictions']['temperature']:.2f}°C")
    print(f"   💧 Humidity: {first_result['predictions']['humidity']:.2f}%")
    print(f"   💨 Wind Speed: {first_result['predictions']['wind_speed']:.2f}")
    print(f"   🌧️  Rain: {first_result['predictions']['rain']} ({first_result['predictions']['rain_confidence']:.1%} confidence)")

# Function for quick external use
def quick_predict(year, lat, lon, month):
    """
    Quick one-line prediction function for external use.
    
    Example:
        from weather_predictor import quick_predict
        result = quick_predict(2024, 22.0, 25.625, 6)
    """
    predictor = WeatherPredictor()
    if predictor.loaded:
        return predictor.predict_single(year, lat, lon, month)
    else:
        raise ValueError("Model failed to load.")

if __name__ == "__main__":
    main()