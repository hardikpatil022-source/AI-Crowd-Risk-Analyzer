import os
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
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
async def analyze_uploaded_video(
    filename: str,
    camera_id: Optional[int] = Query(
        default=None,
        description="Optional camera to link this result to"
    ),
    camera_capacity: int = Query(
        default=500,
        description="Capacity used to compute crowd density %"
    ),
    db: Session = Depends(get_db)
):

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

    # If a camera_id was given, validate it exists and default
    # the capacity to the camera's configured capacity unless
    # the caller explicitly overrode it.
    if camera_id is not None:

        camera = crud.get_camera(db, camera_id)

        if not camera:
            raise HTTPException(
                status_code=404,
                detail=f"Camera not found: {camera_id}"
            )

        if camera_capacity == 500:
            camera_capacity = camera.capacity

    try:

        result = analyze_video(video_path, camera_capacity=camera_capacity)

        # Persist the result so History / Analytics / Reports have data
        saved = crud.save_analysis_result(
            db,
            filename=filename,
            result=result,
            camera_id=camera_id
        )

        return {
            "success": True,
            "id": saved.id,
            "filename": filename,
            "camera_id": camera_id,
            "people_count": result["people_count"],
            "average_people": result["average_people"],
            "crowd_density": result["crowd_density"],
            "risk_level": result["risk_level"],
            "boxes": result["boxes"]
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )