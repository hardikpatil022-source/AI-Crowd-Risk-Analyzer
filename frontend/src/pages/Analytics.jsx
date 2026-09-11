import { useEffect, useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

import {
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaDatabase,
} from "react-icons/fa";

import "../styles/dashboard.css";

const BACKEND_URL = "http://127.0.0.1:8000";

const RISK_ORDER = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const RISK_COLORS = {
  LOW: "#22c55e",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedCameraId) {
          params.set("camera_id", selectedCameraId);
        }

        const [summaryRes, camerasRes] = await Promise.all([
          fetch(`${BACKEND_URL}/analytics/summary?${params.toString()}`),
          fetch(`${BACKEND_URL}/cameras`),
        ]);

        if (!summaryRes.ok) {
          throw new Error("Failed to load analytics");
        }

        const summaryData = await summaryRes.json();
        const camerasData = camerasRes.ok ? await camerasRes.json() : [];

        if (!cancelled) {
          setSummary(summaryData);
          setCameras(camerasData);
        }
      } catch (err) {
        console.error("Analytics error:", err);
        if (!cancelled) {
          setError(
            "Could not load analytics. Make sure the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [selectedCameraId]);

  const maxBreakdownCount =
    summary && summary.total_analyses > 0
      ? Math.max(...RISK_ORDER.map((r) => summary.risk_level_breakdown[r] || 0), 1)
      : 1;

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content">
          <section className="section-heading">
            <div>
              <span className="section-label">ANALYTICS</span>
              <h2>Crowd Intelligence Overview</h2>
            </div>

            <p>Aggregated stats across every saved YOLO analysis run.</p>
          </section>

          {cameras.length > 0 && (
            <div className="reports-filters" style={{ marginBottom: "24px" }}>
              <div className="filter-chips">
                <button
                  className={`chip ${selectedCameraId === "" ? "active" : ""}`}
                  onClick={() => setSelectedCameraId("")}
                >
                  All Cameras
                </button>

                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    className={`chip ${
                      selectedCameraId === String(camera.id) ? "active" : ""
                    }`}
                    onClick={() => setSelectedCameraId(String(camera.id))}
                  >
                    {camera.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && <p style={{ color: "#94a3b8" }}>Loading analytics...</p>}

          {error && <p style={{ color: "#ef4444" }}>{error}</p>}

          {!loading && !error && summary && summary.total_analyses === 0 && (
            <p style={{ color: "#94a3b8" }}>
              No analysis results yet. Run a video through Monitoring to see
              analytics appear here.
            </p>
          )}

          {!loading && !error && summary && summary.total_analyses > 0 && (
            <>
              <div className="dashboard-kpis">
                <div className="kpi-card">
                  <div className="kpi-icon blue">
                    <FaDatabase />
                  </div>
                  <div className="kpi-content">
                    <span>Total Analyses</span>
                    <h2>{summary.total_analyses}</h2>
                    <p>Saved YOLO runs</p>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon purple">
                    <FaUsers />
                  </div>
                  <div className="kpi-content">
                    <span>Peak People Count</span>
                    <h2>{summary.peak_people_count}</h2>
                    <p>Busiest single frame</p>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon green">
                    <FaChartLine />
                  </div>
                  <div className="kpi-content">
                    <span>Average Crowd Density</span>
                    <h2>{summary.average_crowd_density}%</h2>
                    <p>Across all analyses</p>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon red">
                    <FaExclamationTriangle />
                  </div>
                  <div className="kpi-content">
                    <span>Latest Risk Level</span>
                    <h2
                      style={{
                        color: RISK_COLORS[summary.latest_risk_level] || "inherit",
                      }}
                    >
                      {summary.latest_risk_level || "N/A"}
                    </h2>
                    <p>Most recent analysis</p>
                  </div>
                </div>
              </div>

              <div className="analytics-heading" style={{ marginTop: "32px" }}>
                <div>
                  <span className="section-label">BREAKDOWN</span>
                  <h3>Risk Level Distribution</h3>
                </div>
              </div>

              <div
                className="analytics-card"
                style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {RISK_ORDER.map((risk) => {
                  const count = summary.risk_level_breakdown[risk] || 0;
                  const widthPercent = (count / maxBreakdownCount) * 100;

                  return (
                    <div key={risk} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "90px", fontWeight: 600, color: RISK_COLORS[risk] }}>
                        {risk}
                      </span>

                      <div
                        style={{
                          flex: 1,
                          background: "rgba(148, 163, 184, 0.15)",
                          borderRadius: "8px",
                          height: "18px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${widthPercent}%`,
                            background: RISK_COLORS[risk],
                            height: "100%",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>

                      <span style={{ width: "40px", textAlign: "right" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Analytics;