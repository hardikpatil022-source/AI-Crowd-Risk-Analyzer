import { useState } from "react";
import "../styles/live-analytics.css";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import CameraFeed from "../components/camera/CameraFeed";
import CameraNetwork from "../components/camera/CameraNetwork";

import CrowdDensity from "../components/charts/CrowdDensity";
import PeopleCountChart from "../components/charts/PeopleCountChart";
import RecentAlertsTable from "../components/charts/RecentAlertsTable";
import RiskAnalysis from "../components/ai/RiskAnalysis";

import cameras from "../data/cameras";

import {
  FaShieldAlt,
  FaVideo,
  FaUsers,
  FaExclamationTriangle,
  FaBrain,
  FaEye,
  FaChartLine,
  FaRobot,
  FaDatabase,
  FaBell,
  FaArrowDown,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard() {
  /* =====================================================
     ACTIVE BUTTON
  ===================================================== */

  const [activeAction, setActiveAction] = useState(null);

  /* =====================================================
     ACTIVE CAMERA
  ===================================================== */

  const [activeCamera, setActiveCamera] = useState(cameras[0]);

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

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

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  /* =====================================================
     EXPORT DASHBOARD DATA
  ===================================================== */

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
      {
        Camera: "CAM-03",
        People: 1092,
        Risk: "High",
      },
      {
        Camera: "CAM-04",
        People: 734,
        Risk: "Low",
      },
      {
        Camera: "CAM-05",
        People: 1156,
        Risk: "Moderate",
      },
      {
        Camera: "CAM-06",
        People: 892,
        Risk: "Moderate",
      },
    ];

    exportToCSV(data, "crowd-dashboard");
  };

  return (
    <div className="dashboard">

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <Header onExport={exportDashboardData} />


      <div className="dashboard-body">

        <Sidebar />


        <main className="dashboard-content">

          {/* =====================================================
              SECTION 1 — PROJECT INTRODUCTION
          ====================================================== */}

          <section className="project-intro">

            <div className="intro-badge">
              <span className="intro-dot"></span>
              AI-POWERED CROWD SAFETY SYSTEM
            </div>


            <h1>
              AI Crowd Risk
              <span> Analyzer</span>
            </h1>


            <p className="intro-description">
              A smart computer-vision based system designed to monitor
              crowd activity, analyze crowd density, detect potential
              risks and provide intelligent safety recommendations
              in real time.
            </p>


            <div className="intro-actions">

              {/* ================================
                  VIEW LIVE MONITORING
              ================================= */}

              <button
                className={`primary-action ${
                  activeAction === "live" ? "action-active" : ""
                }`}
                onClick={() => {
                  setActiveAction("live");

                  document
                    .getElementById("live-monitoring")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <FaEye />

                View Live Monitoring
              </button>


              {/* ================================
                  LEARN HOW IT WORKS
              ================================= */}

              <button
                className={`secondary-action ${
                  activeAction === "works" ? "action-active" : ""
                }`}
                onClick={() => {
                  setActiveAction("works");

                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                Learn How It Works

                <FaArrowDown />
              </button>

            </div>

          </section>


          {/* =====================================================
              PROJECT INFORMATION CARDS
          ====================================================== */}

          <section className="information-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  PROJECT OVERVIEW
                </span>

                <h2>
                  Everything you need to know
                </h2>

              </div>


              <p>
                Understand the purpose, benefits and capabilities
                of the AI Crowd Risk Analyzer.
              </p>

            </div>


            <div className="info-grid">

              {/* ================================
                  CARD 1
              ================================= */}

              <div className="info-card">

                <div className="info-icon turquoise">
                  <FaShieldAlt />
                </div>

                <h3>
                  What is it?
                </h3>

                <p>
                  An AI-powered crowd monitoring platform that uses
                  computer vision and intelligent analytics to
                  understand crowd conditions from CCTV footage.
                </p>

              </div>


              {/* ================================
                  CARD 2
              ================================= */}

              <div className="info-card">

                <div className="info-icon beige">
                  <FaEye />
                </div>

                <h3>
                  Purpose
                </h3>

                <p>
                  Monitor large crowds continuously and identify
                  unusual density, congestion and potentially
                  dangerous situations before they escalate.
                </p>

              </div>


              {/* ================================
                  CARD 3
              ================================= */}

              <div className="info-card">

                <div className="info-icon mint">
                  <FaChartLine />
                </div>

                <h3>
                  Advantages
                </h3>

                <p>
                  Faster monitoring, automated crowd analysis,
                  early risk detection, centralized surveillance
                  and AI-assisted decision making.
                </p>

              </div>


              {/* ================================
                  CARD 4
              ================================= */}

              <div className="info-card">

                <div className="info-icon lavender">
                  <FaRobot />
                </div>

                <h3>
                  AI Intelligence
                </h3>

                <p>
                  Computer vision and AI models analyze visual
                  information to estimate crowd conditions and
                  generate actionable safety recommendations.
                </p>

              </div>

            </div>

          </section>


          {/* =====================================================
              HOW IT WORKS
          ====================================================== */}

          <section
            className="how-it-works"
            id="how-it-works"
          >

            <div className="section-heading centered">

              <span className="section-label">
                SYSTEM WORKFLOW
              </span>

              <h2>
                How the system works
              </h2>

              <p>
                From CCTV footage to intelligent safety decisions.
              </p>

            </div>


            <div className="workflow">

              {/* ================================
                  STEP 01
              ================================= */}

              <div className="workflow-step">

                <div className="workflow-number">
                  01
                </div>

                <div className="workflow-icon">
                  <FaVideo />
                </div>

                <h3>
                  CCTV Input
                </h3>

                <p>
                  Live camera feeds provide continuous visual
                  information from monitored areas.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* ================================
                  STEP 02
              ================================= */}

              <div className="workflow-step">

                <div className="workflow-number">
                  02
                </div>

                <div className="workflow-icon">
                  <FaBrain />
                </div>

                <h3>
                  AI Detection
                </h3>

                <p>
                  Computer vision analyzes frames and detects
                  people and crowd activity.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* ================================
                  STEP 03
              ================================= */}

              <div className="workflow-step">

                <div className="workflow-number">
                  03
                </div>

                <div className="workflow-icon">
                  <FaChartLine />
                </div>

                <h3>
                  Risk Analysis
                </h3>

                <p>
                  Crowd density and movement patterns are analyzed
                  to estimate the current risk level.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* ================================
                  STEP 04
              ================================= */}

              <div className="workflow-step">

                <div className="workflow-number">
                  04
                </div>

                <div className="workflow-icon">
                  <FaBell />
                </div>

                <h3>
                  Alert & Response
                </h3>

                <p>
                  Potential risks are highlighted and safety
                  recommendations can be provided.
                </p>

              </div>

            </div>

          </section>


          {/* =====================================================
              KEY CAPABILITIES
          ====================================================== */}

          <section className="capabilities-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  KEY CAPABILITIES
                </span>

                <h2>
                  Built for intelligent crowd monitoring
                </h2>

              </div>

            </div>


            <div className="capabilities-grid">

              {/* ================================
                  CAPABILITY 1
              ================================= */}

              <div className="capability-card">

                <FaVideo />

                <div>

                  <h3>
                    Multi-Camera Monitoring
                  </h3>

                  <p>
                    Monitor multiple CCTV feeds from different
                    zones simultaneously.
                  </p>

                </div>

              </div>


              {/* ================================
                  CAPABILITY 2
              ================================= */}

              <div className="capability-card">

                <FaUsers />

                <div>

                  <h3>
                    People Detection
                  </h3>

                  <p>
                    Detect and estimate the number of people
                    present in monitored areas.
                  </p>

                </div>

              </div>


              {/* ================================
                  CAPABILITY 3
              ================================= */}

              <div className="capability-card">

                <FaChartLine />

                <div>

                  <h3>
                    Crowd Density
                  </h3>

                  <p>
                    Analyze crowd concentration and identify
                    congested areas.
                  </p>

                </div>

              </div>


              {/* ================================
                  CAPABILITY 4
              ================================= */}

              <div className="capability-card">

                <FaExclamationTriangle />

                <div>

                  <h3>
                    Risk Detection
                  </h3>

                  <p>
                    Highlight potentially dangerous crowd
                    conditions.
                  </p>

                </div>

              </div>


              {/* ================================
                  CAPABILITY 5
              ================================= */}

              <div className="capability-card">

                <FaBrain />

                <div>

                  <h3>
                    AI Analysis
                  </h3>

                  <p>
                    Convert visual information into useful
                    intelligence for operators.
                  </p>

                </div>

              </div>


              {/* ================================
                  CAPABILITY 6
              ================================= */}

              <div className="capability-card">

                <FaDatabase />

                <div>

                  <h3>
                    Reports & Analytics
                  </h3>

                  <p>
                    View historical information, trends and
                    monitoring statistics.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =====================================================
              LIVE MONITORING SECTION
          ====================================================== */}

          <section
            className="live-monitoring-section"
            id="live-monitoring"
          >

            <div className="live-section-header">

              <div>

                <div className="live-title-row">

                  <span className="live-indicator">

                    <span></span>

                    LIVE

                  </span>


                  <span className="section-label">
                    CROWD MONITORING
                  </span>

                </div>


                <h2>
                  Live CCTV Control Room
                </h2>


                <p>
                  Monitor all active surveillance zones from
                  a centralized control interface.
                </p>

              </div>


              <div className="monitoring-status">

                <FaCheckCircle />

                <div>

                  <strong>
                    System Online
                  </strong>

                  <span>
                    6 Cameras Connected
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================== */}

            <div className="dashboard-kpis">

              {/* ================================
                  SYSTEM STATUS
              ================================= */}

              <div className="kpi-card">

                <div className="kpi-icon green">
                  <FaShieldAlt />
                </div>

                <div className="kpi-content">

                  <span>
                    System Status
                  </span>

                  <h2>
                    ONLINE
                  </h2>

                  <p>
                    All Systems Operational
                  </p>

                </div>

              </div>


              {/* ================================
                  ACTIVE CAMERAS
              ================================= */}

              <div className="kpi-card">

                <div className="kpi-icon blue">
                  <FaVideo />
                </div>

                <div className="kpi-content">

                  <span>
                    Active Cameras
                  </span>

                  <h2>
                    06
                  </h2>

                  <p>
                    Connected
                  </p>

                </div>

              </div>


              {/* ================================
                  TOTAL PEOPLE
              ================================= */}

              <div className="kpi-card">

                <div className="kpi-icon purple">
                  <FaUsers />
                </div>

                <div className="kpi-content">

                  <span>
                    Total People
                  </span>

                  <h2>
                    1,247
                  </h2>

                  <p>
                    Currently Detected
                  </p>

                </div>

              </div>


              {/* ================================
                  RISK LEVEL
              ================================= */}

              <div className="kpi-card">

                <div className="kpi-icon red">
                  <FaExclamationTriangle />
                </div>

                <div className="kpi-content">

                  <span>
                    Risk Level
                  </span>

                  <h2 className="danger">
                    HIGH
                  </h2>

                  <p>
                    Requires Attention
                  </p>

                </div>

              </div>


              {/* ================================
                  AI MODEL
              ================================= */}

              <div className="kpi-card">

                <div className="kpi-icon violet">
                  <FaBrain />
                </div>

                <div className="kpi-content">

                  <span>
                    AI Model
                  </span>

                  <h2>
                    ACTIVE
                  </h2>

                  <p>
                    YOLOv8 + AI
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                CAMERA + AI PANEL
            ================================================== */}

            <div className="control-room-layout">

              {/* ================================
                  CAMERA AREA
              ================================= */}

              <div className="camera-area">

                <CameraFeed
                  cameraNo={activeCamera.id}
                  cameraName={activeCamera.name}
                  location={activeCamera.location}
                  video={activeCamera.video}
                />


                <CameraNetwork
                  activeCamera={activeCamera}
                  onCameraSelect={setActiveCamera}
                />

              </div>


              {/* ================================
                  AI PANEL
              ================================= */}

              <div className="side-panel">

                <div className="panel-card">

                  <RiskAnalysis />

                </div>

              </div>

            </div>


            {/* =================================================
                ANALYTICS
            ================================================== */}

            <div className="analytics-heading">

              <div>

                <span className="section-label">
                  LIVE ANALYTICS
                </span>

                <h3>
                  Crowd Intelligence
                </h3>

              </div>


              <span>
                Updated in real time
              </span>

            </div>


            <div className="bottom-dashboard">

              <div className="analytics-card">

                <CrowdDensity />

              </div>


              <div className="analytics-card">

                <PeopleCountChart />

              </div>


              <div className="analytics-card">

                <RecentAlertsTable />

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;