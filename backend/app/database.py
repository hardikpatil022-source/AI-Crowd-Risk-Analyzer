import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ============================================================
# DATABASE CONFIGURATION
# ============================================================

# SQLite file lives inside backend/ so it survives restarts.
# Can be swapped for Postgres later by changing this URL
# (e.g. "postgresql://user:pass@host/dbname") without touching
# any model or router code.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(BASE_DIR, 'crowd_risk.db')}"
)

connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# ============================================================
# FASTAPI DEPENDENCY
# ============================================================

def get_db():
    """Yields a DB session per-request and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()