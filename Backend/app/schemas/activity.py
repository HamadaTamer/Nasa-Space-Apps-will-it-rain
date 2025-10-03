from datetime import date
from pydantic import BaseModel, Field

class ActivityRequest(BaseModel):
    date: date
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    activity: str = Field(..., min_length=1, max_length=200)

class ActivityPrediction(BaseModel):
    humidity: float        # %
    temperature: float     # °C
    rain: str              # e.g., "Rained", "No Rain"
    wind_speed: float      # m/s
    rain_confidence: float | None = None

class ActivityResponse(BaseModel):
    inputs: ActivityRequest
    prediction: ActivityPrediction
    meta: dict = {}
