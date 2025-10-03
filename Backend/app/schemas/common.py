from datetime import date
from pydantic import BaseModel, Field
from pydantic import computed_field

class Location(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

class DateSelection(BaseModel):
    date: date
    window_days: int = Field(7, ge=0, le=30)
    years_back: int = Field(20, ge=5, le=50)

    @computed_field
    @property
    def doy(self) -> int:
        return self.date.timetuple().tm_yday
