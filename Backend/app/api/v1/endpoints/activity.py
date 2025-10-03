from fastapi import APIRouter, HTTPException
from app.schemas.activity import ActivityRequest, ActivityResponse, ActivityPrediction
from app.services.model_bridge import MODEL
from datetime import datetime

router = APIRouter()

@router.post("", response_model=ActivityResponse)
async def predict_activity(q: ActivityRequest) -> ActivityResponse:
    """
    Accepts date, lat, lon, activity -> calls the ML model (or stub if unavailable)
    """
    # derive year/month for the model (your predictor expects year, lat, lon, month)
    year = q.date.year
    month = q.date.month

    try:
        result = MODEL.predict(year=year, lat=q.lat, lon=q.lon, month=month)
        preds = result.get("predictions", {})
        meta = result.get("metadata", {})
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Model error: {e}")

    prediction = ActivityPrediction(
        humidity=float(preds.get("humidity", 30.0)),
        temperature=float(preds.get("temperature", 20.0)),
        rain=str(preds.get("rain", "Rained")),
        wind_speed=float(preds.get("wind_speed", 2.7)),
        rain_confidence=float(preds.get("rain_confidence", 1.0)) if preds.get("rain_confidence") is not None else None,
    )

    # Pack what the frontend will want
    meta_out = {
        "model_loaded": meta.get("model_loaded", True),
        "model_reason": meta.get("reason"),
        "prediction_timestamp": meta.get("prediction_timestamp", datetime.utcnow().isoformat()),
    }

    return ActivityResponse(inputs=q, prediction=prediction, meta=meta_out)
