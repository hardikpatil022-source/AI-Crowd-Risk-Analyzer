import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.services.video_service import save_video
from app.services.crowd_analyzer import analyze_video


router = APIRouter()


# ============================================================
# UPLOAD VIDEO
# ============================================================

@router.post("/upload-video")
async def upload_video(
    file: UploadFile = File(...)
):
    try:
        filename = await save_video(file)

        return {
            "success": True,
            "filename": filename,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload video: {str(error)}",
        )


# ============================================================
# ANALYZE VIDEO WITH YOLO
# ============================================================

@router.get("/analyze-video/{filename}")
async def analyze_uploaded_video(
    filename: str,
    camera_id: Optional[int] = Query(
        default=None,
        description="Backend database ID of the camera slot",
    ),
    camera_capacity: int = Query(
        default=500,
        description="Camera capacity used to calculate crowd density",
    ),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # Record the exact time when scanning starts.
    # This is different from the database created_at time.
    # --------------------------------------------------------
    scan_started_at = datetime.now(timezone.utc)

    # --------------------------------------------------------
    # Build possible video paths
    # --------------------------------------------------------

    backend_upload_path = os.path.abspath(
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "uploads",
            filename,
        )
    )

    frontend_cctv_path = os.path.abspath(
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "..",
            "frontend",
            "public",
            "cctv",
            filename,
        )
    )

    # --------------------------------------------------------
    # Find video
    # --------------------------------------------------------

    if os.path.exists(backend_upload_path):

        video_path = backend_upload_path

    elif os.path.exists(frontend_cctv_path):

        video_path = frontend_cctv_path

    else:

        raise HTTPException(
            status_code=404,
            detail=f"Video not found: {filename}",
        )

    # --------------------------------------------------------
    # Validate camera
    # --------------------------------------------------------

    if camera_id is not None:

        camera = crud.get_camera(
            db,
            camera_id
        )

        if not camera:

            raise HTTPException(
                status_code=404,
                detail=f"Camera not found: {camera_id}",
            )

        # If frontend didn't explicitly provide a different
        # capacity, use the capacity configured for this camera.
        if camera_capacity == 500:

            camera_capacity = (
                camera.capacity or 500
            )

    # --------------------------------------------------------
    # Run YOLO analysis
    # --------------------------------------------------------

    try:

        result = analyze_video(
            video_path,
            camera_capacity=camera_capacity,
        )

        # ----------------------------------------------------
        # Validate YOLO result
        # ----------------------------------------------------

        if not isinstance(result, dict):

            raise ValueError(
                "YOLO analyzer returned an invalid result."
            )

        people_count = int(
            result.get("people_count", 0)
        )

        average_people = float(
            result.get("average_people", 0)
        )

        crowd_density = float(
            result.get("crowd_density", 0)
        )

        risk_level = str(
            result.get("risk_level", "LOW")
        ).upper()

        boxes = result.get(
            "boxes",
            []
        )

        # ----------------------------------------------------
        # Save analysis result to database
        # ----------------------------------------------------

        saved = crud.save_analysis_result(
            db=db,
            camera_id=camera_id,
            filename=filename,
            people_count=people_count,
            average_people=average_people,
            crowd_density=crowd_density,
            risk_level=risk_level,
            boxes=boxes,
            scan_started_at=scan_started_at,
        )

        # ----------------------------------------------------
        # Return analysis result to frontend
        # ----------------------------------------------------

        return {
            "success": True,
            "id": saved.id,
            "filename": filename,
            "camera_id": camera_id,
            "people_count": people_count,
            "average_people": average_people,
            "crowd_density": crowd_density,
            "risk_level": risk_level,
            "boxes": boxes,
            "scan_started_at": (
                scan_started_at.isoformat()
            ),
            "created_at": (
                saved.created_at.isoformat()
                if saved.created_at
                else None
            ),
        }

    # --------------------------------------------------------
    # Preserve FastAPI HTTP errors
    # --------------------------------------------------------

    except HTTPException:
        raise

    # --------------------------------------------------------
    # Return actual analysis error
    # --------------------------------------------------------

    except Exception as error:

        print(
            "\n"
            "========================================\n"
            "YOLO ANALYSIS ERROR\n"
            "========================================"
        )

        print(
            f"Filename: {filename}"
        )

        print(
            f"Video path: {video_path}"
        )

        print(
            f"Camera ID: {camera_id}"
        )

        print(
            f"Error: {error}"
        )

        print(
            "========================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Video analysis failed: {str(error)}",
        )