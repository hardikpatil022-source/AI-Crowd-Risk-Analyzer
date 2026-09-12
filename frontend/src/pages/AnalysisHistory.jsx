import React, { useEffect, useMemo, useState } from "react";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";

import "../styles/dashboard.css";

const BACKEND_URL = "http://127.0.0.1:8000";

function AnalysisHistory() {
  // ============================================================
  // STATE
  // ============================================================

  const [analyses, setAnalyses] = useState([]);
  const [cameras, setCameras] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [deletingSelected, setDeletingSelected] = useState(false);


  // ============================================================
  // FETCH HISTORY + CAMERAS
  // ============================================================

  const fetchHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [historyResponse, camerasResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/analysis-history?limit=200`),
        fetch(`${BACKEND_URL}/cameras`),
      ]);

      if (!historyResponse.ok) {
        throw new Error("Failed to load analysis history");
      }

      const historyData = await historyResponse.json();

      let cameraData = [];

      if (camerasResponse.ok) {
        const parsedCameras = await camerasResponse.json();

        if (Array.isArray(parsedCameras)) {
          cameraData = parsedCameras;
        }
      }

      setAnalyses(Array.isArray(historyData) ? historyData : []);
      setCameras(cameraData);

      setSelectedIds((previous) =>
        previous.filter((id) =>
          (Array.isArray(historyData) ? historyData : []).some(
            (item) => item.id === id
          )
        )
      );
    } catch (err) {
      console.error("Analysis history error:", err);

      setError(
        "Unable to load analysis history. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchHistory();
  }, []);


  // ============================================================
  // CAMERA NAME
  // ============================================================

  const getCameraName = (cameraId) => {
    if (cameraId === null || cameraId === undefined) {
      return "Not linked";
    }

    const camera = cameras.find(
      (item) => Number(item.id) === Number(cameraId)
    );

    if (camera) {
      return camera.name || `Camera ${camera.id}`;
    }

    // Do NOT convert database ID 9 -> CAM-09 etc.
    // Old records remain identifiable by their database ID.
    return `Camera ID ${cameraId}`;
  };


  // ============================================================
  // FILTER
  // ============================================================

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis) => {
      const text = search.toLowerCase().trim();

      const cameraName = getCameraName(analysis.camera_id);

      const matchesSearch =
        !text ||
        String(analysis.filename || "")
          .toLowerCase()
          .includes(text) ||
        String(analysis.camera_id || "")
          .toLowerCase()
          .includes(text) ||
        String(cameraName || "")
          .toLowerCase()
          .includes(text) ||
        String(analysis.id || "")
          .toLowerCase()
          .includes(text);

      const matchesRisk =
        riskFilter === "ALL" ||
        String(analysis.risk_level || "").toUpperCase() === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [analyses, search, riskFilter, cameras]);


  // ============================================================
  // SUMMARY
  // ============================================================

  const totalAnalyses = analyses.length;

  const averageDensity =
    analyses.length > 0
      ? (
          analyses.reduce(
            (sum, item) => sum + Number(item.crowd_density || 0),
            0
          ) / analyses.length
        ).toFixed(1)
      : "0.0";

  const peakPeople =
    analyses.length > 0
      ? Math.max(
          ...analyses.map((item) => Number(item.people_count || 0))
        )
      : 0;

  const highRiskCount = analyses.filter((item) =>
    ["HIGH", "CRITICAL"].includes(
      String(item.risk_level || "").toUpperCase()
    )
  ).length;


  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  // ============================================================
  // RISK CLASS
  // ============================================================

  const getRiskClass = (risk) => {
    const value = String(risk || "LOW").toUpperCase();

    if (value === "CRITICAL") {
      return "critical";
    }

    if (value === "HIGH") {
      return "high";
    }

    if (value === "MEDIUM") {
      return "medium";
    }

    return "low";
  };


  // ============================================================
  // SELECT
  // ============================================================

  const toggleSelection = (analysisId) => {
    setSelectedIds((previous) => {
      if (previous.includes(analysisId)) {
        return previous.filter((id) => id !== analysisId);
      }

      return [...previous, analysisId];
    });
  };


  // ============================================================
  // SELECT ALL
  // ============================================================

  const toggleSelectAll = () => {
    if (filteredAnalyses.length === 0) {
      return;
    }

    const allFilteredSelected = filteredAnalyses.every((analysis) =>
      selectedIds.includes(analysis.id)
    );

    if (allFilteredSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) =>
            !filteredAnalyses.some(
              (analysis) => analysis.id === id
            )
        )
      );
    } else {
      setSelectedIds((previous) => {
        const ids = new Set(previous);

        filteredAnalyses.forEach((analysis) => {
          ids.add(analysis.id);
        });

        return Array.from(ids);
      });
    }
  };


  // ============================================================
  // DELETE ONE
  // ============================================================

  const deleteAnalysis = async (analysisId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/analysis-history/${analysisId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete analysis");
      }

      setAnalyses((previous) =>
        previous.filter((analysis) => analysis.id !== analysisId)
      );

      setSelectedIds((previous) =>
        previous.filter((id) => id !== analysisId)
      );

      if (
        selectedAnalysis &&
        selectedAnalysis.id === analysisId
      ) {
        setSelectedAnalysis(null);
      }
    } catch (err) {
      console.error("Delete analysis error:", err);

      alert(
        "Unable to delete this analysis. Please try again."
      );
    }
  };


  // ============================================================
  // DELETE SELECTED
  // ============================================================

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected analysis record(s)?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSelected(true);

      const results = await Promise.all(
        selectedIds.map(async (id) => {
          const response = await fetch(
            `${BACKEND_URL}/analysis-history/${id}`,
            {
              method: "DELETE",
            }
          );

          return {
            id,
            success: response.ok,
          };
        })
      );

      const failedIds = results
        .filter((result) => !result.success)
        .map((result) => result.id);

      const deletedIds = results
        .filter((result) => result.success)
        .map((result) => result.id);

      setAnalyses((previous) =>
        previous.filter(
          (analysis) => !deletedIds.includes(analysis.id)
        )
      );

      setSelectedIds(failedIds);

      if (
        selectedAnalysis &&
        deletedIds.includes(selectedAnalysis.id)
      ) {
        setSelectedAnalysis(null);
      }

      if (failedIds.length > 0) {
        alert(
          `${deletedIds.length} deleted successfully.\n${failedIds.length} could not be deleted.`
        );
      }
    } catch (err) {
      console.error("Bulk delete error:", err);

      alert(
        "Unable to complete the bulk deletion. Please refresh the page."
      );

      fetchHistory(true);
    } finally {
      setDeletingSelected(false);
    }
  };


  // ============================================================
  // VIEW DETAILS
  // ============================================================

  const viewDetails = async (analysisId) => {
    try {
      setDetailsLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/analysis-history/${analysisId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load analysis details");
      }

      const data = await response.json();

      setSelectedAnalysis(data);
    } catch (err) {
      console.error("Details error:", err);

      alert("Unable to load analysis details.");
    } finally {
      setDetailsLoading(false);
    }
  };


  // ============================================================
  // SELECT STATE
  // ============================================================

  const allFilteredSelected =
    filteredAnalyses.length > 0 &&
    filteredAnalyses.every((analysis) =>
      selectedIds.includes(analysis.id)
    );

  const someFilteredSelected =
    filteredAnalyses.some((analysis) =>
      selectedIds.includes(analysis.id)
    ) && !allFilteredSelected;


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="dashboard history-page">

      <Header />

      <div className="dashboard-body">

        <Sidebar />

        <main className="dashboard-content history-content">

          {/* ======================================================
              PAGE HEADER
          ======================================================= */}

          <section className="history-header">

            <div className="history-header-text">

              <div className="history-eyebrow">
                AI CROWD MONITORING
              </div>

              <h1>Analysis History</h1>

              <p>
                Review previous crowd analyses, risk levels and
                YOLO detection results.
              </p>

            </div>

            <button
              className="history-refresh-btn"
              onClick={() => fetchHistory(true)}
              disabled={refreshing}
            >
              <span className={refreshing ? "refresh-spin" : ""}>
                ↻
              </span>

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </section>


          {/* ======================================================
              SUMMARY CARDS
          ======================================================= */}

          <section className="history-summary-grid">

            <div className="history-summary-card">

              <div className="summary-icon summary-icon-blue">
                ◉
              </div>

              <div>
                <span>Total Analyses</span>
                <strong>{totalAnalyses}</strong>
              </div>

            </div>


            <div className="history-summary-card">

              <div className="summary-icon summary-icon-teal">
                %
              </div>

              <div>
                <span>Average Density</span>
                <strong>{averageDensity}%</strong>
              </div>

            </div>


            <div className="history-summary-card">

              <div className="summary-icon summary-icon-orange">
                ↑
              </div>

              <div>
                <span>Peak People</span>
                <strong>{peakPeople}</strong>
              </div>

            </div>


            <div className="history-summary-card">

              <div className="summary-icon summary-icon-red">
                !
              </div>

              <div>
                <span>High Risk Analyses</span>
                <strong>{highRiskCount}</strong>
              </div>

            </div>

          </section>


          {/* ======================================================
              FILTER BAR
          ======================================================= */}

          <section className="history-filter-card">

            <div className="history-search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by filename, camera or analysis ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            <div className="history-filter-group">

              <label>Risk Level</label>

              <select
                value={riskFilter}
                onChange={(e) =>
                  setRiskFilter(e.target.value)
                }
              >
                <option value="ALL">All Risks</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>

            </div>


            <div className="history-result-count">
              Showing <strong>{filteredAnalyses.length}</strong> of{" "}
              {analyses.length}
            </div>


            {selectedIds.length > 0 && (

              <div className="selection-actions">

                <div className="selected-count">
                  <span className="selected-check">✓</span>
                  <strong>{selectedIds.length}</strong>
                  selected
                </div>

                <button
                  className="delete-selected-btn"
                  onClick={deleteSelected}
                  disabled={deletingSelected}
                >
                  🗑{" "}
                  {deletingSelected
                    ? "Deleting..."
                    : "Delete Selected"}
                </button>

              </div>

            )}

          </section>


          {/* ======================================================
              ERROR
          ======================================================= */}

          {error && (

            <div className="history-error">

              <div>
                <strong>⚠ Something went wrong</strong>
                <span>{error}</span>
              </div>

              <button onClick={() => fetchHistory()}>
                Try Again
              </button>

            </div>

          )}


          {/* ======================================================
              LOADING
          ======================================================= */}

          {loading && (

            <div className="history-loading">

              <div className="loading-spinner"></div>

              <h3>Loading analysis history...</h3>

              <p>
                Fetching saved YOLO analysis results
                from the database.
              </p>

            </div>

          )}


          {/* ======================================================
              EMPTY
          ======================================================= */}

          {!loading &&
            !error &&
            filteredAnalyses.length === 0 && (

              <div className="history-empty">

                <div className="empty-icon">
                  ◌
                </div>

                <h2>No analyses found</h2>

                <p>
                  {analyses.length === 0
                    ? "Run a video analysis from the Monitoring page and the result will appear here."
                    : "Try changing your search or risk filter."}
                </p>

                {(search || riskFilter !== "ALL") && (

                  <button
                    onClick={() => {
                      setSearch("");
                      setRiskFilter("ALL");
                    }}
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            )}


          {/* ======================================================
              TABLE
          ======================================================= */}

          {!loading &&
            !error &&
            filteredAnalyses.length > 0 && (

              <section className="history-table-card">

                <div className="history-table-header">

                  <div>
                    <div className="history-eyebrow">
                      YOLO RESULTS
                    </div>

                    <h2>Recent Analyses</h2>

                    <p>
                      Results generated by the YOLO crowd analyzer
                    </p>
                  </div>


                  {selectedIds.length > 0 && (

                    <div className="table-selection-info">

                      <span>
                        {selectedIds.length} selected
                      </span>

                      <button
                        onClick={() => setSelectedIds([])}
                      >
                        Clear Selection
                      </button>

                    </div>

                  )}

                </div>


                <div className="history-table-wrapper">

                  <table className="history-table">

                    <thead>

                      <tr>

                        <th className="select-column">

                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            ref={(element) => {
                              if (element) {
                                element.indeterminate =
                                  someFilteredSelected;
                              }
                            }}
                            onChange={toggleSelectAll}
                            aria-label="Select all analyses"
                          />

                        </th>

                        <th>ID</th>

                        <th>Video / File</th>

                        <th>Camera</th>

                        <th>People</th>

                        <th>Density</th>

                        <th>Risk Level</th>

                        <th>Date & Time</th>

                        <th>Actions</th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredAnalyses.map((analysis) => {

                        const isSelected =
                          selectedIds.includes(analysis.id);

                        const risk =
                          String(
                            analysis.risk_level || "LOW"
                          ).toUpperCase();

                        return (

                          <tr
                            key={analysis.id}
                            className={
                              isSelected
                                ? "analysis-row-selected"
                                : ""
                            }
                          >

                            {/* CHECKBOX */}

                            <td className="select-column">

                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleSelection(
                                    analysis.id
                                  )
                                }
                              />

                            </td>


                            {/* ID */}

                            <td>

                              <span className="analysis-id">
                                #{analysis.id}
                              </span>

                            </td>


                            {/* FILE */}

                            <td>

                              <div className="file-cell">

                                <div className="file-icon">
                                  ▶
                                </div>

                                <div className="file-details">

                                  <strong
                                    title={analysis.filename}
                                  >
                                    {analysis.filename ||
                                      "Unknown"}
                                  </strong>

                                  <small>
                                    YOLO Crowd Analysis
                                  </small>

                                </div>

                              </div>

                            </td>


                            {/* CAMERA */}

                            <td>

                              <span className="camera-badge">
                                {getCameraName(
                                  analysis.camera_id
                                )}
                              </span>

                            </td>


                            {/* PEOPLE */}

                            <td>

                              <strong className="people-value">
                                {analysis.people_count ?? 0}
                              </strong>

                            </td>


                            {/* DENSITY */}

                            <td>

                              <strong className="density-value">
                                {Number(
                                  analysis.crowd_density || 0
                                ).toFixed(1)}
                                %
                              </strong>

                            </td>


                            {/* RISK */}

                            <td>

                              <span
                                className={`risk-badge ${getRiskClass(
                                  risk
                                )}`}
                              >
                                <span className="risk-dot"></span>
                                {risk}
                              </span>

                            </td>


                            {/* DATE */}

                            <td>

                              <span className="date-cell">
                                {formatDate(
                                  analysis.scan_started_at ||
                                    analysis.created_at
                                )}
                              </span>

                            </td>


                            {/* ACTIONS */}

                            <td>

                              <div className="table-actions">

                                <button
                                  className="action-view"
                                  onClick={() =>
                                    viewDetails(
                                      analysis.id
                                    )
                                  }
                                >
                                  View
                                </button>

                                <button
                                  className="action-delete"
                                  onClick={() =>
                                    deleteAnalysis(
                                      analysis.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>

                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </section>

            )}

        </main>

      </div>


      {/* ==========================================================
          DETAILS MODAL
      =========================================================== */}

      {(selectedAnalysis || detailsLoading) && (

        <div
          className="history-modal-overlay"
          onClick={() => {
            if (!detailsLoading) {
              setSelectedAnalysis(null);
            }
          }}
        >

          <div
            className="history-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {detailsLoading ? (

              <div className="modal-loading">

                <div className="loading-spinner"></div>

                <h3>Loading analysis...</h3>

              </div>

            ) : (

              <>

                <div className="modal-header">

                  <div>

                    <span className="modal-eyebrow">
                      ANALYSIS DETAILS
                    </span>

                    <h2>
                      Analysis #{selectedAnalysis.id}
                    </h2>

                  </div>

                  <button
                    className="modal-close"
                    onClick={() =>
                      setSelectedAnalysis(null)
                    }
                  >
                    ×
                  </button>

                </div>


                <div className="modal-content">

                  {/* STATUS */}

                  <div className="modal-status-card">

                    <div>

                      <span>Risk Level</span>

                      <strong
                        className={`modal-risk ${getRiskClass(
                          selectedAnalysis.risk_level
                        )}`}
                      >
                        {String(
                          selectedAnalysis.risk_level ||
                            "LOW"
                        ).toUpperCase()}
                      </strong>

                    </div>


                    <div>

                      <span>Analysis Date</span>

                      <strong>
                        {formatDate(
                          selectedAnalysis.scan_started_at ||
                            selectedAnalysis.created_at
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* METRICS */}

                  <div className="modal-metrics">

                    <div className="modal-metric">
                      <span>People Count</span>

                      <strong>
                        {selectedAnalysis.people_count ?? 0}
                      </strong>
                    </div>


                    <div className="modal-metric">
                      <span>Average People</span>

                      <strong>
                        {Number(
                          selectedAnalysis.average_people || 0
                        ).toFixed(1)}
                      </strong>
                    </div>


                    <div className="modal-metric">
                      <span>Crowd Density</span>

                      <strong>
                        {Number(
                          selectedAnalysis.crowd_density || 0
                        ).toFixed(1)}
                        %
                      </strong>
                    </div>


                    <div className="modal-metric">
                      <span>Detections</span>

                      <strong>
                        {Array.isArray(
                          selectedAnalysis.boxes
                        )
                          ? selectedAnalysis.boxes.length
                          : 0}
                      </strong>
                    </div>

                  </div>


                  {/* INFORMATION */}

                  <div className="modal-info-grid">

                    <div>

                      <span>Filename</span>

                      <strong>
                        {selectedAnalysis.filename ||
                          "—"}
                      </strong>

                    </div>


                    <div>

                      <span>Camera</span>

                      <strong>
                        {getCameraName(
                          selectedAnalysis.camera_id
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* YOLO DETECTIONS */}

                  <div className="detection-section">

                    <div className="detection-section-header">

                      <div>

                        <h3>YOLO Detections</h3>

                        <p>
                          Bounding boxes detected during
                          the analysis.
                        </p>

                      </div>

                      <span>
                        {Array.isArray(
                          selectedAnalysis.boxes
                        )
                          ? selectedAnalysis.boxes.length
                          : 0}{" "}
                        detections
                      </span>

                    </div>


                    {Array.isArray(
                      selectedAnalysis.boxes
                    ) &&
                    selectedAnalysis.boxes.length > 0 ? (

                      <div className="boxes-grid">

                        {selectedAnalysis.boxes
                          .slice(0, 100)
                          .map((box, index) => (

                            <div
                              className="box-item"
                              key={index}
                            >

                              <span>
                                Person #{index + 1}
                              </span>

                              <small>
                                Confidence:{" "}
                                {(
                                  Number(
                                    box.confidence || 0
                                  ) * 100
                                ).toFixed(0)}
                                %
                              </small>

                            </div>

                          ))}

                      </div>

                    ) : (

                      <div className="no-detections">
                        No bounding-box data available.
                      </div>

                    )}

                  </div>

                </div>


                <div className="modal-footer">

                  <button
                    className="modal-secondary-btn"
                    onClick={() =>
                      setSelectedAnalysis(null)
                    }
                  >
                    Close
                  </button>

                  <button
                    className="modal-danger-btn"
                    onClick={() =>
                      deleteAnalysis(
                        selectedAnalysis.id
                      )
                    }
                  >
                    Delete Analysis
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}


      {/* ==========================================================
          PAGE CSS
          Kept inside this file so History doesn't depend on
          Reports CSS.
      =========================================================== */}

      <style>{`

        .history-page {
          background: #f4fbfb;
          min-height: 100vh;
        }

        .history-content {
          padding: 20px 28px 45px;
          box-sizing: border-box;
        }

        .history-header {
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 20px;
          padding: 24px 28px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 7px 25px rgba(35, 150, 150, 0.06);
        }

        .history-header-text {
          min-width: 0;
        }

        .history-eyebrow {
          color: #22aaa5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 5px;
        }

        .history-header h1 {
          margin: 0;
          color: #123d45;
          font-size: 30px;
          line-height: 1.2;
        }

        .history-header p {
          margin: 7px 0 0;
          color: #6e8990;
          font-size: 14px;
        }

        .history-refresh-btn {
          border: 1px solid #c8e8e6;
          background: #effafa;
          color: #229d98;
          border-radius: 10px;
          padding: 11px 17px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .history-refresh-btn:hover {
          background: #e3f7f6;
        }

        .history-refresh-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .refresh-spin {
          display: inline-block;
          animation: historySpin 0.8s linear infinite;
        }

        @keyframes historySpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .history-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 18px;
        }

        .history-summary-card {
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 17px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 6px 20px rgba(35, 150, 150, 0.05);
        }

        .history-summary-card > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .history-summary-card span {
          color: #789399;
          font-size: 12px;
          font-weight: 600;
        }

        .history-summary-card strong {
          color: #173e46;
          font-size: 23px;
          font-weight: 800;
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
        }

        .summary-icon-blue {
          background: #e7f8f8;
          color: #2aaca7;
        }

        .summary-icon-teal {
          background: #e5f8f7;
          color: #20aaa4;
        }

        .summary-icon-orange {
          background: #fff5e8;
          color: #df9740;
        }

        .summary-icon-red {
          background: #fff0ef;
          color: #d9655d;
        }

        .history-filter-card {
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 17px;
          padding: 16px 18px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          box-shadow: 0 6px 20px rgba(35, 150, 150, 0.05);
        }

        .history-search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .history-search-box > span {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #2aada7;
          font-size: 20px;
        }

        .history-search-box input {
          width: 100%;
          height: 42px;
          box-sizing: border-box;
          padding: 0 13px 0 38px;
          border: 1px solid #cfe6e5;
          border-radius: 10px;
          outline: none;
          background: #ffffff;
          color: #31545b;
          font-size: 13px;
        }

        .history-search-box input:focus {
          border-color: #35b6b0;
          box-shadow: 0 0 0 3px rgba(53, 182, 176, 0.1);
        }

        .history-filter-group {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .history-filter-group label {
          color: #67858b;
          font-size: 13px;
          font-weight: 700;
        }

        .history-filter-group select {
          height: 42px;
          min-width: 135px;
          padding: 0 30px 0 12px;
          border: 1px solid #cfe6e5;
          border-radius: 10px;
          background: #ffffff;
          color: #31545b;
          outline: none;
          cursor: pointer;
        }

        .history-result-count {
          color: #799399;
          font-size: 13px;
          white-space: nowrap;
        }

        .history-result-count strong {
          color: #31565d;
        }

        .selection-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }

        .selected-count {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #59787f;
          font-size: 13px;
        }

        .selected-check {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e3f8f6;
          color: #249f99;
          font-weight: 800;
        }

        .delete-selected-btn {
          border: 1px solid #efd2cf;
          background: #fff5f4;
          color: #cb625a;
          border-radius: 9px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .delete-selected-btn:hover {
          background: #ffebe9;
        }

        .delete-selected-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .history-error {
          background: #fff5f4;
          border: 1px solid #f0d3d0;
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: #a94e47;
        }

        .history-error > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .history-error span {
          font-size: 13px;
        }

        .history-error button {
          border: 1px solid #e9c3bf;
          background: #ffffff;
          color: #b95750;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: 700;
        }

        .history-loading {
          min-height: 300px;
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #718c92;
        }

        .history-loading h3 {
          margin: 14px 0 5px;
          color: #31565d;
        }

        .history-loading p {
          margin: 0;
          font-size: 13px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #dceeee;
          border-top-color: #2db1ab;
          border-radius: 50%;
          animation: historySpin 0.8s linear infinite;
        }

        .history-empty {
          min-height: 300px;
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          border-radius: 17px;
          background: #e6f8f7;
          color: #2aada7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .history-empty h2 {
          margin: 14px 0 6px;
          color: #234b53;
        }

        .history-empty p {
          margin: 0;
          max-width: 500px;
          color: #81999e;
          font-size: 13px;
        }

        .history-empty button {
          margin-top: 17px;
          border: none;
          background: #31b4ae;
          color: #ffffff;
          border-radius: 9px;
          padding: 10px 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .history-table-card {
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(35, 150, 150, 0.06);
        }

        .history-table-header {
          padding: 21px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid #e4eeee;
        }

        .history-table-header h2 {
          margin: 0;
          color: #173e46;
          font-size: 20px;
        }

        .history-table-header p {
          margin: 5px 0 0;
          color: #80979d;
          font-size: 12px;
        }

        .table-selection-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #52747b;
          font-size: 12px;
        }

        .table-selection-info button {
          border: 1px solid #d1e7e6;
          background: #f3fafa;
          color: #289e98;
          border-radius: 8px;
          padding: 7px 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .history-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .history-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
        }

        .history-table thead {
          background: #f1f9f9;
        }

        .history-table th {
          padding: 14px 13px;
          text-align: left;
          color: #55777e;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          border-bottom: 1px solid #dceeee;
        }

        .history-table td {
          padding: 14px 13px;
          color: #3c5e65;
          font-size: 13px;
          border-bottom: 1px solid #edf3f3;
          vertical-align: middle;
        }

        .history-table tbody tr:hover {
          background: #f9fcfc;
        }

        .history-table tbody tr:last-child td {
          border-bottom: none;
        }

        .analysis-row-selected {
          background: #f0fbfa !important;
        }

        .select-column {
          width: 42px;
          text-align: center !important;
        }

        .select-column input {
          width: 16px;
          height: 16px;
          accent-color: #31b4ae;
          cursor: pointer;
        }

        .analysis-id {
          color: #789197;
          font-weight: 700;
        }

        .file-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 330px;
        }

        .file-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #e5f8f7;
          color: #2aa9a3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .file-details {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .file-details strong {
          color: #244b53;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 270px;
        }

        .file-details small {
          color: #91a3a8;
          font-size: 10px;
        }

        .camera-badge {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 7px;
          background: #e8f8f7;
          border: 1px solid #d1edeb;
          color: #278f8a;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .people-value,
        .density-value {
          color: #234b53;
          font-size: 14px;
        }

        .risk-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .risk-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .risk-badge.low {
          color: #16803d;
          background: #ecfdf3;
        }

        .risk-badge.medium {
          color: #a16207;
          background: #fffbea;
        }

        .risk-badge.high {
          color: #c2410c;
          background: #fff4ed;
        }

        .risk-badge.critical {
          color: #b91c1c;
          background: #fff0f0;
        }

        .date-cell {
          color: #708c92;
          font-size: 11px;
          white-space: nowrap;
        }

        .table-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-view,
        .action-delete {
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .action-view {
          border: 1px solid #cfe8e6;
          background: #effafa;
          color: #289e98;
        }

        .action-delete {
          border: 1px solid #efd3d0;
          background: #fff5f4;
          color: #c96058;
        }

        .action-view:hover {
          background: #e1f6f5;
        }

        .action-delete:hover {
          background: #ffebe9;
        }

        .history-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(17, 48, 54, 0.42);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .history-modal {
          width: min(780px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #dceeee;
          box-shadow: 0 25px 70px rgba(15, 55, 60, 0.2);
        }

        .modal-header {
          padding: 20px 22px;
          border-bottom: 1px solid #e5eeee;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-eyebrow {
          color: #28aaa4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .modal-header h2 {
          margin: 5px 0 0;
          color: #173e46;
          font-size: 20px;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: 1px solid #d8e9e8;
          background: #f5fbfb;
          color: #67848a;
          font-size: 21px;
          cursor: pointer;
        }

        .modal-content {
          padding: 22px;
        }

        .modal-status-card {
          padding: 16px;
          border: 1px solid #deeeee;
          background: #f6fbfb;
          border-radius: 13px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .modal-status-card > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .modal-status-card span,
        .modal-metric span,
        .modal-info-grid span {
          color: #7b959a;
          font-size: 11px;
          font-weight: 600;
        }

        .modal-status-card strong {
          color: #31565d;
          font-size: 13px;
        }

        .modal-risk {
          width: fit-content;
          padding: 5px 9px;
          border-radius: 7px;
          font-size: 11px !important;
        }

        .modal-risk.low {
          color: #16803d;
          background: #ecfdf3;
        }

        .modal-risk.medium {
          color: #a16207;
          background: #fffbea;
        }

        .modal-risk.high {
          color: #c2410c;
          background: #fff4ed;
        }

        .modal-risk.critical {
          color: #b91c1c;
          background: #fff0f0;
        }

        .modal-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .modal-metric {
          padding: 14px;
          border: 1px solid #e0eeee;
          border-radius: 11px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .modal-metric strong {
          color: #234b53;
          font-size: 20px;
        }

        .modal-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .modal-info-grid > div {
          padding: 14px;
          background: #f7fbfb;
          border: 1px solid #e1eeee;
          border-radius: 11px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .modal-info-grid strong {
          color: #31565d;
          font-size: 12px;
          word-break: break-word;
        }

        .detection-section {
          margin-top: 17px;
          border: 1px solid #e0eeee;
          border-radius: 13px;
          overflow: hidden;
        }

        .detection-section-header {
          padding: 15px;
          background: #f5fbfb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .detection-section-header h3 {
          margin: 0;
          color: #31565d;
          font-size: 15px;
        }

        .detection-section-header p {
          margin: 4px 0 0;
          color: #81999e;
          font-size: 11px;
        }

        .detection-section-header > span {
          color: #299f99;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .boxes-grid {
          padding: 13px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
        }

        .box-item {
          padding: 9px;
          background: #f7fbfb;
          border: 1px solid #e0eeee;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .box-item span {
          color: #31565d;
          font-size: 11px;
          font-weight: 700;
        }

        .box-item small {
          color: #82999e;
          font-size: 10px;
        }

        .no-detections {
          padding: 25px;
          text-align: center;
          color: #82999e;
          font-size: 12px;
        }

        .modal-footer {
          padding: 15px 22px;
          border-top: 1px solid #e5eeee;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
        }

        .modal-secondary-btn,
        .modal-danger-btn {
          border-radius: 9px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .modal-secondary-btn {
          border: 1px solid #d3e8e7;
          background: #f4fbfb;
          color: #438087;
        }

        .modal-danger-btn {
          border: 1px solid #efd2cf;
          background: #fff4f3;
          color: #c55f57;
        }

        .modal-loading {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #708c92;
        }

        @media (max-width: 1100px) {

          .history-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .boxes-grid {
            grid-template-columns: repeat(3, 1fr);
          }

        }

        @media (max-width: 800px) {

          .history-content {
            padding: 15px;
          }

          .history-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .history-refresh-btn {
            width: 100%;
            justify-content: center;
          }

          .history-filter-card {
            align-items: stretch;
            flex-direction: column;
          }

          .history-search-box {
            min-width: 0;
          }

          .history-filter-group {
            justify-content: space-between;
          }

          .history-filter-group select {
            flex: 1;
          }

          .selection-actions {
            margin-left: 0;
          }

          .history-error {
            flex-direction: column;
            align-items: stretch;
          }

        }

        @media (max-width: 550px) {

          .history-summary-grid {
            grid-template-columns: 1fr;
          }

          .history-header h1 {
            font-size: 25px;
          }

          .modal-metrics {
            grid-template-columns: 1fr 1fr;
          }

          .modal-info-grid {
            grid-template-columns: 1fr;
          }

          .boxes-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

      `}</style>

    </div>
  );
}

export default AnalysisHistory;