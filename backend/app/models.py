from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    capacity = Column(Integer, default=500)
    filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship(
        "AnalysisResult",
        back_populates="camera",
        cascade="all, delete-orphan"
    )


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)

    camera_id = Column(
        Integer,
        ForeignKey("cameras.id"),
        nullable=True
    )

    filename = Column(String, nullable=False)

    people_count = Column(Integer, default=0)

    average_people = Column(Float, default=0)

    crowd_density = Column(Float, default=0)

    risk_level = Column(String, default="LOW")

    boxes = Column(JSON, default=[])

    # EXACT TIME WHEN YOLO SCANNING STARTED
    scan_started_at = Column(DateTime, nullable=True)

    # TIME WHEN THE ANALYSIS RESULT WAS SAVED
    created_at = Column(DateTime, default=datetime.utcnow)

    camera = relationship(
        "Camera",
        back_populates="analyses"
    )