import os
import shutil
import uuid

from fastapi import UploadFile

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

async def save_video(file: UploadFile):

    # Prefix with a short unique token so two cameras uploading a
    # file with the same original name (e.g. "video.mp4") never
    # collide and silently overwrite each other.
    unique_prefix = uuid.uuid4().hex[:8]

    safe_filename = f"{unique_prefix}_{file.filename}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        safe_filename
    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return safe_filename