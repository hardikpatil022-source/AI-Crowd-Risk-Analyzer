import { useState } from "react";

import CameraFeed from "../components/camera/CameraFeed";
import CameraNetwork from "../components/camera/CameraNetwork";
import RiskAnalysis from "../components/ai/RiskAnalysis";

import cameras from "../data/cameras";

import {
  FaBell,
  FaVolumeUp,
  FaBullhorn,
  FaMapMarkedAlt,
} from "react-icons/fa";

import "../styles/live-monitoring.css";

function LiveMonitoring() {
  const [activeCamera, setActiveCamera] = useState(cameras[0]);

  const handleCameraSelect = (camera) => {
    setActiveCamera(camera);
  };

  return (
    <main className="live-monitoring-page">

      {/* ================================
          MAIN MONITORING AREA
      ================================= */}

      <section className="monitoring-grid">

        {/* ================================
            CAMERA
        ================================= */}

        <div className="monitoring-camera">

          <CameraFeed
            cameraNo={activeCamera.id}
            cameraName={activeCamera.name}
            location={activeCamera.location}
            video={activeCamera.video}
          />

        </div>


        {/* ================================
            RIGHT SIDE PANEL
        ================================= */}

        <aside className="monitoring-side-panel">

          {/* AI RISK ANALYSIS */}

          <div className="risk-panel-card">
            <RiskAnalysis />
          </div>


          {/* QUICK ACTIONS */}

          <div className="quick-actions">

            <h3>QUICK ACTIONS</h3>

            <div className="quick-actions-grid">

              <button
                type="button"
                className="quick-action alert"
                onClick={() =>
                  alert("Alert sent to security personnel")
                }
              >
                <FaBell />
                <span>Send Alert</span>
              </button>


              <button
                type="button"
                className="quick-action siren"
                onClick={() =>
                  alert("Siren activated")
                }
              >
                <FaVolumeUp />
                <span>Siren</span>
              </button>


              <button
                type="button"
                className="quick-action broadcast"
                onClick={() =>
                  alert("Emergency broadcast activated")
                }
              >
                <FaBullhorn />
                <span>Broadcast</span>
              </button>


              <button
                type="button"
                className="quick-action map"
                onClick={() =>
                  alert("Opening crowd map")
                }
              >
                <FaMapMarkedAlt />
                <span>View Map</span>
              </button>

            </div>

          </div>

        </aside>

      </section>


      {/* ================================
          CAMERA NETWORK
      ================================= */}

      <CameraNetwork
        activeCamera={activeCamera}
        onCameraSelect={handleCameraSelect}
      />


      {/* ================================
          ACTIVE CAMERA INFO
      ================================= */}

      <section className="active-camera-info">

        <div>

          <span className="active-camera-label">
            CURRENTLY MONITORING
          </span>

          <h2>{activeCamera.id}</h2>

          <p>
            {activeCamera.name} • {activeCamera.location}
          </p>

        </div>


        <div className="monitoring-status">

          <span className="status-dot"></span>

          LIVE MONITORING

        </div>

      </section>

    </main>
  );
}

export default LiveMonitoring;