from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# CAMERA SCHEMAS
# ============================================================

class CameraCreate(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: int = 500
    filename: Optional[str] = None


class CameraOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    location: Optional[str] = None
    capacity: int
    filename: Optional[str] = None
    created_at: datetime


# ============================================================
# ANALYSIS RESULT SCHEMAS
# ============================================================

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    confidence: float


class AnalysisResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    camera_id: Optional[int] = None
    filename: str
    people_count: int
    average_people: float
    crowd_density: float
    risk_level: str
    boxes: list[BoundingBox]
    created_at: datetime


# ============================================================
# ANALYTICS SCHEMAS
# ============================================================

class RiskLevelBreakdown(BaseModel):
    LOW: int = 0
    MEDIUM: int = 0
    HIGH: int = 0
    CRITICAL: int = 0


class AnalyticsSummary(BaseModel):
    total_analyses: int
    average_crowd_density: float
    peak_people_count: int
    risk_level_breakdown: RiskLevelBreakdown
    latest_risk_level: Optional[str] = None