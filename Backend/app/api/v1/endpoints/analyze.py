# app/api/v1/endpoints/analyze.py
from fastapi import APIRouter, HTTPException
from app.schemas.frontend import LiteAnalyzeRequest, ClimateData, Condition
from app.schemas.activity import ActivityRequest
from app.services.frontend_mapper import parse_lat_lon_from_label, to_iso_date
from app.services.model_bridge import predict_activity

router = APIRouter()

@router.post("", response_model=ClimateData)
async def analyze_lite(req: LiteAnalyzeRequest) -> ClimateData:
    # 1) parse coords from the label
    coords = parse_lat_lon_from_label(req.location)
    if not coords:
        raise HTTPException(status_code=400, detail="Location must include '(lat, lon)' in the text.")
    lat, lon = coords

    # 2) normalize date to ISO for the model endpoint
    iso = to_iso_date(req.date)

    # 3) call the existing model bridge
    out = predict_activity({
        "date": iso,
        "lat": lat,
        "lon": lon,
        "activity": req.activity or "outdoor activity",
    })

    # 4) map model outputs to your UI's ClimateData + Condition[]
    # Here: use rain_confidence if available; otherwise synthesize 0.5
    rain_conf = float(out.get("rain_confidence", 0.5))  # 0..1
    rain_pct = round(rain_conf * 100)

    conditions = [
        Condition(name="Heavy Rain", historical=None, trendAdjusted=None, mlProjection=rain_pct, icon="🌧️"),
        Condition(name="Extreme Heat", historical=None, trendAdjusted=None, mlProjection=round(float(out["temperature"])), icon="🔥"),
        Condition(name="High Winds", historical=None, trendAdjusted=None, mlProjection=round(float(out["wind_speed"]), 1), icon="🌬️"),
    ]

    # Friendly date for display (keep the original string you passed from FE)
    pretty_date = req.date

    summary = (
        f"On {pretty_date} in {req.location}, model projects {rain_pct}% chance of rain "
        f"(“{out['rain']}”), about {float(out['temperature']):.1f}°C, "
        f"{float(out['humidity']):.0f}% humidity, and {float(out['wind_speed']):.1f} m/s winds."
    )

    return ClimateData(
        location=req.location,
        date=pretty_date,
        summary=summary,
        conditions=conditions,
    )
