from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings

# Import routes
from app.api import health, predictions


class Settings(BaseSettings):
    """Application settings"""
    app_name: str = "Sociolume AI Service"
    version: str = "1.0.0"
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()


def create_app() -> FastAPI:
    """Application factory"""
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        description="AI service for Sociolume",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(health.router, prefix="/health", tags=["Health"])
    app.include_router(predictions.router, prefix="/api/v1", tags=["Predictions"])

    @app.get("/")
    async def root():
        return {
            "name": settings.app_name,
            "version": settings.version,
            "environment": settings.environment,
        }

    return app


app = create_app()
