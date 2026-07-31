import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import CameraFeed from "../components/camera/CameraFeed";

import CrowdDensity from "../components/charts/CrowdDensity";
import PeopleCountChart from "../components/charts/PeopleCountChart";
import RecentAlertsTable from "../components/charts/RecentAlertsTable";
import RiskAnalysis from "../components/ai/RiskAnalysis";

import concert from "../assets/videos/concert.mp4";
import street from "../assets/videos/street.mp4";

import {
  FaShieldAlt,
  FaVideo,
  FaUsers,
  FaExclamationTriangle,
  FaBrain
} from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard() {

  const exportToCSV = (data, filename) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

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
        Camera: "CAM-01",
        People: 1247,
        Risk: "Moderate",
      },
      {
        Camera: "CAM-02",
        People: 845,
        Risk: "Low",
      },
    ];

    exportToCSV(data, "crowd-dashboard");
  };

  return (
    <div className="dashboard">

      <Header onExport={exportDashboardData} />

      <div className="dashboard-body">

        <Sidebar />

        <main className="dashboard-content">

          <section className="dashboard-kpis">

            <div className="kpi-card">

              <div className="kpi-icon green">
                <FaShieldAlt />
              </div>

              <div className="kpi-content">
                <span>System Status</span>
                <h2>ONLINE</h2>
                <p>All Systems Operational</p>
              </div>

            </div>

            <div className="kpi-card">

              <div className="kpi-icon blue">
                <FaVideo />
              </div>

              <div className="kpi-content">
                <span>Active Cameras</span>
                <h2>08</h2>
                <p>Online</p>
              </div>

            </div>

            <div className="kpi-card">

              <div className="kpi-icon purple">
                <FaUsers />
              </div>

              <div className="kpi-content">
                <span>Total People</span>
                <h2>1247</h2>
                <p>+12%</p>
              </div>

            </div>

            <div className="kpi-card">

              <div className="kpi-icon red">
                <FaExclamationTriangle />
              </div>

              <div className="kpi-content">
                <span>Risk Level</span>
                <h2 className="danger">HIGH RISK</h2>
                <p>Possible Stampede</p>
              </div>

            </div>

            <div className="kpi-card">

              <div className="kpi-icon violet">
                <FaBrain />
              </div>

              <div className="kpi-content">
                <span>AI Model Status</span>
                <h2>ACTIVE</h2>
                <p>YOLOv8 + AI</p>
              </div>

            </div>

          </section>

          {/* =========================
              CONTROL ROOM
          ========================== */}

          <div className="control-room-layout">

            {/* Main Camera */}

            <div className="camera-area">

              <CameraFeed
                cameraNo="CAM-01"
                cameraName="Main Stage"
                location="North Zone"
                video={concert}
              />

            </div>

            {/* Right Panel */}

            <div className="side-panel">

              <div className="panel-card">
                <RiskAnalysis />
              </div>

            </div>

          </div>


          {/* =========================
    BOTTOM ANALYTICS
========================== */}

<div className="bottom-dashboard">

  <CrowdDensity />

  <PeopleCountChart />

  <RecentAlertsTable />

</div>


        </main>

      </div>

    </div>
  );
}

export default Dashboard;