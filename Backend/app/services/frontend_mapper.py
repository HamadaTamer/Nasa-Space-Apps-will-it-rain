# app/services/frontend_mapper.py
import re
from datetime import datetime

# (1) Try the (lat, lon) form first
PAREN_LATLON = re.compile(r"\((?P<lat>-?\d+(?:\.\d+)?)[,\s]+(?P<lon>-?\d+(?:\.\d+)?)\)")

# (2) Fallback: any two floats in the string, in order
ANY_TWO_FLOATS = re.compile(r"(-?\d+(?:\.\d+)?)")

def parse_lat_lon_from_label(label: str) -> tuple[float, float] | None:
    """
    Accepts:
      - 'Cairo, Egypt (30.0444, 31.2357)'
      - '30.0444, 31.2357'
      - 'Cairo 30.0444 31.2357'
      - 'lat 30.0444 lon 31.2357'
    Returns (lat, lon) or None if not found.
    """
    m = PAREN_LATLON.search(label)
    if m:
        return float(m.group("lat")), float(m.group("lon"))

    # grab any two float-looking numbers in order
    nums = [float(x) for x in ANY_TWO_FLOATS.findall(label)]
    if len(nums) >= 2:
        return nums[0], nums[1]
    return None

def to_iso_date(date_str: str) -> str:
    for fmt in ("%B %d, %Y", "%Y-%m-%d", "%d %B %Y"):
        try:
            return datetime.strptime(date_str, fmt).date().isoformat()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(date_str).date().isoformat()
    except Exception:
        from datetime import timezone
        return datetime.now(tz=timezone.utc).date().isoformat()
