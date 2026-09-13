import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import "../styles/settings.css";

const DEFAULT_SETTINGS = {
  theme: "light",

  confidence: 50,
  personDetection: true,
  boundingBoxes: true,

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
  const [savedMessage, setSavedMessage] = useState("");

  const [systemStatus, setSystemStatus] = useState({
    backend: "Checking...",
    yolo: "Checking...",
    database: "Checking...",
  });

  /* ===============================
     LOAD SETTINGS
  =============================== */

  useEffect(() => {
    const saved = localStorage.getItem("crowdRiskSettings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  /* ===============================
     APPLY THEME
  =============================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      settings.theme
    );

    localStorage.setItem(
      "crowdRiskTheme",
      settings.theme
    );
  }, [settings.theme]);

  /* ===============================
     APPLY SIDEBAR
  =============================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar",
      settings.compactSidebar
        ? "compact"
        : "normal"
    );
  }, [settings.compactSidebar]);

  /* ===============================
     APPLY ANIMATIONS
  =============================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-animations",
      settings.animations
        ? "on"
        : "off"
    );
  }, [settings.animations]);

  /* ===============================
     UPDATE SETTING
  =============================== */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSavedMessage("");
  };

  /* ===============================
     SAVE
  =============================== */

  const saveSettings = () => {
    localStorage.setItem(
      "crowdRiskSettings",
      JSON.stringify(settings)
    );

    setSavedMessage("✓ Settings saved successfully");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  /* ===============================
     RESET
  =============================== */

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Reset all settings to default?"
    );

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      "crowdRiskSettings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    document.documentElement.setAttribute(
      "data-theme",
      "light"
    );

    document.documentElement.setAttribute(
      "data-sidebar",
      "normal"
    );

    document.documentElement.setAttribute(
      "data-animations",
      "on"
    );

    setSavedMessage(
      "✓ Settings reset successfully"
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  /* ===============================
     SYSTEM STATUS
  =============================== */

  const checkSystemStatus = async () => {
    setSystemStatus({
      backend: "Checking...",
      yolo: "Checking...",
      database: "Checking...",
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/cameras"
      );

      if (response.ok) {
        setSystemStatus({
          backend: "Connected",
          yolo: "Ready",
          database: "Connected",
        });
      } else {
        setSystemStatus({
          backend: "Unavailable",
          yolo: "Unavailable",
          database: "Unavailable",
        });
      }
    } catch {
      setSystemStatus({
        backend: "Disconnected",
        yolo: "Unavailable",
        database: "Unavailable",
      });
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  /* ===============================
     STATUS CLASS
  =============================== */

  const statusClass = (status) => {
    if (
      status === "Connected" ||
      status === "Ready"
    ) {
      return "status-good";
    }

    if (status === "Checking...") {
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

          {/* ================= HEADER ================= */}

          <div className="settings-header">

            <div>
              <h1>Settings</h1>

              <p>
                Configure your AI Crowd Risk Analyzer
              </p>
            </div>

            <div className="settings-actions">

              {savedMessage && (
                <span className="saved-message">
                  {savedMessage}
                </span>
              )}

              <button
                className="reset-btn"
                onClick={resetSettings}
              >
                ↻ Reset
              </button>

              <button
                className="save-btn"
                onClick={saveSettings}
              >
                ✓ Save Changes
              </button>

            </div>

          </div>


          {/* ================= GRID ================= */}

          <div className="settings-grid">

            {/* ================= AI ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon">
                  🧠
                </div>

                <div>
                  <h2>AI Detection</h2>

                  <p>
                    Configure YOLO detection
                  </p>
                </div>

              </div>


              <div className="setting-item">

                <div>
                  <strong>YOLO Model</strong>

                  <small>
                    Object detection model
                  </small>
                </div>

                <span className="badge">
                  YOLOv8
                </span>

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Confidence Threshold
                  </strong>

                  <small>
                    Minimum detection confidence
                  </small>
                </div>

                <div className="range-box">

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


              <div className="setting-item">

                <div>
                  <strong>
                    Person Detection
                  </strong>

                  <small>
                    Detect people in CCTV footage
                  </small>
                </div>

                <Toggle
                  checked={settings.personDetection}
                  onChange={(value) =>
                    updateSetting(
                      "personDetection",
                      value
                    )
                  }
                />

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Bounding Boxes
                  </strong>

                  <small>
                    Show YOLO detection boxes
                  </small>
                </div>

                <Toggle
                  checked={settings.boundingBoxes}
                  onChange={(value) =>
                    updateSetting(
                      "boundingBoxes",
                      value
                    )
                  }
                />

              </div>

            </section>


            {/* ================= RISK ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon danger">
                  🚨
                </div>

                <div>
                  <h2>Risk Thresholds</h2>

                  <p>
                    Configure crowd risk levels
                  </p>
                </div>

              </div>


              <RiskInput
                title="Low Risk"
                value={settings.lowRisk}
                onChange={(value) =>
                  updateSetting("lowRisk", value)
                }
              />

              <RiskInput
                title="Medium Risk"
                value={settings.mediumRisk}
                onChange={(value) =>
                  updateSetting(
                    "mediumRisk",
                    value
                  )
                }
              />

              <RiskInput
                title="High Risk"
                value={settings.highRisk}
                onChange={(value) =>
                  updateSetting(
                    "highRisk",
                    value
                  )
                }
              />


              <div className="risk-preview">

                <div>
                  <span className="green-dot"></span>
                  LOW
                  <strong>
                    &lt; {settings.lowRisk}%
                  </strong>
                </div>

                <div>
                  <span className="yellow-dot"></span>
                  MEDIUM
                  <strong>
                    {settings.lowRisk}–{settings.mediumRisk}%
                  </strong>
                </div>

                <div>
                  <span className="orange-dot"></span>
                  HIGH
                  <strong>
                    {settings.mediumRisk}–{settings.highRisk}%
                  </strong>
                </div>

                <div>
                  <span className="red-dot"></span>
                  CRITICAL
                  <strong>
                    &gt; {settings.highRisk}%
                  </strong>
                </div>

              </div>

            </section>


            {/* ================= REPORTS ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon blue">
                  📊
                </div>

                <div>
                  <h2>Automatic Reports</h2>

                  <p>
                    Configure automatic reports
                  </p>
                </div>

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Automatic Reports
                  </strong>

                  <small>
                    Generate reports automatically
                  </small>
                </div>

                <Toggle
                  checked={settings.automaticReports}
                  onChange={(value) =>
                    updateSetting(
                      "automaticReports",
                      value
                    )
                  }
                />

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Report Frequency
                  </strong>

                  <small>
                    Automatic generation interval
                  </small>
                </div>

                <select
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


              <div className="setting-item">

                <div>
                  <strong>
                    CSV Reports
                  </strong>

                  <small>
                    Generate CSV reports
                  </small>
                </div>

                <Toggle
                  checked={settings.csvReports}
                  onChange={(value) =>
                    updateSetting(
                      "csvReports",
                      value
                    )
                  }
                />

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    PowerPoint Reports
                  </strong>

                  <small>
                    Generate PPTX reports
                  </small>
                </div>

                <Toggle
                  checked={settings.pptxReports}
                  onChange={(value) =>
                    updateSetting(
                      "pptxReports",
                      value
                    )
                  }
                />

              </div>

            </section>


            {/* ================= ALERTS ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon yellow">
                  🔔
                </div>

                <div>
                  <h2>Notifications</h2>

                  <p>
                    Configure crowd alerts
                  </p>
                </div>

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Critical Risk Alerts
                  </strong>

                  <small>
                    Alert for critical crowd density
                  </small>
                </div>

                <Toggle
                  checked={settings.criticalAlerts}
                  onChange={(value) =>
                    updateSetting(
                      "criticalAlerts",
                      value
                    )
                  }
                />

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    High Risk Alerts
                  </strong>

                  <small>
                    Alert for high crowd density
                  </small>
                </div>

                <Toggle
                  checked={settings.highAlerts}
                  onChange={(value) =>
                    updateSetting(
                      "highAlerts",
                      value
                    )
                  }
                />

              </div>


              <div className="setting-item">

                <div>
                  <strong>
                    Alert Sound
                  </strong>

                  <small>
                    Play sound for alerts
                  </small>
                </div>

                <Toggle
                  checked={settings.alertSound}
                  onChange={(value) =>
                    updateSetting(
                      "alertSound",
                      value
                    )
                  }
                />

              </div>

            </section>


            {/* ================= APPEARANCE ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon purple">
                  🎨
                </div>

                <div>
                  <h2>Appearance</h2>

                  <p>
                    Customize the interface
                  </p>
                </div>

              </div>


              {/* THEME */}

              <div className="setting-item">

                <div>
                  <strong>
                    Theme
                  </strong>

                  <small>
                    Choose Light or Dark mode
                  </small>
                </div>

                <select
                  value={settings.theme}
                  onChange={(e) =>
                    updateSetting(
                      "theme",
                      e.target.value
                    )
                  }
                >
                  <option value="light">
                    ☀️ Light
                  </option>

                  <option value="dark">
                    🌙 Dark
                  </option>
                </select>

              </div>


              {/* SIDEBAR */}

              <div className="setting-item">

                <div>
                  <strong>
                    Compact Sidebar
                  </strong>

                  <small>
                    Reduce sidebar width
                  </small>
                </div>

                <Toggle
                  checked={settings.compactSidebar}
                  onChange={(value) =>
                    updateSetting(
                      "compactSidebar",
                      value
                    )
                  }
                />

              </div>


              {/* ANIMATIONS */}

              <div className="setting-item">

                <div>
                  <strong>
                    Animations
                  </strong>

                  <small>
                    Enable interface animations
                  </small>
                </div>

                <Toggle
                  checked={settings.animations}
                  onChange={(value) =>
                    updateSetting(
                      "animations",
                      value
                    )
                  }
                />

              </div>

            </section>


            {/* ================= SYSTEM ================= */}

            <section className="settings-card">

              <div className="card-heading">

                <div className="card-icon green">
                  🖥️
                </div>

                <div>
                  <h2>System Status</h2>

                  <p>
                    Current system status
                  </p>
                </div>

              </div>


              <StatusRow
                name="Backend API"
                value={systemStatus.backend}
                statusClass={statusClass(
                  systemStatus.backend
                )}
              />

              <StatusRow
                name="YOLO Detection"
                value={systemStatus.yolo}
                statusClass={statusClass(
                  systemStatus.yolo
                )}
              />

              <StatusRow
                name="Database"
                value={systemStatus.database}
                statusClass={statusClass(
                  systemStatus.database
                )}
              />

              <StatusRow
                name="Camera Slots"
                value="6 Available"
                statusClass="status-good"
              />


              <button
                className="test-system-btn"
                onClick={checkSystemStatus}
              >
                ↻ Check System Again
              </button>

            </section>

          </div>


          {/* ================= SAVE BAR ================= */}

          <div className="bottom-save">

            <div>
              <strong>
                Settings
              </strong>

              <span>
                Save your configuration before leaving this page.
              </span>
            </div>

            <button
              className="save-btn"
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


/* =========================================
   TOGGLE COMPONENT
========================================= */

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      <span></span>

    </label>
  );
}


/* =========================================
   RISK INPUT
========================================= */

function RiskInput({
  title,
  value,
  onChange,
}) {
  return (
    <div className="risk-input">

      <label>
        {title}
      </label>

      <div>
        <input
          type="number"
          min="1"
          max="100"
          value={value}
          onChange={(e) =>
            onChange(
              Number(e.target.value)
            )
          }
        />

        <span>%</span>
      </div>

    </div>
  );
}


/* =========================================
   STATUS ROW
========================================= */

function StatusRow({
  name,
  value,
  statusClass,
}) {
  return (
    <div className="status-row">

      <div>
        <strong>
          {name}
        </strong>

        <small>
          System component
        </small>
      </div>

      <span className={`status ${statusClass}`}>
        <i></i>
        {value}
      </span>

    </div>
  );
}

export default Settings;