import { useEffect, useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

import {
  FaCalendar,
  FaVideo,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

import "../styles/reports.css";

const BACKEND_URL = "http://127.0.0.1:8000";

const RISK_COLORS = {
  LOW: "#22c55e",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState("All");

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedRisk !== "All") {
          params.set("risk_level", selectedRisk);
        }

        const response = await fetch(
          `${BACKEND_URL}/analysis-history?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to load analysis history");
        }

        const data = await response.json();

        if (!cancelled) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Analysis history error:", err);
        if (!cancelled) {
          setError(
            "Could not load analysis history. Make sure the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedRisk]);

  const riskFilters = ["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content">
          <div className="reports-header">
            <div>
              <h1>Analysis History</h1>
              <p className="reports-subtitle">
                Every YOLO crowd analysis run, saved and searchable.
              </p>
            </div>
          </div>

          <div className="reports-filters">
            <div className="filter-chips">
              {riskFilters.map((risk) => (
                <button
                  key={risk}
                  className={`chip ${selectedRisk === risk ? "active" : ""}`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  {risk === "All" ? "All Risk Levels" : risk}
                </button>
              ))}
            </div>
          </div>

          {loading && <p style={{ color: "#94a3b8" }}>Loading history...</p>}

          {error && (
            <p style={{ color: "#ef4444" }}>{error}</p>
          )}

          {!loading && !error && history.length === 0 && (
            <p style={{ color: "#94a3b8" }}>
              No analysis results yet. Run a video through Monitoring to see
              results appear here.
            </p>
          )}

          <div className="reports-list">
            {history.map((item) => (
              <div key={item.id} className="report-card">
                <div className="report-info">
                  <h3>{item.filename}</h3>

                  <div className="report-meta">
                    <span className="report-date">
                      <FaCalendar /> {formatDate(item.created_at)}
                    </span>

                    <span className="report-type">
                      <FaUsers /> {item.people_count} people
                    </span>

                    <span className="report-type">
                      <FaChartLine /> {item.crowd_density}% density
                    </span>

                    {item.camera_id && (
                      <span className="report-type">
                        <FaVideo /> Camera #{item.camera_id}
                      </span>
                    )}
                  </div>
                </div>

                <div className="report-actions">
                  <span
                    className="report-status"
                    style={{ color: RISK_COLORS[item.risk_level] || "#94a3b8" }}
                  >
                    {item.risk_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalysisHistory;