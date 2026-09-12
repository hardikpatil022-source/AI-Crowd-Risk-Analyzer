import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import "../styles/reports.css";

import {
  FaDownload,
  FaFilter,
  FaCalendar,
  FaSyncAlt,
  FaFileCsv,
  FaFilePowerpoint,
} from "react-icons/fa";


const API_BASE_URL = "http://127.0.0.1:8000";


function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // FETCH REPORTS
  // ============================================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reports`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReports(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Reports fetch error:",
        err
      );

      setError(
        "Unable to load reports. Make sure the backend is running."
      );

      setReports([]);

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
  fetchReports();

  const interval = setInterval(() => {
    fetchReports();
  }, 60000);

  return () => {
    clearInterval(interval);
  };
}, []);

  // ============================================================
  // GENERATE NEW REPORT
  // ============================================================

  const generateNewReport = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reports/generate`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to generate report"
        );
      }

      await fetchReports();

      alert(
        "New YOLO report generated successfully!"
      );

    } catch (err) {
      console.error(
        "Report generation error:",
        err
      );

      alert(
        err.message ||
        "Unable to generate report."
      );

    } finally {
      setGenerating(false);
    }
  };


  // ============================================================
  // DOWNLOAD REPORT
  // ============================================================

  const downloadReport = (filename) => {
    if (!filename) {
      return;
    }

    const downloadUrl =
      `${API_BASE_URL}/reports/download/` +
      encodeURIComponent(filename);

    window.open(
      downloadUrl,
      "_blank"
    );
  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(
      dateString
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
  };


  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) {
      return "0 KB";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes / (1024 * 1024)
    ).toFixed(1)} MB`;
  };


  // ============================================================
  // REPORT TYPE
  // ============================================================

  const getReportType = (filename) => {
    if (!filename) {
      return "FILE";
    }

    const extension =
      filename
        .split(".")
        .pop()
        .toUpperCase();

    return extension;
  };


  // ============================================================
  // REPORT ICON
  // ============================================================

  const getReportIcon = (filename) => {
    const type =
      getReportType(filename);

    if (type === "CSV") {
      return <FaFileCsv />;
    }

    if (type === "PPTX") {
      return <FaFilePowerpoint />;
    }

    return <FaDownload />;
  };


  // ============================================================
  // FILTER REPORTS
  // ============================================================

  const filteredReports =
    selectedType === "All"
      ? reports
      : reports.filter(
          (report) =>
            getReportType(
              report.filename
            ) === selectedType
        );


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="dashboard">

      <Header />

      <div className="reports-page">

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <Sidebar />


      {/* ======================================================
          MAIN AREA
      ====================================================== */}

      <div className="reports-main">

        <main className="reports-content">

          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <section className="reports-title-card">

            <div>

              <h1>
                Reports
              </h1>

              <p>
                Generate and download crowd analysis reports
              </p>

            </div>


            <div className="reports-actions">

              {/* REFRESH */}

              <button
                className="reports-btn reports-btn-secondary"
                onClick={fetchReports}
                disabled={loading}
              >

                <FaSyncAlt />

                Refresh

              </button>


              {/* GENERATE */}

              <button
                className="reports-btn reports-btn-primary"
                onClick={generateNewReport}
                disabled={generating}
              >

                {generating ? (
                  <>
                    <FaSyncAlt className="reports-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaDownload />
                    Generate New Report
                  </>
                )}

              </button>

            </div>

          </section>


          {/* ==================================================
              ERROR MESSAGE
          ================================================== */}

          {error && (
            <div className="reports-error">
              {error}
            </div>
          )}


          {/* ==================================================
              FILTER BAR
          ================================================== */}

          <section className="reports-filter-card">

            <div className="reports-filter-left">

              <FaFilter />

              <span>
                Filter by Type:
              </span>

              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="CSV">
                  CSV
                </option>

                <option value="PPTX">
                  PPTX
                </option>

              </select>

            </div>


            <div className="reports-count">

              <FaCalendar />

              {filteredReports.length} report
              {filteredReports.length !== 1
                ? "s"
                : ""}

            </div>

          </section>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <section className="reports-empty">

              <FaSyncAlt className="reports-spin" />

              <h3>
                Loading reports...
              </h3>

            </section>

          ) : filteredReports.length === 0 ? (

            /* ==================================================
               NO REPORTS
            ================================================== */

            <section className="reports-empty">

              <div className="reports-empty-icon">

                <FaDownload />

              </div>

              <h3>
                No reports available
              </h3>

              <p>
                Run a YOLO crowd analysis first,
                then generate a report.
              </p>

              <button
                className="reports-btn reports-btn-primary"
                onClick={generateNewReport}
                disabled={generating}
              >

                <FaDownload />

                Generate Report

              </button>

            </section>

          ) : (

            /* ==================================================
               REPORT CARDS
            ================================================== */

            <section className="reports-grid">

              {filteredReports.map(
                (report, index) => {

                  const filename =
                    report.filename ||
                    report.name ||
                    `Report-${index + 1}`;

                  const type =
                    getReportType(
                      filename
                    );

                  return (
                    <article
                      className="reports-card"
                      key={
                        filename +
                        index
                      }
                    >

                      {/* CARD TOP */}

                      <div className="reports-card-top">

                        <div className="reports-file-icon">

                          {getReportIcon(
                            filename
                          )}

                        </div>


                        <span className="reports-completed">

                          ✓ Completed

                        </span>

                      </div>


                      {/* FILE NAME */}

                      <h3>
                        {filename}
                      </h3>


                      {/* DATE */}

                      <div className="reports-date">

                        <FaCalendar />

                        {formatDate(
                          report.created_at
                        )}

                      </div>


                      {/* TYPE + SIZE */}

                      <div className="reports-meta">

                        <span>
                          {type}
                        </span>

                        <span>
                          {formatFileSize(
                            report.size
                          )}
                        </span>

                      </div>


                      {/* DOWNLOAD */}

                      <button
                        className="reports-download"
                        onClick={() =>
                          downloadReport(
                            filename
                          )
                        }
                      >

                        <FaDownload />

                        Download

                      </button>

                    </article>
                  );
                }
              )}

            </section>

          )}

        </main>

      </div>

      </div>

    </div>
  );
}


export default Reports;