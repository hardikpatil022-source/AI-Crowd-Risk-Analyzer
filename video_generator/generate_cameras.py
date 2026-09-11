import cv2
import os
from config import CAMERAS
from camera_effects import adjust_brightness, draw_overlay


SOURCE_VIDEO = "concert.mp4"
OUTPUT_DIR = "output"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def create_fixed_crop(frame, camera):
    """
    Creates a completely fixed CCTV view.

    x, y, w, h are normalized coordinates.
    They are calculated ONCE and never changed.
    """

    height, width = frame.shape[:2]

    x = int(camera["x"] * width)
    y = int(camera["y"] * height)

    crop_w = int(camera["w"] * width)
    crop_h = int(camera["h"] * height)

    # Keep crop inside frame
    x = clamp(x, 0, width - 1)
    y = clamp(y, 0, height - 1)

    crop_w = min(crop_w, width - x)
    crop_h = min(crop_h, height - y)

    crop = frame[
        y:y + crop_h,
        x:x + crop_w
    ]

    return crop


def resize_to_output(frame, output_width, output_height):
    return cv2.resize(
        frame,
        (output_width, output_height),
        interpolation=cv2.INTER_LINEAR
    )


def main():

    source_path = SOURCE_VIDEO

    if not os.path.exists(source_path):
        print(f"ERROR: Source video not found: {source_path}")
        return

    cap = cv2.VideoCapture(source_path)

    if not cap.isOpened():
        print("ERROR: Could not open source video.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    source_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    source_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print()
    print("========================================")
    print(" FIXED CCTV CAMERA GENERATOR")
    print("========================================")
    print(f"Source: {source_path}")
    print(f"Resolution: {source_width}x{source_height}")
    print(f"FPS: {fps}")
    print(f"Frames: {total_frames}")
    print()
    print("No camera shake")
    print("No stabilization")
    print("No moving crop")
    print("No artificial zoom")
    print("Fixed CCTV viewpoints")
    print()

    # Same output resolution for every CCTV feed
    OUTPUT_WIDTH = 1280
    OUTPUT_HEIGHT = 720

    writers = []

    # Create six video writers
    for camera in CAMERAS:

        camera_id = camera["id"]
        camera_name = camera["name"]

        output_path = os.path.join(
            OUTPUT_DIR,
            f"{camera_id}.mp4"
        )

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")

        writer = cv2.VideoWriter(
            output_path,
            fourcc,
            fps,
            (OUTPUT_WIDTH, OUTPUT_HEIGHT)
        )

        if not writer.isOpened():
            print(f"ERROR: Could not create {output_path}")
            cap.release()
            return

        writers.append(writer)

        print(
            f"{camera_id} -> {camera_name}"
        )

    print()
    print("Generating fixed CCTV feeds...")
    print()

    frame_number = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        # IMPORTANT:
        # The frame is never shifted, rotated or stabilized.
        # Every camera uses the same frame at the same timestamp.

        for index, camera in enumerate(CAMERAS):

            # Fixed crop
            crop = create_fixed_crop(
                frame,
                camera
            )

            if crop.size == 0:
                continue

            # Resize fixed viewpoint
            output_frame = resize_to_output(
                crop,
                OUTPUT_WIDTH,
                OUTPUT_HEIGHT
            )

            # Brightness only
            brightness = camera.get(
                "brightness",
                1.0
            )

            output_frame = adjust_brightness(
                output_frame,
                brightness
            )

            # CCTV overlay
            output_frame = draw_overlay(
                output_frame,
                camera["id"],
                camera["name"]
            )

            writers[index].write(
                output_frame
            )

        frame_number += 1

        if frame_number % 50 == 0:

            percentage = (
                frame_number / total_frames
            ) * 100

            print(
                f"Processed "
                f"{frame_number}/{total_frames} "
                f"({percentage:.1f}%)"
            )

    cap.release()

    for writer in writers:
        writer.release()

    print()
    print("========================================")
    print("DONE")
    print("========================================")
    print()
    print("Generated CCTV feeds:")

    for camera in CAMERAS:
        print(
            f"{camera['id']} -> "
            f"{OUTPUT_DIR}/{camera['id']}.mp4"
        )

    print()
    print("All cameras are:")
    print("- Fixed")
    print("- Steady")
    print("- Synchronized")
    print("- Different viewpoints")
    print()


if __name__ == "__main__":
    main()