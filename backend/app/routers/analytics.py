from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=schemas.AnalyticsSummary)
def analytics_summary(
    camera_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return crud.get_analytics_summary(db, camera_id=camera_id)