import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import "../styles/settings.css";

const DEFAULT_SETTINGS = {
  confidence: 50,
  boundingBoxes: true,
  personDetection: true,

  lowRisk: 30,
  mediumRisk: 60,
  highRisk: 80,

  automaticReports: true,
  reportFrequency: "1 minute",
  csvReports: true,
  pptxReports: true,

  criticalAlerts: true,
  highAlerts: true,
  alertSound: true,

  compactSidebar: false,
  animations: true,
};

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const [systemStatus, setSystemStatus] = useState({
    backend: "Checking...",
    yolo: "Checking...",
    database: "Checking...",
  });

  // Load saved settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crowdRiskSettings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  // Check backend / system status
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/cameras");

        if (response.ok) {
          setSystemStatus({
            backend: "Connected",
            yolo: "Ready",
            database: "Connected",
          });
        } else {
          setSystemStatus({
            backend: "Unavailable",
            yolo: "Unknown",
            database: "Unknown",
          });
        }
      } catch (error) {
        setSystemStatus({
          backend: "Disconnected",
          yolo: "Unavailable",
          database: "Unavailable",
        });
      }
    };

    checkSystemStatus();
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "crowdRiskSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const resetSettings = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings to their default values?"
    );

    if (!confirmReset) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      "crowdRiskSettings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const getStatusClass = (status) => {
    if (
      status === "Connected" ||
      status === "Ready"
    ) {
      return "status-connected";
    }

    if (
      status === "Checking..."
    ) {
      return "status-checking";
    }

    return "status-error";
  };

  return (
    <div className="dashboard settings-page">
      <Header />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content settings-content">

          {/* PAGE HEADER */}
          <section className="settings-header-card">
            <div>
              <h1>Settings</h1>
              <p>
                Configure your AI Crowd Risk Analyzer
              </p>
            </div>

            <div className="settings-header-actions">
              {saved && (
                <span className="save-success">
                  ✓ Settings Saved
                </span>
              )}

              <button
                className="reset-button"
                onClick={resetSettings}
              >
                ↻ Reset
              </button>

              <button
                className="save-button"
                onClick={saveSettings}
              >
                ✓ Save Changes
              </button>
            </div>
          </section>

          {/* SETTINGS GRID */}
          <div className="settings-grid">

            {/* AI DETECTION */}
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon">
                  🧠
                </div>

                <div>
                  <h2>AI Detection</h2>
                  <p>
                    Configure YOLO detection parameters
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <h3>YOLO Model</h3>
                  <p>
                    Object detection model used by the system
                  </p>
                </div>

                <span className="value-badge">
                  YOLOv8
                </span>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Confidence Threshold</h3>
                  <p>
                    Minimum confidence required for detection
                  </p>
                </div>

                <div className="range-control">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.confidence}
                    onChange={(e) =>
                      updateSetting(
                        "confidence",
                        Number(e.target.value)
                      )
                    }
                  />

                  <span>
                    {settings.confidence}%
                  </span>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Person Detection</h3>
                  <p>
                    Detect people in uploaded CCTV footage
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.personDetection}
                    onChange={(e) =>
                      updateSetting(
                        "personDetection",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Bounding Boxes</h3>
                  <p>
                    Display YOLO detection boxes
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.boundingBoxes}
                    onChange={(e) =>
                      updateSetting(
                        "boundingBoxes",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>
            </section>


            {/* RISK SETTINGS */}
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon risk-icon">
                  🚨
                </div>

                <div>
                  <h2>Risk Thresholds</h2>
                  <p>
                    Configure crowd density risk levels
                  </p>
                </div>
              </div>

              <div className="risk-thresholds">

                <div className="risk-row">
                  <div className="risk-label">
                    <span className="risk-dot low"></span>
                    Low Risk
                  </div>

                  <span>
                    &lt; {settings.lowRisk}%
                  </span>
                </div>

                <div className="risk-row">
                  <div className="risk-label">
                    <span className="risk-dot medium"></span>
                    Medium Risk
                  </div>

                  <span>
                    {settings.lowRisk}% – {settings.mediumRisk}%
                  </span>
                </div>

                <div className="risk-row">
                  <div className="risk-label">
                    <span className="risk-dot high"></span>
                    High Risk
                  </div>

                  <span>
                    {settings.mediumRisk}% – {settings.highRisk}%
                  </span>
                </div>

                <div className="risk-row">
                  <div className="risk-label">
                    <span className="risk-dot critical"></span>
                    Critical Risk
                  </div>

                  <span>
                    &gt; {settings.highRisk}%
                  </span>
                </div>

              </div>

              <div className="threshold-control">

                <label>
                  Low Risk Limit
                </label>

                <div className="number-control">
                  <input
                    type="number"
                    min="1"
                    max="98"
                    value={settings.lowRisk}
                    onChange={(e) =>
                      updateSetting(
                        "lowRisk",
                        Number(e.target.value)
                      )
                    }
                  />

                  <span>%</span>
                </div>

              </div>

              <div className="threshold-control">

                <label>
                  Medium Risk Limit
                </label>

                <div className="number-control">
                  <input
                    type="number"
                    min={settings.lowRisk + 1}
                    max="99"
                    value={settings.mediumRisk}
                    onChange={(e) =>
                      updateSetting(
                        "mediumRisk",
                        Number(e.target.value)
                      )
                    }
                  />

                  <span>%</span>
                </div>

              </div>

              <div className="threshold-control">

                <label>
                  High Risk Limit
                </label>

                <div className="number-control">
                  <input
                    type="number"
                    min={settings.mediumRisk + 1}
                    max="100"
                    value={settings.highRisk}
                    onChange={(e) =>
                      updateSetting(
                        "highRisk",
                        Number(e.target.value)
                      )
                    }
                  />

                  <span>%</span>
                </div>

              </div>
            </section>


            {/* AUTOMATIC REPORTS */}
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon report-icon">
                  📊
                </div>

                <div>
                  <h2>Automatic Reports</h2>
                  <p>
                    Configure automatic crowd reports
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Automatic Reports</h3>
                  <p>
                    Generate reports automatically
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.automaticReports}
                    onChange={(e) =>
                      updateSetting(
                        "automaticReports",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Report Frequency</h3>
                  <p>
                    How often a new report is generated
                  </p>
                </div>

                <select
                  className="settings-select"
                  value={settings.reportFrequency}
                  onChange={(e) =>
                    updateSetting(
                      "reportFrequency",
                      e.target.value
                    )
                  }
                >
                  <option>1 minute</option>
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                </select>
              </div>

              <div className="setting-row">
                <div>
                  <h3>CSV Reports</h3>
                  <p>
                    Generate spreadsheet reports
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.csvReports}
                    onChange={(e) =>
                      updateSetting(
                        "csvReports",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>PowerPoint Reports</h3>
                  <p>
                    Generate presentation reports
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.pptxReports}
                    onChange={(e) =>
                      updateSetting(
                        "pptxReports",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>
            </section>


            {/* NOTIFICATIONS */}
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon notification-icon">
                  🔔
                </div>

                <div>
                  <h2>Notifications</h2>
                  <p>
                    Configure crowd risk alerts
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Critical Risk Alerts</h3>
                  <p>
                    Alert when critical crowd density is detected
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.criticalAlerts}
                    onChange={(e) =>
                      updateSetting(
                        "criticalAlerts",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>High Risk Alerts</h3>
                  <p>
                    Alert when high crowd density is detected
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.highAlerts}
                    onChange={(e) =>
                      updateSetting(
                        "highAlerts",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Alert Sound</h3>
                  <p>
                    Play sound when an alert occurs
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.alertSound}
                    onChange={(e) =>
                      updateSetting(
                        "alertSound",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>
            </section>


            {/* APPEARANCE */}
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon appearance-icon">
                  🎨
                </div>

                <div>
                  <h2>Appearance</h2>
                  <p>
                    Customize the dashboard interface
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Compact Sidebar</h3>
                  <p>
                    Use a smaller navigation sidebar
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.compactSidebar}
                    onChange={(e) =>
                      updateSetting(
                        "compactSidebar",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Animations</h3>
                  <p>
                    Enable interface animations
                  </p>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) =>
                      updateSetting(
                        "animations",
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Theme</h3>
                  <p>
                    Current dashboard theme
                  </p>
                </div>

                <span className="value-badge">
                  Light
                </span>
              </div>
            </section>


            {/* SYSTEM STATUS */}
            <section className="settings-card system-card">
              <div className="settings-card-title">
                <div className="settings-icon system-icon">
                  🖥️
                </div>

                <div>
                  <h2>System Status</h2>
                  <p>
                    Current AI Crowd Risk Analyzer status
                  </p>
                </div>
              </div>

              <div className="system-status-list">

                <div className="system-status-row">
                  <div>
                    <h3>Backend API</h3>
                    <p>
                      FastAPI server
                    </p>
                  </div>

                  <span
                    className={`system-status ${getStatusClass(
                      systemStatus.backend
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {systemStatus.backend}
                  </span>
                </div>

                <div className="system-status-row">
                  <div>
                    <h3>YOLO Detection</h3>
                    <p>
                      Object detection engine
                    </p>
                  </div>

                  <span
                    className={`system-status ${getStatusClass(
                      systemStatus.yolo
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {systemStatus.yolo}
                  </span>
                </div>

                <div className="system-status-row">
                  <div>
                    <h3>Database</h3>
                    <p>
                      Crowd analysis database
                    </p>
                  </div>

                  <span
                    className={`system-status ${getStatusClass(
                      systemStatus.database
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {systemStatus.database}
                  </span>
                </div>

                <div className="system-status-row">
                  <div>
                    <h3>Camera Slots</h3>
                    <p>
                      Available CCTV slots
                    </p>
                  </div>

                  <span className="system-status status-connected">
                    <span className="status-dot"></span>
                    6 Available
                  </span>
                </div>

              </div>

              <div className="api-info">
                <span>API Endpoint</span>
                <code>
                  http://127.0.0.1:8000
                </code>
              </div>
            </section>

          </div>

          {/* BOTTOM SAVE BAR */}
          <div className="settings-bottom-bar">
            <div>
              <strong>Configuration</strong>
              <span>
                Changes are stored locally on this browser.
              </span>
            </div>

            <button
              className="save-button"
              onClick={saveSettings}
            >
              ✓ Save Changes
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Settings;