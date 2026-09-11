import {
  FaCircle,
  FaChevronRight,
} from "react-icons/fa";

import "./RecentAlertsTable.css";

const alerts = [
  {
    time: "11:24 PM",
    text: "High Density Detected",
    camera: "CAM-01",
    color: "#EF4444",
  },
  {
    time: "11:18 PM",
    text: "Unusual Movement",
    camera: "CAM-03",
    color: "#F97316",
  },
  {
    time: "11:10 PM",
    text: "Crowd Gathering",
    camera: "CAM-02",
    color: "#FACC15",
  },
];

function RecentAlertsTable() {
  return (
    <div className="recent-alerts-card">

      <h2>RECENT ALERTS</h2>

      <div className="alerts-body">

        {alerts.map((item, index) => (

          <div
            className="alert-item"
            key={index}
          >

            <FaCircle
              className="alert-dot"
              style={{
                color: item.color,
              }}
            />

            <span className="alert-time">
              {item.time}
            </span>

            <span className="alert-text">
              {item.text}
            </span>

            <span className="alert-camera">
              {item.camera}
            </span>

          </div>

        ))}

      </div>

      <button
        className="view-all-btn"
        type="button"
      >

        <span>
          View All Alerts
        </span>

        <FaChevronRight />

      </button>

    </div>
  );
}

export default RecentAlertsTable;