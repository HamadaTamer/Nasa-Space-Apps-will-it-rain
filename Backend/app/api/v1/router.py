from fastapi import APIRouter
from .endpoints import health, activity

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(activity.router, prefix="/activity", tags=["activity"])  

