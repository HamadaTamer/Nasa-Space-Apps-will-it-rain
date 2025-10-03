from fastapi import APIRouter
from app.schemas.activity import ActivityRequest, ActivityResponse, ActivityPrediction
from app.services.model_bridge import predict_activity

router = APIRouter()

@router.post("", response_model=ActivityResponse)
async def predict_activity_endpoint(q: ActivityRequest) -> ActivityResponse:
    out = predict_activity({
        "date": q.date.isoformat(),
        "lat": q.lat,
        "lon": q.lon,
        "activity": q.activity
    })
    return ActivityResponse(
        inputs=q,
        prediction=ActivityPrediction(**out)
    )
