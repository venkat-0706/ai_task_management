from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.task import router as task_router
from app.routers.user import router as user_router
from app.routers.auth import router as auth_router
from app.routers.ai import router as ai_router
from app.routers.document import router as document_router
from app.routers.analytics import router as analytics_router
from app.routers.audit_log import router as audit_log_router

app = FastAPI(
    title="AI Task Management API",
    description="Backend API for AI-powered task management",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(ai_router)
app.include_router(document_router)
app.include_router(analytics_router)
app.include_router(audit_log_router)

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