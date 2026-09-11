import {
  FaExclamationTriangle,
  FaCircle,
} from "react-icons/fa";

function AlertPanel({ camera }) {

  return (
    <section className="alert-panel">

      <div className="alert-header">

        <div>
          <span className="panel-label">
            SECURITY MONITORING
          </span>

          <h2>
            Alert Timeline
          </h2>
        </div>

        <span className="alert-live">
          <FaCircle />
          LIVE
        </span>

      </div>

      <div className="alert-list">

        <div className="alert-item high">

          <FaExclamationTriangle />

          <div>
            <strong>
              High Density Detected
            </strong>

            <span>
              {camera?.id || "CAM-01"} • Just now
            </span>
          </div>

          <b>
            HIGH
          </b>

        </div>

        <div className="alert-item warning">

          <FaExclamationTriangle />

          <div>
            <strong>
              Unusual Movement
            </strong>

            <span>
              CAM-03 • 2 min ago
            </span>
          </div>

          <b>
            MEDIUM
          </b>

        </div>

        <div className="alert-item normal">

          <FaCircle />

          <div>
            <strong>
              Crowd Gathering
            </strong>

            <span>
              CAM-02 • 5 min ago
            </span>
          </div>

          <b>
            LOW
          </b>

        </div>

      </div>

    </section>
  );
}

export default AlertPanel;