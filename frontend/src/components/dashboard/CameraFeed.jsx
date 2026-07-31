import "../../styles/camera-feed.css";

import { FaExpandAlt } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";

function CameraFeed({
  cameraName,
  location,
  video,
  cameraNo,
}) {
  return (
    <section className="camera-section">

      {/* Camera Header */}
      <div className="camera-header">

        <div className="camera-left">

          <span className="live-badge">
            <FaCircle />
            LIVE
          </span>

          <h2>{cameraNo}</h2>

          <span className="camera-location">
            {location}
          </span>

        </div>

        <div className="camera-right">

          <span>YOLOv8 + AI</span>

          <span>Latency 22 ms</span>

          <span>FPS 30</span>

        </div>

      </div>

      {/* Camera Video */}
      <div className="video-wrapper">

        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />

        <button className="fullscreen-btn">
          <FaExpandAlt />
        </button>

        <div className="video-footer">

          <span>{cameraName}</span>

          <span>{new Date().toLocaleTimeString()}</span>

        </div>

      </div>

    </section>
  );
}

export default CameraFeed;