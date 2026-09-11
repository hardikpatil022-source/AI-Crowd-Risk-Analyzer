from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(prefix="/cameras", tags=["cameras"])


@router.post("", response_model=schemas.CameraOut)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    return crud.create_camera(db, camera)


@router.get("", response_model=list[schemas.CameraOut])
def list_cameras(db: Session = Depends(get_db)):
    return crud.get_cameras(db)


@router.get("/{camera_id}", response_model=schemas.CameraOut)
def get_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = crud.get_camera(db, camera_id)

    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")

    return camera


@router.delete("/{camera_id}")
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_camera(db, camera_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Camera not found")

    return {"success": True}