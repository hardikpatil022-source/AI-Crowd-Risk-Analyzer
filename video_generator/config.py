# ==========================================
# AI CROWD RISK ANALYZER
# CCTV CAMERA CONFIGURATION
# ==========================================

VIDEO_PATH = "concert.mp4"

OUTPUT_FOLDER = "output"

FPS = 50

OUTPUT_WIDTH = 1280

OUTPUT_HEIGHT = 720


# ==========================================
# CAMERA CONFIGURATION
# ==========================================
#
# x, y = starting position of crop
# w, h = size of crop
#
# Values are percentages of the original
# 1280 x 720 source video.
#
# IMPORTANT:
# These crops remain FIXED throughout
# the entire video.
#
# ==========================================

CAMERAS = [

    {
        "id": "CAM-01",
        "name": "Main Stage - Wide",
        "x": 0.00,
        "y": 0.05,
        "w": 1.00,
        "h": 0.90,
        "brightness": 1.00
    },

    {
        "id": "CAM-02",
        "name": "Left Crowd",
        "x": 0.00,
        "y": 0.20,
        "w": 0.48,
        "h": 0.65,
        "brightness": 0.96
    },

    {
        "id": "CAM-03",
        "name": "Center Crowd",
        "x": 0.26,
        "y": 0.22,
        "w": 0.48,
        "h": 0.63,
        "brightness": 1.00
    },

    {
        "id": "CAM-04",
        "name": "Right Crowd",
        "x": 0.52,
        "y": 0.20,
        "w": 0.48,
        "h": 0.65,
        "brightness": 0.94
    },

    {
        "id": "CAM-05",
        "name": "Front Dense Area",
        "x": 0.20,
        "y": 0.48,
        "w": 0.60,
        "h": 0.48,
        "brightness": 0.90
    },

    {
        "id": "CAM-06",
        "name": "Rear Crowd - Wide",
        "x": 0.10,
        "y": 0.08,
        "w": 0.80,
        "h": 0.55,
        "brightness": 0.92
    }

]