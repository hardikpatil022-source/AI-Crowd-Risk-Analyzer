from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(prefix="/analysis-history", tags=["history"])


@router.get("", response_model=list[schemas.AnalysisResultOut])
def list_history(
    camera_id: Optional[int] = None,
    risk_level: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    return crud.get_analysis_history(
        db,
        camera_id=camera_id,
        risk_level=risk_level,
        limit=limit,
        offset=offset
    )


@router.get("/{analysis_id}", response_model=schemas.AnalysisResultOut)
def get_history_item(analysis_id: int, db: Session = Depends(get_db)):
    result = crud.get_analysis_by_id(db, analysis_id)

    if not result:
        raise HTTPException(status_code=404, detail="Analysis result not found")

    return result


@router.delete("/{analysis_id}")
def delete_history_item(analysis_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_analysis(db, analysis_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis result not found")

    return {"success": True}