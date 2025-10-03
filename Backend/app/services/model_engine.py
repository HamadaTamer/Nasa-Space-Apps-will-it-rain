from typing import Dict
from app.schemas.activity import ActivityRequest, ActivityPrediction
from app.Model import final_predictor

# this is where we would call the real model
def predict_activity_stub(req: ActivityRequest) -> ActivityPrediction:
    return final_predictor.predict_single(humidity=30.0, temperature=20.0, rain="Rained", wind_speed=2.7)

