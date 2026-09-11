import cv2
from ultralytics import YOLO


# ============================================================
# LOAD YOLO MODEL ONCE
# ============================================================

# YOLO11s is more accurate than YOLO11n,
# especially for smaller people in crowded scenes.
model = YOLO("yolo11s.pt")


# ============================================================
# ANALYZE CCTV VIDEO
# ============================================================

def analyze_video(
    video_path: str,
    camera_capacity: int = 500
):
    """
    Analyze a CCTV video using YOLO.

    Returns:
        people_count
        average_people
        crowd_density
        risk_level
        bounding boxes
    """

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():

        raise ValueError(
            f"Could not open video: {video_path}"
        )


    # ========================================================
    # SETTINGS
    # ========================================================

    # Analyze every 8th frame.
    #
    # 15 was too aggressive and could miss people.
    frame_interval = 8

    # Lower confidence helps detect people
    # that are partially visible or far away.
    confidence_threshold = 0.20

    # Larger image gives YOLO more detail
    # for small/distant people.
    image_size = 960


    counts = []

    best_boxes = []

    max_people = 0

    frame_number = 0


    # ========================================================
    # PROCESS VIDEO
    # ========================================================

    while True:

        success, frame = cap.read()

        if not success:
            break


        frame_number += 1


        # Skip frames for CPU performance
        if frame_number % frame_interval != 0:
            continue


        # ====================================================
        # YOLO DETECTION
        # ====================================================

        results = model(
            frame,
            classes=[0],          # 0 = person
            conf=confidence_threshold,
            imgsz=image_size,
            max_det=300,
            verbose=False
        )


        boxes = []


        # ====================================================
        # EXTRACT PERSON DETECTIONS
        # ====================================================

        for result in results:

            if result.boxes is None:
                continue


            for box in result.boxes:

                # Bounding box
                x1, y1, x2, y2 = (
                    box.xyxy[0]
                    .cpu()
                    .tolist()
                )


                # Confidence
                confidence = float(
                    box.conf[0]
                    .cpu()
                    .item()
                )


                boxes.append({

                    "x1": round(x1, 2),

                    "y1": round(y1, 2),

                    "x2": round(x2, 2),

                    "y2": round(y2, 2),

                    "confidence": round(
                        confidence,
                        3
                    )

                })


        # ====================================================
        # COUNT PEOPLE
        # ====================================================

        people_count = len(boxes)

        counts.append(people_count)


        # ====================================================
        # KEEP BOXES FROM THE FRAME WITH
        # THE HIGHEST NUMBER OF PEOPLE
        # ====================================================

        if people_count > max_people:

            max_people = people_count

            best_boxes = boxes.copy()


    cap.release()


    # ========================================================
    # NO DETECTIONS
    # ========================================================

    if not counts:

        return {

            "people_count": 0,

            "average_people": 0,

            "crowd_density": 0,

            "risk_level": "LOW",

            "boxes": []

        }


    # ========================================================
    # AVERAGE PEOPLE
    # ========================================================

    average_people = round(
        sum(counts) / len(counts),
        1
    )


    # ========================================================
    # CAMERA CAPACITY
    # ========================================================

    if camera_capacity <= 0:

        camera_capacity = 500


    # ========================================================
    # CROWD DENSITY
    # ========================================================

    crowd_density = round(
        (max_people / camera_capacity) * 100,
        1
    )


    # ========================================================
    # RISK LEVEL
    # ========================================================

    if crowd_density < 30:

        risk_level = "LOW"

    elif crowd_density < 60:

        risk_level = "MEDIUM"

    elif crowd_density < 80:

        risk_level = "HIGH"

    else:

        risk_level = "CRITICAL"


    # ========================================================
    # FINAL RESULT
    # ========================================================

    return {

        "people_count": max_people,

        "average_people": average_people,

        "crowd_density": crowd_density,

        "risk_level": risk_level,

        "boxes": best_boxes

    }