# app/api/v1/endpoints/analyze.py
from fastapi import APIRouter, HTTPException
from app.schemas.frontend import LiteAnalyzeRequest, ClimateData, Condition
from app.services.frontend_mapper import parse_lat_lon_from_label, to_iso_date
from app.services.model_bridge import predict_activity

router = APIRouter()

@router.post("", response_model=ClimateData)
async def analyze_lite(req: LiteAnalyzeRequest) -> ClimateData:
    coords = parse_lat_lon_from_label(req.location)
    if not coords:
        raise HTTPException(status_code=400, detail="Could not extract (lat, lon) from 'location'. Include coordinates or a string that contains them.")
    lat, lon = coords
    iso = to_iso_date(req.date)
    out = predict_activity({"date": iso, "lat": lat, "lon": lon, "activity": req.activity or "outdoor activity"})

    rain_conf = float(out.get("rain_confidence", 0.5))
    rain_pct = round(rain_conf * 100)

    conditions = [
        Condition(name="Heavy Rain",  historical=None, trendAdjusted=None, mlProjection=rain_pct, icon="🌧️"),
        Condition(name="Extreme Heat", historical=None, trendAdjusted=None, mlProjection=round(float(out["temperature"])), icon="🔥"),
        Condition(name="High Winds",   historical=None, trendAdjusted=None, mlProjection=round(float(out["wind_speed"]), 1), icon="🌬️"),
    ]

    summary = (
        f"On {req.date} in {req.location}, model projects {rain_pct}% chance of rain "
        f"(“{out['rain']}”), about {float(out['temperature']):.1f}°C, "
        f"{float(out['humidity']):.0f}% humidity, and {float(out['wind_speed']):.1f} m/s winds."
    )

    return ClimateData(location=req.location, date=req.date, summary=summary, conditions=conditions)
