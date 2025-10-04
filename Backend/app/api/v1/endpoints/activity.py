import json
from fastapi import APIRouter
from app.schemas.activity import ActivityRequest, ActivityResponse, ActivityPrediction
from app.services.model_bridge import predict_activity
import requests
import os

router = APIRouter()

# Dify API Configuration (using environment variable or a default fallback)
DIFY_API_KEY = os.getenv("DIFY_API_KEY", "app-IFUhNpYHGnVnl7mOA0ypGb1D")
DIFY_URL = "https://api.dify.ai/v1/chat-messages"

@router.post("", response_model=ActivityResponse)
async def predict_activity_endpoint(q: ActivityRequest) -> ActivityResponse:
    """
    Handles POST requests from the frontend.
    1. Gets inputs (date, lat, lon, activity) from the ActivityRequest model 'q'.
    2. Calls a local model to predict weather conditions ('out').
    3. Calls the Dify LLM with the weather and activity data to get an analysis.
    4. Parses the LLM's response to extract the summary.
    5. Returns the structured ActivityResponse.
    """
    
    # Step 1 & 2: Get weather prediction from the internal model
    out = predict_activity({
        "date": q.date.isoformat(),
        "lat": q.lat,
        "lon": q.lon,
        "activity": q.activity
    })

    # Step 3: Prepare payload for Dify LLM (The 'inputs' are the context for the LLM)
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
        # The LLM's job is to analyze the data provided in 'inputs' and summarize it.
        "query": f"Based on the provided weather inputs, generate a concise analysis summary of how suitable the conditions are for the activity: '{q.activity}'. The response MUST be a single JSON object with the key 'summary'. Example: {{\"summary\": \"The weather is perfect for cycling...\"}}",
        "user": "frontend-user"
    }

    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json"
    }

    # Step 4: Call Dify API
    resp = requests.post(DIFY_URL, headers=headers, json=payload)
    
    if resp.status_code != 200:
        # Error handling for Dify API failure
        raise Exception(f"Dify API error: {resp.status_code} {resp.text}")
    
    # Step 5: Extract and parse the JSON answer from the Dify response
    try:
        answer_string = resp.json()['answer']
        # Find the JSON object within the string
        json_start = answer_string.find('{')
        json_end = answer_string.rfind('}')
        
        if json_start == -1 or json_end == -1:
             raise ValueError("JSON object structure not found in LLM response.")
             
        json_str = answer_string[json_start : json_end + 1]
        answer_data = json.loads(json_str)
        llm_summary = answer_data.get('summary', 'No summary found in LLM response structure.')
        
    except (KeyError, json.JSONDecodeError, ValueError) as e:
        # Handle cases where the Dify response is missing 'answer' or the JSON parsing fails
        print(f"Error parsing LLM response: {e}. Raw Dify Response: {resp.text}")
        llm_summary = "Error: Failed to parse analysis summary from external service."

    # Step 6: Return the final structured response to the frontend
    return ActivityResponse(
        inputs=q,
        prediction=ActivityPrediction(**out),
        analysis_summary=llm_summary
    )