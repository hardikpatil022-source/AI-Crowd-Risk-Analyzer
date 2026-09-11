import cv2
from datetime import datetime


# ==========================================
# ADJUST CAMERA BRIGHTNESS
# ==========================================

def adjust_brightness(frame, factor):

    return cv2.convertScaleAbs(
        frame,
        alpha=factor,
        beta=0
    )


# ==========================================
# CCTV OVERLAY
# ==========================================

def draw_overlay(frame, camera_id, camera_name):

    h, w = frame.shape[:2]


    # --------------------------------------
    # TOP CCTV BAR
    # --------------------------------------

    cv2.rectangle(
        frame,
        (0, 0),
        (w, 48),
        (12, 16, 25),
        -1
    )


    # --------------------------------------
    # CAMERA ID
    # --------------------------------------

    cv2.putText(
        frame,
        camera_id,
        (20, 32),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (255, 255, 255),
        2,
        cv2.LINE_AA
    )


    # --------------------------------------
    # CAMERA NAME
    # --------------------------------------

    cv2.putText(
        frame,
        camera_name,
        (125, 32),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (180, 190, 205),
        1,
        cv2.LINE_AA
    )


    # --------------------------------------
    # LIVE INDICATOR
    # --------------------------------------

    cv2.circle(
        frame,
        (w - 150, 24),
        6,
        (0, 0, 255),
        -1
    )

    cv2.putText(
        frame,
        "LIVE",
        (w - 135, 31),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2,
        cv2.LINE_AA
    )


    # --------------------------------------
    # TIMESTAMP
    # --------------------------------------

    timestamp = datetime.now().strftime(
        "%d/%m/%Y  %H:%M:%S"
    )


    text_size = cv2.getTextSize(
        timestamp,
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        1
    )[0]


    cv2.putText(
        frame,
        timestamp,
        (
            w - text_size[0] - 20,
            h - 20
        ),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (220, 220, 220),
        1,
        cv2.LINE_AA
    )


    return frame