import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import "../styles/reports.css";
import { FaDownload, FaFilter, FaCalendar } from "react-icons/fa";

function Reports() {
  const [reports] = useState([
    {
      id: 1,
      name: "Daily Crowd Analysis Report",
      date: "May 31, 2025",
      type: "Crowd Analysis",
      status: "Completed",
      size: "2.5 MB",
    },
    {
      id: 2,
      name: "Weekly Risk Assessment",
      date: "May 28, 2025",
      type: "Risk Assessment",
      status: "Completed",
      size: "3.2 MB",
    },
    {
      id: 3,
      name: "Monthly Analytics Summary",
      date: "May 1, 2025",
      type: "Analytics",
      status: "Completed",
      size: "4.1 MB",
    },
    {
      id: 4,
      name: "Incident Report - Zone 2",
      date: "May 30, 2025",
      type: "Incident",
      status: "Pending",
      size: "1.8 MB",
    },
  ]);

  const [filteredReports, setFilteredReports] = useState(reports);
  const [selectedType, setSelectedType] = useState("All");

  const filterReports = (type) => {
    setSelectedType(type);
    if (type === "All") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((r) => r.type === type));
    }
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "#22c55e" : "#eab308";
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p className="reports-subtitle">Generate and download crowd analysis reports</p>
          </div>
          <button className="generate-btn">
            <FaDownload /> Generate New Report
          </button>
        </div>

        <div className="reports-filters">
          <div className="filter-chips">
            <button
              className={`chip ${selectedType === "All" ? "active" : ""}`}
              onClick={() => filterReports("All")}
            >
              All Reports
            </button>
            <button
              className={`chip ${selectedType === "Crowd Analysis" ? "active" : ""}`}
              onClick={() => filterReports("Crowd Analysis")}
            >
              Crowd Analysis
            </button>
            <button
              className={`chip ${selectedType === "Risk Assessment" ? "active" : ""}`}
              onClick={() => filterReports("Risk Assessment")}
            >
              Risk Assessment
            </button>
            <button
              className={`chip ${selectedType === "Analytics" ? "active" : ""}`}
              onClick={() => filterReports("Analytics")}
            >
              Analytics
            </button>
            <button
              className={`chip ${selectedType === "Incident" ? "active" : ""}`}
              onClick={() => filterReports("Incident")}
            >
              Incidents
            </button>
          </div>
        </div>

        <div className="reports-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-info">
                <h3>{report.name}</h3>
                <div className="report-meta">
                  <span className="report-type">{report.type}</span>
                  <span className="report-date">
                    <FaCalendar /> {report.date}
                  </span>
                  <span className="report-size">{report.size}</span>
                </div>
              </div>
              <div className="report-actions">
                <span
                  className="report-status"
                  style={{ color: getStatusColor(report.status) }}
                >
                  {report.status}
                </span>
                <button className="download-btn">
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Reports;