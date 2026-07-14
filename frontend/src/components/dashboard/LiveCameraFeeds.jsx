import { useState } from "react";
import "../../styles/live-camera-feeds.css";
import { FaThLarge, FaList, FaExpandAlt } from "react-icons/fa";

function LiveCameraFeeds() {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [cameras] = useState([
    {
      id: 1,
      name: "Camera 1 - Main Entrance",
      location: "North Gate",
      status: "Active",
      peopleCount: 245,
      riskLevel: "Low",
    },
    {
      id: 2,
      name: "Camera 2 - Central Plaza",
      location: "Center",
      status: "Active",
      peopleCount: 512,
      riskLevel: "Moderate",
    },
    {
      id: 3,
      name: "Camera 3 - Exit Zone",
      location: "South Gate",
      status: "Active",
      peopleCount: 189,
      riskLevel: "Low",
    },
    {
      id: 4,
      name: "Camera 4 - Emergency Area",
      location: "Medical Zone",
      status: "Active",
      peopleCount: 301,
      riskLevel: "High",
    },
  ]);

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return "#22c55e";
      case "Moderate":
        return "#eab308";
      case "High":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div className="live-camera-feeds">
      <div className="feeds-header">
        <h2>Live Camera Feeds</h2>
        <div className="feeds-controls">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <FaThLarge />
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <FaList />
          </button>
          <select className="filter-select">
            <option>All Cameras</option>
            <option>Active Only</option>
            <option>High Risk</option>
          </select>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="cameras-grid">
          {cameras.map((camera) => (
            <div key={camera.id} className="camera-card">
              <div className="camera-feed">
                <div className="feed-placeholder">
                  <span>🎥</span>
                </div>
                <div className="feed-overlay">
                  <span className="online-badge">● LIVE</span>
                  <button className="fullscreen-btn">
                    <FaExpandAlt />
                  </button>
                </div>
              </div>

              <div className="camera-info">
                <h3>{camera.name}</h3>
                <p className="camera-location">{camera.location}</p>

                <div className="camera-stats">
                  <div className="stat-item">
                    <span className="stat-label">People:</span>
                    <span className="stat-value">{camera.peopleCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Risk:</span>
                    <span
                      className="stat-value"
                      style={{ color: getRiskColor(camera.riskLevel) }}
                    >
                      {camera.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cameras-list">
          <table>
            <thead>
              <tr>
                <th>Camera Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>People Count</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((camera) => (
                <tr key={camera.id}>
                  <td>{camera.name}</td>
                  <td>{camera.location}</td>
                  <td>
                    <span className="status-active">● {camera.status}</span>
                  </td>
                  <td>{camera.peopleCount}</td>
                  <td>
                    <span
                      className="risk-badge"
                      style={{ color: getRiskColor(camera.riskLevel) }}
                    >
                      {camera.riskLevel}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LiveCameraFeeds;