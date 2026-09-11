import { useEffect, useRef, useState } from "react";

import {
  FaCircle,
  FaExpandAlt,
  FaVideo,
} from "react-icons/fa";


function LiveVideo({
  camera,
  analysis,
  analyzing,
}) {

  const videoRef = useRef(null);

  const [videoSize, setVideoSize] = useState({
    width: 1280,
    height: 720,
  });


  /*
   * Play selected camera video
   */
  useEffect(() => {

    if (videoRef.current) {

      videoRef.current.load();

      const playPromise =
        videoRef.current.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {});

      }

    }

  }, [camera?.video]);


  /*
   * Get actual video dimensions
   */
  const handleVideoMetadata = () => {

    if (!videoRef.current) return;

    const width =
      videoRef.current.videoWidth;

    const height =
      videoRef.current.videoHeight;

    if (width && height) {

      setVideoSize({
        width,
        height,
      });

    }

  };


  /*
   * Fullscreen
   */
  const openFullscreen = () => {

    if (!videoRef.current) return;

    if (videoRef.current.requestFullscreen) {

      videoRef.current.requestFullscreen();

    }

  };


  /*
   * YOLO detection boxes
   *
   * These boxes come from
   * MonitoringLayout -> FastAPI -> YOLO
   */
  const boxes =
    Array.isArray(analysis?.boxes)
      ? analysis.boxes
      : [];


  return (

    <section className="video-panel">


      {/* =========================
          PANEL HEADER
      ========================== */}

      <div className="monitoring-panel-header">

        <div>

          <span className="panel-label">
            LIVE FEED
          </span>

          <h2>
            {camera?.id || "CAM-01"}
          </h2>

        </div>


        <div className="live-indicator">

          <FaCircle />

          LIVE

        </div>

      </div>


      {/* =========================
          VIDEO CONTAINER
      ========================== */}

      <div className="monitoring-video-container">


        {camera?.video ? (

          <>


            {/* =========================
                CCTV VIDEO
            ========================== */}

            <video
              ref={videoRef}
              key={camera.video}
              src={camera.video}
              autoPlay
              muted
              loop
              playsInline
              controls
              onLoadedMetadata={
                handleVideoMetadata
              }
            />


            {/* =========================
                YOLO DETECTION OVERLAY
            ========================== */}

            <div
              className="detection-overlay"
              style={{
                aspectRatio:
                  `${videoSize.width} / ${videoSize.height}`,
              }}
            >


              {boxes.map(
                (box, index) => {


                  const left =
                    (box.x1 /
                      videoSize.width) *
                    100;


                  const top =
                    (box.y1 /
                      videoSize.height) *
                    100;


                  const width =
                    ((box.x2 - box.x1) /
                      videoSize.width) *
                    100;


                  const height =
                    ((box.y2 - box.y1) /
                      videoSize.height) *
                    100;


                  return (

                    <div
                      key={index}
                      className="person-box"
                      style={{
                        left:
                          `${left}%`,

                        top:
                          `${top}%`,

                        width:
                          `${width}%`,

                        height:
                          `${height}%`,
                      }}
                    >


                      <span className="person-label">

                        PERSON{" "}

                        {Math.round(
                          box.confidence * 100
                        )}

                        %

                      </span>


                    </div>

                  );

                }
              )}


            </div>


            {/* =========================
                ANALYZING INDICATOR
            ========================== */}

            {analyzing && (

              <div className="analysis-status">

                <FaCircle />

                ANALYZING CROWD...

              </div>

            )}


          </>

        ) : (


          /* =========================
             NO VIDEO
          ========================== */

          <div className="video-empty">

            <FaVideo />

            <h3>
              No Video Available
            </h3>

            <p>
              Upload CCTV footage to
              view the live feed.
            </p>

          </div>

        )}


        {/* =========================
            VIDEO BOTTOM OVERLAY
        ========================== */}

        <div className="video-overlay">


          <div className="video-camera-name">

            {camera?.name || camera?.id}

          </div>


          <button
            type="button"
            className="fullscreen-monitor-btn"
            onClick={openFullscreen}
            title="Fullscreen"
          >

            <FaExpandAlt />

          </button>


        </div>


      </div>


    </section>

  );

}


export default LiveVideo;