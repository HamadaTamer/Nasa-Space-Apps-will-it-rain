from fastapi import APIRouter, HTTPException
from app.schemas.probabilities import ProbabilityQuery, ProbabilityResponse
from app.services.model_engine import predict_probabilities

router = APIRouter()

@router.post("", response_model=ProbabilityResponse)
async def get_probabilities(q: ProbabilityQuery):
    try:
        return predict_probabilities(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model error: {e}")
