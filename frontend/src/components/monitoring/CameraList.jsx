import { FaCircle, FaVideo } from "react-icons/fa";

function CameraList({
  cameras,
  activeCamera,
  onCameraSelect,
}) {
  return (
    <section className="camera-panel">

      <div className="monitoring-panel-header">

        <div>
          <span className="panel-label">
            CAMERA NETWORK
          </span>

          <h2>Cameras</h2>
        </div>

        <span className="camera-count">
          {cameras.length} ACTIVE
        </span>

      </div>

      <div className="monitoring-camera-list">

        {cameras.map((camera) => {

          const isActive =
            activeCamera?.id === camera.id;

          return (
            <button
              key={camera.id}
              type="button"
              className={`monitoring-camera-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => onCameraSelect(camera)}
            >

              <div className="monitoring-camera-icon">
                <FaVideo />
              </div>

              <div className="monitoring-camera-info">

                <strong>
                  {camera.id}
                </strong>

                <span>
                  {camera.location || "Zone not set"}
                </span>

              </div>

              <FaCircle
                className="monitoring-status"
              />

            </button>
          );
        })}

      </div>

    </section>
  );
}

export default CameraList;