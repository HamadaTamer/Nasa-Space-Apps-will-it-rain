# services/model_bridge.py
from __future__ import annotations
import sys
from pathlib import Path
from typing import Optional

from app.core.config import settings
from app.services.model_engine import predict_activity_stub  # fallback

class _LazyPredictor:
    def __init__(self, model_dir: Optional[str]):
        self.model_dir = model_dir
        self._predictor = None
        self._loaded = False
        self._error: Optional[str] = None

    def load(self):
        if self._loaded:
            return

        if settings.USE_MODEL_STUB:
            self._error = "USE_MODEL_STUB=true"
            self._loaded = True
            return

        if not self.model_dir:
            self._error = "MODEL_DIR not configured"
            self._loaded = True
            return

        model_dir_path = Path(self.model_dir)
        if not model_dir_path.exists():
            self._error = f"MODEL_DIR not found: {model_dir_path}"
            self._loaded = True
            return

        # Make the model dir importable
        if str(model_dir_path) not in sys.path:
            sys.path.insert(0, str(model_dir_path))

        # Try weather_predictor first (the code you pasted), else final_predictor (file present)
        predictor_cls = None
        try:
            wp = __import__("weather_predictor")
            predictor_cls = getattr(wp, "WeatherPredictor", None)
        except Exception:
            predictor_cls = None

        if predictor_cls is None:
            try:
                fp = __import__("final_predictor")
                predictor_cls = getattr(fp, "WeatherPredictor", None)
            except Exception as e:
                self._error = f"Could not import weather_predictor or final_predictor: {e}"
                self._loaded = True
                return

        # Instantiate predictor (it will auto-load model/scaler/encoder)
        try:
            self._predictor = predictor_cls(model_dir=str(model_dir_path))
            self._loaded = True
        except Exception as e:
            self._error = f"Failed to instantiate predictor: {e}"
            self._loaded = True

    @property
    def error(self) -> Optional[str]:
        return self._error

    @property
    def is_ready(self) -> bool:
        return self._loaded and self._predictor is not None and self._error is None

    def predict(self, *, year: int, lat: float, lon: float, month: int) -> dict:
        """
        Calls the model and returns the dict the predictor produces:
        {
           'input': {...},
           'predictions': {
               'humidity': float,
               'temperature': float,
               'wind_speed': float,
               'rain': str,
               'rain_confidence': float
           },
           'metadata': {...}
        }
        """
        if not self._loaded:
            self.load()
        if self.is_ready:
            return self._predictor.predict_single(year=year, lat=lat, lon=lon, month=month)
        # Fallback to stub if not ready
        stub = predict_activity_stub_stubdict()
        return {
            "input": {"year": year, "latitude": lat, "longitude": lon, "month": month},
            "predictions": stub["predictions"],
            "metadata": {"model_loaded": False, "reason": self._error or "unknown"}
        }

def predict_activity_stub_stubdict():
    # returns the same values as your stub, but in the model dict shape
    return {
        "predictions": {
            "humidity": 30.0,
            "temperature": 20.0,
            "wind_speed": 2.7,
            "rain": "Rained",
            "rain_confidence": 1.0
        }
    }

# Singleton
MODEL = _LazyPredictor(settings.MODEL_DIR)
