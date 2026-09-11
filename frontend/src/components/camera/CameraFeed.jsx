import { useEffect, useRef, useState } from "react";
import {
  FaExpandAlt,
  FaCircle,
  FaPlay,
} from "react-icons/fa";

import "../../styles/camera-feed.css";

function CameraFeed({
  location,
  video,
  cameraNo,
  cameraName,
}) {
  const videoRef = useRef(null);

  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /* =========================================
     RESET VIDEO WHEN CAMERA CHANGES
  ========================================= */

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(false);

    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.pause();
    videoElement.load();

    const playVideo = async () => {
      try {
        await videoElement.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay waiting:", error);
      }
    };

    playVideo();
  }, [video]);

  /* =========================================
     FULLSCREEN
  ========================================= */

  const handleFullscreen = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    }
  };

  /* =========================================
     MANUAL PLAY
  ========================================= */

  const handlePlay = async () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    try {
      await videoElement.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Video play failed:", error);
    }
  };

  /* =========================================
     VIDEO ERROR
  ========================================= */

  const handleVideoError = () => {
    console.error("Unable to load camera video:", video);
    setVideoError(true);
  };

  return (
    <section className="camera-section">

      {/* =====================================
          CAMERA HEADER
      ===================================== */}

      <div className="camera-header">

        <div className="camera-left">

          <span className="live-badge">
            <FaCircle />
            LIVE
          </span>

          <h2>{cameraNo}</h2>

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

          <button
            type="button"
            className="fullscreen-btn"
            onClick={handleFullscreen}
            title="Fullscreen"
          >
            <FaExpandAlt />
          </button>

        </div>

      </div>


      {/* =====================================
          VIDEO AREA
      ===================================== */}

      <div className="video-wrapper">

        <video
          ref={videoRef}
          key={video}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"

          onLoadedData={() => {
            console.log(`Loaded: ${cameraNo}`);
            setVideoError(false);
          }}

          onCanPlay={() => {
            console.log(`Can play: ${cameraNo}`);
          }}

          onPlay={() => {
            setIsPlaying(true);
          }}

          onPause={() => {
            setIsPlaying(false);
          }}

          onError={handleVideoError}
        />

        {/* =================================
            VIDEO ERROR
        ================================= */}

        {videoError && (
          <div className="video-message">

            <div className="video-message-title">
              Camera Offline
            </div>

            <div className="video-message-text">
              Unable to load {cameraNo}
            </div>

            <div className="video-message-path">
              {video}
            </div>

          </div>
        )}


        {/* =================================
            MANUAL PLAY BUTTON
        ================================= */}

        {!videoError && !isPlaying && (
          <button
            type="button"
            className="video-play-button"
            onClick={handlePlay}
          >
            <FaPlay />
            <span>Play Camera</span>
          </button>
        )}

      </div>

    </section>
  );
}

export default CameraFeed;