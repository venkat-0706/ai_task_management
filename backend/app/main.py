from fastapi import FastAPI

from app.routers.user import router as user_router
from app.routers.auth import router as auth_router


app = FastAPI(
    title="AI Task Management API",
    description="Backend API for AI-powered task management",
    version="1.0.0"
)


app.include_router(user_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "AI Task Management API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }