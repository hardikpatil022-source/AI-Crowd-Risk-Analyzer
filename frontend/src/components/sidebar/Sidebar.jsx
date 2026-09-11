import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  FaRobot,
  FaHome,
  FaBroadcastTower,
  FaUpload,
  FaHistory,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const monitoring = [
    {
      icon: <FaHome />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FaBroadcastTower />,
      label: "Add CCTV",
      path: "/add-cctv",
    },
    {
      icon: <FaUpload />,
      label: "Upload Video",
      path: "/upload-video",
    },
  ];

  const analysis = [
    {
      icon: <FaHistory />,
      label: "Analysis History",
      path: "/history",
    },
    {
      icon: <FaChartLine />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <FaFileAlt />,
      label: "Reports",
      path: "/reports",
    },
  ];

  const system = [
    {
      icon: <FaCog />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const renderMenu = (items) =>
    items.map((item) => (
      <NavLink
        to={item.path}
        key={item.path}
        className={({ isActive }) =>
          `sidebar-item ${isActive ? "active" : ""}`
        }
      >
        <span className="sidebar-icon">
          {item.icon}
        </span>

        <span className="sidebar-label">
          {item.label}
        </span>

        <FaChevronRight className="sidebar-arrow" />
      </NavLink>
    ));

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >

      {/* LOGO */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          <FaRobot />
        </div>

        <div className="logo-text">
          <h2>AI Crowd</h2>
          <span>Risk Analyzer</span>
        </div>

      </div>


      {/* NAVIGATION */}

      <div className="sidebar-navigation">

        {/* MONITORING */}

        <div className="sidebar-section">

          <div className="section-title">
            MONITORING
          </div>

          <nav className="sidebar-menu">
            {renderMenu(monitoring)}
          </nav>

        </div>


        {/* ANALYSIS */}

        <div className="sidebar-section">

          <div className="section-title">
            ANALYSIS
          </div>

          <nav className="sidebar-menu">
            {renderMenu(analysis)}
          </nav>

        </div>


        {/* SYSTEM */}

        <div className="sidebar-section">

          <div className="section-title">
            SYSTEM
          </div>

          <nav className="sidebar-menu">
            {renderMenu(system)}
          </nav>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;