from fastapi import APIRouter
from app.schemas.activity import ActivityRequest, ActivityResponse, ActivityPrediction
from app.services.model_bridge import predict_activity
import requests
import os

router = APIRouter()


DIFY_API_KEY = os.getenv("DIFY_API_KEY", "app-IFUhNpYHGnVnl7mOA0ypGb1D")
DIFY_URL = "https://api.dify.ai/v1/chat-messages"


@router.post("", response_model=ActivityResponse)
async def predict_activity_endpoint(q: ActivityRequest) -> ActivityResponse:
    out = predict_activity({
        "date": q.date.isoformat(),
        "lat": q.lat,
        "lon": q.lon,
        "activity": q.activity
    })

    payload = {
        "inputs": {
            "activity": q.activity,
            "rain": out["rain"],
            "rain_confidence": out["rain_confidence"],
            "temperature": out["temperature"],
            "humidity": out["humidity"],
            "wind_speed": out["wind_speed"]
        },
        "response_mode": "blocking",
        "query": "weather report",
        "user": "user"
    }

    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json"
    }

    resp = requests.post(DIFY_URL, headers=headers, json=payload)
    if resp.status_code != 200:
        raise Exception(f"Dify API error: {resp.status_code} {resp.text}")

    data = resp.json()


    llm_summary = None
    if "answer" in data:
        llm_summary = data["answer"]  # chatflows return `answer`
    elif "data" in data and "outputs" in data["data"]:
        llm_summary = data["data"]["outputs"].get("summary")


    return ActivityResponse(
        inputs=q,
        prediction=ActivityPrediction(**out),
        analysis_summary=llm_summary
    )