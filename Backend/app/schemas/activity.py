# app/schemas/activity.py
from datetime import date
from pydantic import BaseModel, Field
from typing import Optional

class ActivityRequest(BaseModel):
    date: date
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    activity: str

class ActivityPrediction(BaseModel):
    humidity: float
    temperature: float
    rain: str
    wind_speed: float
    rain_confidence: float  

class ActivityResponse(BaseModel):
    inputs: ActivityRequest
    prediction: ActivityPrediction
    analysis_summary: Optional[str] = None
