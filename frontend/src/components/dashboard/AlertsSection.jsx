import { useState } from "react";
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "../../styles/alerts-section.css";

function AlertsSection() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "High Crowd Density Detected",
      message: "Zone 2 has exceeded safe capacity limits",
      timestamp: "2 minutes ago",
      zone: "Zone 2",
    },
    {
      id: 2,
      type: "warning",
      title: "Unusual Movement Pattern",
      message: "Detected unusual crowd movement in Zone 4",
      timestamp: "15 minutes ago",
      zone: "Zone 4",
    },
    {
      id: 3,
      type: "info",
      title: "System Update Available",
      message: "AI model has been updated to v2.1",
      timestamp: "1 hour ago",
      zone: "System",
    },
    {
      id: 4,
      type: "warning",
      title: "Camera Feed Interruption",
      message: "Camera 3 feed temporarily unavailable",
      timestamp: "3 hours ago",
      zone: "Camera 3",
    },
  ]);

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return <FaExclamationTriangle />;
      case "warning":
        return <FaBell />;
      case "info":
        return <FaInfoCircle />;
      case "success":
        return <FaCheckCircle />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div className="alerts-section">
      <div className="alerts-header">
        <h2>Recent Alerts</h2>
        <span className="alert-count">{alerts.length} active</span>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <FaCheckCircle />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-item alert-${alert.type}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
                <div className="alert-meta">
                  <span className="alert-zone">{alert.zone}</span>
                  <span className="alert-time">{alert.timestamp}</span>
                </div>
              </div>
              <button
                className="alert-close"
                onClick={() => dismissAlert(alert.id)}
              >
                <FaTimes />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertsSection;