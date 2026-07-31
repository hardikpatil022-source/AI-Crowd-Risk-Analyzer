import { useState } from "react";
import "./Sidebar.css";

import {
  FaRobot,
  FaChartPie,
  FaVideo,
  FaExclamationTriangle,
  FaUsers,
  FaChartLine,
  FaCamera,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    {
      icon: <FaChartPie />,
      label: "Dashboard",
      active: true,
    },
    {
      icon: <FaVideo />,
      label: "Live Monitoring",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Risk Analysis",
    },
    {
      icon: <FaUsers />,
      label: "Crowd Density",
    },
    {
      icon: <FaChartLine />,
      label: "Analytics",
    },
    {
      icon: <FaCamera />,
      label: "Cameras",
    },
    {
      icon: <FaCog />,
      label: "Settings",
    },
  ];

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* ================= Logo ================= */}

      <div className="sidebar-top">

        <div className="sidebar-logo">

          <div className="logo-icon">
            <FaRobot />
          </div>

          <div className="logo-text">

            <h2>AI Crowd</h2>

            <span>Risk Analyzer</span>

          </div>

        </div>

        {/* ================= Navigation ================= */}

        <nav className="sidebar-menu">

          {menuItems.map((item, index) => (
            <a
              href="#"
              key={index}
              className={item.active ? "active" : ""}
            >
              <div className="menu-icon">
                {item.icon}
              </div>

              <span className="menu-text">
                {item.label}
              </span>

              <FaChevronRight className="arrow" />
            </a>
          ))}

        </nav>

      </div>

      {/* ================= Bottom ================= */}

      <div className="sidebar-bottom">

        <div className="user-card">

          <div className="user-avatar">
            🛡
          </div>

          <div className="user-info">

            <strong>Security Supervisor</strong>

            <span>System Online</span>

          </div>

        </div>

        <button className="logout-btn">

          <FaSignOutAlt />

          <span>Logout</span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;