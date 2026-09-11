from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas


# ============================================================
# CAMERAS
# ============================================================

def create_camera(db: Session, camera: schemas.CameraCreate) -> models.Camera:
    db_camera = models.Camera(**camera.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera


def get_cameras(db: Session):
    return db.query(models.Camera).order_by(models.Camera.created_at.desc()).all()


def get_camera(db: Session, camera_id: int):
    return db.query(models.Camera).filter(models.Camera.id == camera_id).first()


def delete_camera(db: Session, camera_id: int) -> bool:
    camera = get_camera(db, camera_id)
    if not camera:
        return False
    db.delete(camera)
    db.commit()
    return True


# ============================================================
# ANALYSIS RESULTS
# ============================================================

def save_analysis_result(
    db: Session,
    filename: str,
    result: dict,
    camera_id: int | None = None
) -> models.AnalysisResult:
    db_result = models.AnalysisResult(
        camera_id=camera_id,
        filename=filename,
        people_count=result["people_count"],
        average_people=result["average_people"],
        crowd_density=result["crowd_density"],
        risk_level=result["risk_level"],
        boxes=result["boxes"],
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    # Keep the camera's "last associated video" in sync, if linked
    if camera_id is not None:
        camera = get_camera(db, camera_id)
        if camera:
            camera.filename = filename
            db.commit()

    return db_result


def get_analysis_history(
    db: Session,
    camera_id: int | None = None,
    risk_level: str | None = None,
    limit: int = 50,
    offset: int = 0
):
    query = db.query(models.AnalysisResult)

    if camera_id is not None:
        query = query.filter(models.AnalysisResult.camera_id == camera_id)

    if risk_level is not None:
        query = query.filter(models.AnalysisResult.risk_level == risk_level.upper())

    return (
        query.order_by(models.AnalysisResult.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_analysis_by_id(db: Session, analysis_id: int):
    return (
        db.query(models.AnalysisResult)
        .filter(models.AnalysisResult.id == analysis_id)
        .first()
    )


def delete_analysis(db: Session, analysis_id: int) -> bool:
    result = get_analysis_by_id(db, analysis_id)
    if not result:
        return False
    db.delete(result)
    db.commit()
    return True


# ============================================================
# ANALYTICS
# ============================================================

def get_analytics_summary(db: Session, camera_id: int | None = None) -> dict:
    query = db.query(models.AnalysisResult)

    if camera_id is not None:
        query = query.filter(models.AnalysisResult.camera_id == camera_id)

    total_analyses = query.count()

    if total_analyses == 0:
        return {
            "total_analyses": 0,
            "average_crowd_density": 0,
            "peak_people_count": 0,
            "risk_level_breakdown": {
                "LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0
            },
            "latest_risk_level": None
        }

    average_crowd_density = query.with_entities(
        func.avg(models.AnalysisResult.crowd_density)
    ).scalar() or 0

    peak_people_count = query.with_entities(
        func.max(models.AnalysisResult.people_count)
    ).scalar() or 0

    breakdown = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}

    counts = (
        query.with_entities(
            models.AnalysisResult.risk_level,
            func.count(models.AnalysisResult.id)
        )
        .group_by(models.AnalysisResult.risk_level)
        .all()
    )

    for level, count in counts:
        if level in breakdown:
            breakdown[level] = count

    latest = (
        query.order_by(models.AnalysisResult.created_at.desc()).first()
    )

    return {
        "total_analyses": total_analyses,
        "average_crowd_density": round(average_crowd_density, 1),
        "peak_people_count": peak_people_count,
        "risk_level_breakdown": breakdown,
        "latest_risk_level": latest.risk_level if latest else None
    }