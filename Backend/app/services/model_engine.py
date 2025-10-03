from typing import Dict
from app.schemas.activity import ActivityRequest, ActivityPrediction

# this is where we would call the real model
def predict_activity_stub(req: ActivityRequest) -> ActivityPrediction:
    return ActivityPrediction(humidity=30.0, temperature=20.0, rain="Rained", wind_speed=2.7)