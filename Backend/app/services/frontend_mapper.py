# app/services/frontend_mapper.py
import re
from datetime import datetime

LATLON_RE = re.compile(r"\((?P<lat>-?\d+(?:\.\d+)?),\s*(?P<lon>-?\d+(?:\.\d+)?)\)")

def parse_lat_lon_from_label(label: str) -> tuple[float, float] | None:
    """
    Accepts strings like 'Cairo, Egypt (30.0444, 31.2357)' and returns (30.0444, 31.2357).
    """
    m = LATLON_RE.search(label)
    if not m:
        return None
    return float(m.group("lat")), float(m.group("lon"))

def to_iso_date(date_str: str) -> str:
    """
    Try a few human-friendly formats and fall back to safe ISO if already ISO.
    """
    for fmt in ("%B %d, %Y", "%Y-%m-%d", "%d %B %Y"):
        try:
            return datetime.strptime(date_str, fmt).date().isoformat()
        except ValueError:
            continue
    # last resort: try fromisoformat-ish substr
    try:
        return datetime.fromisoformat(date_str).date().isoformat()
    except Exception:
        # if all fail, just return today as a guard (or raise)
        return datetime.utcnow().date().isoformat()
