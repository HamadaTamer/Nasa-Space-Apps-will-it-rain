from typing import Optional, Literal
from pydantic import BaseModel, Field
from .common import Location, DateSelection

class Thresholds(BaseModel):
    wet_mm: float = 10.0
    wind_ms: float = 8.0
    hot_c: float | None = 35.0
    cold_c: float | None = 5.0
    hi_category: Literal["extreme_caution","danger","extreme_danger"] = "extreme_caution"

class ProbabilityQuery(BaseModel):
    location: Location
    selection: DateSelection
    thresholds: Optional[Thresholds] = None

class ProbabilityResult(BaseModel):
    metric: Literal["wet","windy","hot","cold","uncomfortable"]
    probability_pct: float = Field(ge=0, le=100)
    n_years: int
    trend: Optional[Literal["up","down","flat"]] = None
    ci_low: Optional[float] = None
    ci_high: Optional[float] = None

class ProbabilityResponse(BaseModel):
    results: list[ProbabilityResult]
    meta: dict
