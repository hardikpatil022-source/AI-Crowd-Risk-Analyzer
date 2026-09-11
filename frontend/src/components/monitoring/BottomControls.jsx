import {
  FaBell,
  FaBullhorn,
  FaMapMarkedAlt,
  FaVolumeUp,
} from "react-icons/fa";

function BottomControls({ camera }) {

  const handleAction = (action) => {
    console.log(`${action} triggered for ${camera?.id}`);
  };

  return (
    <section className="bottom-controls">

      <div className="bottom-controls-title">

        <span className="panel-label">
          CONTROL ROOM
        </span>

        <h2>
          Quick Actions
        </h2>

      </div>

      <div className="control-buttons">

        <button
          type="button"
          onClick={() => handleAction("Send Alert")}
        >
          <FaBell />

          <span>
            Send Alert
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("Siren")}
        >
          <FaVolumeUp />

          <span>
            Siren
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("Broadcast")}
        >
          <FaBullhorn />

          <span>
            Broadcast
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAction("View Map")}
        >
          <FaMapMarkedAlt />

          <span>
            View Map
          </span>
        </button>

      </div>

    </section>
  );
}

export default BottomControls;