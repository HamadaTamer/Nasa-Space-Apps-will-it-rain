from pydantic import BaseModel, Field
from typing import Optional, List

class LiteAnalyzeRequest(BaseModel):
    location: str = Field(..., min_length=2)  # e.g. "Cairo, Egypt (30.0444, 31.2357)"
    date: str = Field(..., min_length=4)      # e.g. "July 15, 2026"
    activity: Optional[str] = "outdoor activity"

class Condition(BaseModel):
    name: str
    historical: Optional[float] = None
    trendAdjusted: Optional[float] = None
    mlProjection: Optional[float] = None
    icon: str

class ClimateData(BaseModel):
    location: str
    date: str
    summary: str
    conditions: List[Condition]
