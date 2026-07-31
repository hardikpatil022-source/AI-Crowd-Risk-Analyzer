import { useState } from "react";
import "../../styles/camera-feed.css";
import {
  FaExpandAlt,
  FaCircle,
  FaChevronRight,
} from "react-icons/fa";

function CameraFeed({
  location,
  video,
  cameraNo,
}) {

  const cameras = [
    "CAM-01",
    "CAM-02",
    "CAM-03",
    "CAM-04",
    "CAM-05",
    "CAM-06",
  ];

  const [activeCam, setActiveCam] = useState(cameraNo || "CAM-01");

  return (

    <section className="camera-section">

      {/* HEADER */}

      <div className="camera-header">

        <div className="camera-left">

          <span className="live-badge">
            <FaCircle />
            LIVE
          </span>

          <h2>{activeCam}</h2>

          <span className="camera-location">
            • {location}
          </span>

        </div>

        <div className="camera-right">

          <span className="camera-pill">
            FPS: 30
          </span>

          <span className="camera-pill">
            1920×1080
          </span>

          <span className="camera-pill rec">
            ● REC
          </span>

          <button className="fullscreen-btn">
            <FaExpandAlt />
          </button>

        </div>

      </div>

      {/* VIDEO */}

      <div className="video-wrapper">

        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* CAMERA TABS */}

        <div className="camera-tabs">

          {cameras.map((cam) => (

            <button
              key={cam}
              className={activeCam === cam ? "active" : ""}
              onClick={() => setActiveCam(cam)}
            >

              {activeCam === cam && (
                <span className="camera-dot"></span>
              )}

              {cam}

            </button>

          ))}

          <button className="arrow">

            <FaChevronRight />

          </button>

        </div>

      </div>

    </section>

  );

}

export default CameraFeed;