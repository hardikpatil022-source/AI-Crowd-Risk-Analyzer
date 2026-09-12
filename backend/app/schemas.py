from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ============================================================
# CAMERA SCHEMAS
# ============================================================

class CameraCreate(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: int = 500
    filename: Optional[str] = None


class CameraOut(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    capacity: int
    filename: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# BOUNDING BOX
# ============================================================

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    confidence: float
    class_id: Optional[int] = None
    class_name: Optional[str] = None


# ============================================================
# ANALYSIS RESULT
# ============================================================

class AnalysisResultOut(BaseModel):
    id: int

    camera_id: Optional[int] = None

    filename: str

    people_count: int

    average_people: float

    crowd_density: float

    risk_level: str

    boxes: list[BoundingBox]

    # EXACT YOLO START TIME
    scan_started_at: Optional[datetime] = None

    # RESULT SAVE TIME
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# ANALYTICS SUMMARY
# ============================================================

class AnalyticsSummary(BaseModel):
    total_analyses: int

    average_crowd_density: float

    peak_people_count: int

    risk_level_breakdown: dict[str, int]

    latest_risk_level: Optional[str] = None