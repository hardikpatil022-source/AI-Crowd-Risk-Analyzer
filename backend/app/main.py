from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app import models  # noqa: F401 - ensures models are registered before create_all

from app.routers.upload import router as upload_router
from app.routers.cameras import router as cameras_router
from app.routers.history import router as history_router
from app.routers.analytics import router as analytics_router

app = FastAPI(
    title="AI Crowd Risk Analyzer",
    version="1.0.0"
)

# Create DB tables on startup (SQLite file: backend/crowd_risk.db)
Base.metadata.create_all(bind=engine)

# Allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(upload_router)
app.include_router(cameras_router)
app.include_router(history_router)
app.include_router(analytics_router)

# Serve uploaded videos so the frontend can actually play them back
# e.g. http://127.0.0.1:8000/uploads/CAM-01_myvideo.mp4
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def home():
    return {
        "message": "AI Crowd Risk Analyzer Backend Running"
    }