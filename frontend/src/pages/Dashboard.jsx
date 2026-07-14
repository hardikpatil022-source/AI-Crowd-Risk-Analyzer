import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import LiveCameraFeeds from "../components/dashboard/LiveCameraFeeds";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import AlertsSection from "../components/dashboard/AlertsSection";
import SearchFilter from "../components/dashboard/SearchFilter";
import "../styles/dashboard.css";
import {
  FaVideo,
  FaUsers,
  FaExclamationTriangle,
  FaBell,
  FaChartLine,
  FaDownload,
} from "react-icons/fa";

function Dashboard() {
  const [stats] = useState([
    {
      id: 1,
      label: "Total Cameras",
      value: "8",
      subtext: "AI Active",
      icon: <FaVideo />,
      color: "blue",
    },
    {
      id: 2,
      label: "People Detected",
      value: "1,247",
      subtext: "Total in all zones",
      icon: <FaUsers />,
      color: "purple",
    },
    {
      id: 3,
      label: "High Risk Zones",
      value: "2",
      subtext: "Require Attention",
      icon: <FaExclamationTriangle />,
      color: "red",
    },
    {
      id: 4,
      label: "Alerts Today",
      value: "5",
      subtext: "New Alerts",
      icon: <FaBell />,
      color: "orange",
    },
    {
      id: 5,
      label: "Average Risk Level",
      value: "Moderate",
      subtext: "Overall Risk",
      icon: <FaChartLine />,
      color: "green",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Export function moved here
  const exportToCSV = (data, filename) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const exportDashboardData = () => {
    const data = [
      {
        Metric: "Total Cameras",
        Value: "8",
        Status: "Active",
      },
      {
        Metric: "People Detected",
        Value: "1,247",
        Status: "Real-time",
      },
      {
        Metric: "High Risk Zones",
        Value: "2",
        Status: "Alert",
      },
    ];
    exportToCSV(data, "dashboard-data");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        {/* Header with Search & Export */}
        <div className="dashboard-header">
          <div className="header-top">
            <h1>Live Monitoring Dashboard</h1>
            <p className="header-subtitle">Real-time crowd monitoring and risk analysis</p>
          </div>
          <div className="header-actions">
            <button className="export-btn" onClick={exportDashboardData}>
              <FaDownload /> Export Data
            </button>
            <span className="timestamp">May 31, 2025 | 10:24:08 AM</span>
            <span className="status-badge live">● Live</span>
          </div>
        </div>

        {/* Search & Filter */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Alerts Section */}
        <AlertsSection />

        {/* Live Camera Feeds */}
        <LiveCameraFeeds searchTerm={searchTerm} filters={filters} />

        {/* Analytics Charts */}
        <AnalyticsCharts />
      </main>
    </div>
  );
}

export default Dashboard;