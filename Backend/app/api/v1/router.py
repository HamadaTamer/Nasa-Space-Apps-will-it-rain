from fastapi import APIRouter
from .endpoints import health, activity
from .endpoints import analyze 

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(activity.router, prefix="/activity", tags=["activity"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])  
