import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine, SessionLocal
from app import models

from app.routers.upload import router as upload_router
from app.routers.cameras import router as cameras_router
from app.routers.history import router as history_router
from app.routers.analytics import router as analytics_router

from app.routers.reports import (
    router as reports_router,
    get_latest_analysis_per_camera,
    create_csv_report,
    create_pptx_report,
)


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# BASE DIRECTORIES
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# REPORT DIRECTORY
# ============================================================

REPORTS_DIR = os.path.join(
    BASE_DIR,
    "reports"
)

os.makedirs(
    REPORTS_DIR,
    exist_ok=True
)


# ============================================================
# AUTOMATIC REPORT GENERATOR
# ============================================================

async def automatic_report_generator():

    print(
        "\n=================================================="
    )
    print(
        "AUTOMATIC REPORT GENERATOR STARTED"
    )
    print(
        "A new report will be generated every 60 seconds."
    )
    print(
        "==================================================\n"
    )

    while True:

        try:

            # Wait one minute before creating the next report
            await asyncio.sleep(60)

            db = SessionLocal()

            try:

                rows = get_latest_analysis_per_camera(
                    db
                )

                if not rows:

                    print(
                        "[REPORTS] No YOLO analysis data yet."
                    )

                    continue

                # ------------------------------------------------
                # CSV
                # ------------------------------------------------

                csv_filename = create_csv_report(
                    rows
                )

                # ------------------------------------------------
                # PPTX
                # ------------------------------------------------

                pptx_filename = None

                try:

                    pptx_filename = create_pptx_report(
                        rows
                    )

                except Exception as error:

                    print(
                        "[REPORTS] PPTX generation failed:",
                        error
                    )

                print(
                    "\n[REPORTS] Automatic report generated"
                )

                print(
                    f"[REPORTS] CSV: {csv_filename}"
                )

                if pptx_filename:

                    print(
                        f"[REPORTS] PPTX: {pptx_filename}"
                    )

                print(
                    f"[REPORTS] Cameras: {len(rows)}"
                )

            finally:

                db.close()

        except asyncio.CancelledError:

            print(
                "[REPORTS] Automatic report generator stopped."
            )

            break

        except Exception as error:

            print(
                "[REPORTS] Automatic generation error:",
                error
            )


# ============================================================
# FASTAPI LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Start automatic report generator
    report_task = asyncio.create_task(
        automatic_report_generator()
    )

    try:

        yield

    finally:

        # Stop automatic report generator
        report_task.cancel()

        try:

            await report_task

        except asyncio.CancelledError:

            pass


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI Crowd Risk Analyzer",
    description="AI-powered crowd detection and risk analysis system",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

# Video upload + YOLO analysis
app.include_router(
    upload_router
)

# CCTV camera management
app.include_router(
    cameras_router
)

# Analysis history
app.include_router(
    history_router
)

# Analytics
app.include_router(
    analytics_router
)

# Reports
app.include_router(
    reports_router
)


# ============================================================
# SERVE UPLOADED VIDEOS
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=UPLOAD_DIR
    ),
    name="uploads"
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "AI Crowd Risk Analyzer API is running",
        "status": "online"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }