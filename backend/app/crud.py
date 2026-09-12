from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app import models, schemas


# ============================================================
# CAMERA CRUD
# ============================================================

def create_camera(
    db: Session,
    camera: schemas.CameraCreate
):
    db_camera = models.Camera(
        name=camera.name,
        location=camera.location,
        capacity=camera.capacity,
        filename=camera.filename,
    )

    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)

    return db_camera


def get_cameras(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(models.Camera)
        .order_by(models.Camera.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_camera(
    db: Session,
    camera_id: int
):
    return (
        db.query(models.Camera)
        .filter(models.Camera.id == camera_id)
        .first()
    )


def delete_camera(
    db: Session,
    camera_id: int
):
    camera = get_camera(db, camera_id)

    if not camera:
        return None

    db.delete(camera)
    db.commit()

    return camera


# ============================================================
# ANALYSIS RESULT CRUD
# ============================================================

def save_analysis_result(
    db: Session,
    camera_id: Optional[int],
    filename: str,
    people_count: int,
    average_people: float,
    crowd_density: float,
    risk_level: str,
    boxes: list,
    scan_started_at: Optional[datetime] = None,
):
    result = models.AnalysisResult(
        camera_id=camera_id,
        filename=filename,
        people_count=people_count,
        average_people=average_people,
        crowd_density=crowd_density,
        risk_level=risk_level,
        boxes=boxes,
        scan_started_at=scan_started_at,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    # --------------------------------------------------------
    # Keep the camera's latest filename updated
    # --------------------------------------------------------
    if camera_id is not None:
        camera = (
            db.query(models.Camera)
            .filter(models.Camera.id == camera_id)
            .first()
        )

        if camera:
            camera.filename = filename
            db.commit()
            db.refresh(camera)

    return result


def get_analysis_result(
    db: Session,
    analysis_id: int
):
    return (
        db.query(models.AnalysisResult)
        .filter(models.AnalysisResult.id == analysis_id)
        .first()
    )


def delete_analysis_result(
    db: Session,
    analysis_id: int
):
    analysis = get_analysis_result(db, analysis_id)

    if not analysis:
        return None

    db.delete(analysis)
    db.commit()

    return analysis


# ============================================================
# ANALYSIS HISTORY
# ============================================================

def get_analysis_history(
    db: Session,
    camera_id: Optional[int] = None,
    risk_level: Optional[str] = None,
    offset: int = 0,
    limit: int = 100
):
    """
    Return analysis history.

    Optional filters:
        camera_id  -> return results for one camera
        risk_level -> return results for one risk level

    Results are sorted newest first.

    offset is used instead of skip because the history router
    passes an 'offset' argument.
    """

    query = db.query(models.AnalysisResult)

    # --------------------------------------------------------
    # Filter by camera
    # --------------------------------------------------------
    if camera_id is not None:
        query = query.filter(
            models.AnalysisResult.camera_id == camera_id
        )

    # --------------------------------------------------------
    # Filter by risk level
    # --------------------------------------------------------
    if risk_level is not None:
        query = query.filter(
            models.AnalysisResult.risk_level == risk_level.upper()
        )

    # --------------------------------------------------------
    # Newest scan first
    #
    # New records:
    #   scan_started_at is used
    #
    # Old records:
    #   scan_started_at may be NULL, so created_at is used
    # --------------------------------------------------------
    query = query.order_by(
        models.AnalysisResult.scan_started_at.desc().nullslast(),
        models.AnalysisResult.created_at.desc()
    )

    return (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )


# ============================================================
# ANALYTICS SUMMARY
# ============================================================

def get_analytics_summary(
    db: Session,
    camera_id: Optional[int] = None
):
    """
    Generate analytics summary.

    If camera_id is provided, only analyses belonging to
    that camera are included.
    """

    query = db.query(models.AnalysisResult)

    # --------------------------------------------------------
    # Filter by camera
    # --------------------------------------------------------
    if camera_id is not None:
        query = query.filter(
            models.AnalysisResult.camera_id == camera_id
        )

    analyses = query.all()

    # --------------------------------------------------------
    # No analysis data
    # --------------------------------------------------------
    if not analyses:
        return {
            "total_analyses": 0,
            "average_crowd_density": 0,
            "peak_people_count": 0,
            "risk_level_breakdown": {
                "LOW": 0,
                "MEDIUM": 0,
                "HIGH": 0,
                "CRITICAL": 0,
            },
            "latest_risk_level": None,
        }

    # --------------------------------------------------------
    # Total analyses
    # --------------------------------------------------------
    total_analyses = len(analyses)

    # --------------------------------------------------------
    # Average crowd density
    # --------------------------------------------------------
    density_values = [
        float(analysis.crowd_density or 0)
        for analysis in analyses
    ]

    average_crowd_density = (
        sum(density_values) / len(density_values)
        if density_values
        else 0
    )

    # --------------------------------------------------------
    # Peak people count
    # --------------------------------------------------------
    peak_people_count = max(
        int(analysis.people_count or 0)
        for analysis in analyses
    )

    # --------------------------------------------------------
    # Risk level breakdown
    # --------------------------------------------------------
    risk_level_breakdown = {
        "LOW": 0,
        "MEDIUM": 0,
        "HIGH": 0,
        "CRITICAL": 0,
    }

    for analysis in analyses:
        risk = str(
            analysis.risk_level or "LOW"
        ).upper()

        if risk in risk_level_breakdown:
            risk_level_breakdown[risk] += 1

    # --------------------------------------------------------
    # Find latest analysis
    # --------------------------------------------------------
    latest_analysis = max(
        analyses,
        key=lambda item: (
            item.scan_started_at
            or item.created_at
            or datetime.min
        )
    )

    latest_risk_level = (
        latest_analysis.risk_level
        if latest_analysis
        else None
    )

    # --------------------------------------------------------
    # Return summary
    # --------------------------------------------------------
    return {
        "total_analyses": total_analyses,
        "average_crowd_density": round(
            average_crowd_density,
            2
        ),
        "peak_people_count": peak_people_count,
        "risk_level_breakdown": risk_level_breakdown,
        "latest_risk_level": latest_risk_level,
    }