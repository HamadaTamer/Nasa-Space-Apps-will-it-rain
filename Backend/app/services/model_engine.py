from typing import Dict
from app.schemas.probabilities import ProbabilityQuery, ProbabilityResponse, ProbabilityResult

def predict_probabilities(q: ProbabilityQuery) -> ProbabilityResponse:
    loc = q.location
    sel = q.selection
    thr = (q.thresholds or {})

    results = [
        ProbabilityResult(metric="wet",           probability_pct=42.0, n_years=sel.years_back, trend="up"),
        ProbabilityResult(metric="windy",         probability_pct=18.0, n_years=sel.years_back, trend="flat"),
        ProbabilityResult(metric="hot",           probability_pct=35.0, n_years=sel.years_back, trend="up"),
        ProbabilityResult(metric="cold",          probability_pct=5.0,  n_years=sel.years_back, trend="down"),
        ProbabilityResult(metric="uncomfortable", probability_pct=27.0, n_years=sel.years_back, trend="up"),
    ]

    meta: Dict = {
        "lat": loc.lat,
        "lon": loc.lon,
        "date": sel.date.isoformat(),
        "doy": sel.doy,
        "window_days": sel.window_days,
        "years_back": sel.years_back,
        "thresholds": thr.dict() if hasattr(thr, "dict") else {},
        "note": "Demo values — replace with real climatology from IMERG/MERRA-2."
    }
    return ProbabilityResponse(results=results, meta=meta)
