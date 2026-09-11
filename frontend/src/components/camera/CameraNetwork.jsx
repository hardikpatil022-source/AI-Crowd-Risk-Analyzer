import "./CameraNetwork.css";

import cameras from "../../data/cameras";


function CameraNetwork({
  activeCamera,
  onCameraSelect,
}) {

  return (
    <section className="camera-network">

      {/* =========================================
          CAMERA NETWORK HEADER
      ========================================= */}

      <div className="camera-network-header">

        <div>

          <span className="camera-network-label">
            CAMERA NETWORK
          </span>

          <h2>
            Connected Surveillance Zones
          </h2>

        </div>


        <span className="active-camera-count">
          {cameras.length} ACTIVE CAMERAS
        </span>

      </div>


      {/* =========================================
          CAMERA GRID
      ========================================= */}

      <div className="camera-grid">

        {cameras.map((camera) => {

          const isActive =
            activeCamera?.id === camera.id;


          return (

            <button
              key={camera.id}
              type="button"

              className={`camera-box ${
                isActive ? "active" : ""
              }`}

              onClick={() => {

                console.log(
                  "Switching camera:",
                  camera.id,
                  camera.video
                );

                onCameraSelect(camera);

              }}
            >

              {/* ===============================
                  CAMERA TITLE
              ================================ */}

              <div className="camera-title">

                <span className="camera-status-dot"></span>

                <strong>
                  {camera.id}
                </strong>

              </div>


              {/* ===============================
                  CAMERA LOCATION
              ================================ */}

              <span className="camera-location">

                {camera.location}

              </span>

            </button>

          );

        })}

      </div>

    </section>
  );
}


export default CameraNetwork;