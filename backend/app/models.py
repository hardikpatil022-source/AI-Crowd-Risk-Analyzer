from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


# ============================================================
# CAMERA
# ============================================================
# Represents a CCTV source the user registered via "Add CCTV".
# Analyses are optionally linked back to a camera so history /
# analytics can be grouped per-camera.

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    capacity = Column(Integer, nullable=False, default=500)
    filename = Column(String, nullable=True)  # last associated video
    created_at = Column(DateTime, default=utc_now)

    analyses = relationship(
        "AnalysisResult",
        back_populates="camera",
        cascade="all, delete-orphan"
    )


# ============================================================
# ANALYSIS RESULT
# ============================================================
# One row per /analyze-video call. This is what powers
# Analysis History, Analytics, Reports, and Alerts.

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)

    camera_id = Column(
        Integer,
        ForeignKey("cameras.id"),
        nullable=True
    )

    filename = Column(String, nullable=False)

    people_count = Column(Integer, nullable=False)
    average_people = Column(Float, nullable=False)
    crowd_density = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)

    # List of {x1, y1, x2, y2, confidence} dicts for the busiest frame
    boxes = Column(JSON, nullable=False, default=list)

    created_at = Column(DateTime, default=utc_now, index=True)

    camera = relationship("Camera", back_populates="analyses")