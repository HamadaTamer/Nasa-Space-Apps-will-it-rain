from fastapi import APIRouter
from app.schemas.activity import ActivityRequest, ActivityResponse
from app.services.model_engine import predict_activity_stub

router = APIRouter()

@router.post("", response_model=ActivityResponse)
async def predict_activity(q: ActivityRequest) -> ActivityResponse:
    """
    Accepts date, latitude, longitude, and a free-text activity.
    Calls the (temporary) model stub and returns its outputs.
    """
    pred = predict_activity_stub(q)
    return ActivityResponse(inputs=q, prediction=pred)
