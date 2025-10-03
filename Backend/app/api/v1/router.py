from fastapi import APIRouter
from .endpoints import health, probabilities

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(probabilities.router, prefix="/probabilities", tags=["probabilities"])
