import os

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.video_service import save_video
from app.services.crowd_analyzer import analyze_video


router = APIRouter()


@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):

    filename = await save_video(file)

    return {
        "success": True,
        "filename": filename
    }


@router.get("/analyze-video/{filename}")
async def analyze_uploaded_video(filename: str):

    # First check backend/uploads
    upload_path = os.path.join(
        "uploads",
        filename
    )

    # If not found, check frontend/public/cctv
    frontend_path = os.path.join(
        "..",
        "frontend",
        "public",
        "cctv",
        filename
    )

    if os.path.exists(upload_path):

        video_path = upload_path

    elif os.path.exists(frontend_path):

        video_path = frontend_path

    else:

        raise HTTPException(
            status_code=404,
            detail=f"Video not found: {filename}"
        )

    try:

        result = analyze_video(video_path)

        return {
            "success": True,
            "filename": filename,
            "people_count": result["people_count"],
            "average_people": result["average_people"],
            "crowd_density": result["crowd_density"],
            "risk_level": result["risk_level"],
            "boxes": result["boxes"]
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )