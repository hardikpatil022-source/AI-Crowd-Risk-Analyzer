from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.upload import router as upload_router

app = FastAPI(
    title="AI Crowd Risk Analyzer",
    version="1.0.0"
)

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

@app.get("/")
def home():
    return {
        "message": "AI Crowd Risk Analyzer Backend Running"
    }