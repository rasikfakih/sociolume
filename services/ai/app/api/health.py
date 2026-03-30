from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai",
    }


@router.get("/live")
async def liveness():
    """Liveness probe"""
    return {"status": "ok"}


@router.get("/ready")
async def readiness():
    """Readiness probe - check dependencies here"""
    return {"status": "ready"}
