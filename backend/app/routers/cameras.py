from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.database import get_db

router = APIRouter(
    prefix="/cameras",
    tags=["cameras"]
)


# ============================================================
# CREATE / UPDATE CAMERA SLOT
# ============================================================

@router.post("", response_model=schemas.CameraOut)
def create_camera(
    camera: schemas.CameraCreate,
    db: Session = Depends(get_db)
):
    """
    Create or update a fixed CCTV slot.

    CAM-01 through CAM-06 are the permanent UI identities.

    The database ID is only an internal identifier.
    """

    # --------------------------------------------------------
    # Fixed camera slot name
    # --------------------------------------------------------

    slot_name = camera.name.strip()

    # --------------------------------------------------------
    # Check whether this camera slot already exists
    # --------------------------------------------------------

    existing_camera = (
        db.query(models.Camera)
        .filter(models.Camera.name == slot_name)
        .first()
    )

    # --------------------------------------------------------
    # UPDATE EXISTING SLOT
    # --------------------------------------------------------

    if existing_camera:

        existing_camera.location = camera.location
        existing_camera.capacity = camera.capacity
        existing_camera.filename = camera.filename

        db.commit()
        db.refresh(existing_camera)

        return existing_camera

    # --------------------------------------------------------
    # CREATE NEW CAMERA
    # --------------------------------------------------------

    db_camera = crud.create_camera(
        db,
        camera
    )

    return db_camera


# ============================================================
# GET ALL CAMERAS
# ============================================================

@router.get(
    "",
    response_model=list[schemas.CameraOut]
)
def list_cameras(
    db: Session = Depends(get_db)
):
    return crud.get_cameras(db)


# ============================================================
# GET SINGLE CAMERA
# ============================================================

@router.get(
    "/{camera_id}",
    response_model=schemas.CameraOut
)
def get_camera(
    camera_id: int,
    db: Session = Depends(get_db)
):
    camera = crud.get_camera(
        db,
        camera_id
    )

    if not camera:
        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    return camera


# ============================================================
# DELETE CAMERA
# ============================================================

@router.delete("/{camera_id}")
def delete_camera(
    camera_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_camera(
        db,
        camera_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )

    return {
        "success": True
    }


# ============================================================
# NORMALIZE CAMERA NAMES
# ============================================================

@router.post("/normalize-names")
def normalize_camera_names(
    db: Session = Depends(get_db)
):
    cameras = crud.get_cameras(db)

    updated = []

    for camera in cameras:

        # Existing IDs 1-6 become the six fixed slots
        if camera.id <= 6:

            new_name = (
                f"CAM-{camera.id:02d}"
            )

            if camera.name != new_name:

                camera.name = new_name

                updated.append({
                    "id": camera.id,
                    "name": new_name
                })

    db.commit()

    return {
        "success": True,
        "message": "Camera slots normalized successfully",
        "updated": updated,
        "total_cameras": len(cameras)
    }