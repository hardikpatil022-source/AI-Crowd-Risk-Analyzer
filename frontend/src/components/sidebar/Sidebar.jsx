import { useEffect, useState } from "react";
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

  const [compact, setCompact] = useState(false);

  /* =========================================
     LOAD SIDEBAR SETTING
  ========================================= */

  useEffect(() => {
    const loadSidebarSetting = () => {
      try {
        const saved = localStorage.getItem(
          "crowdRiskSettings"
        );

        if (saved) {
          const settings = JSON.parse(saved);

          setCompact(
            settings.compactSidebar === true
          );
        }
      } catch (error) {
        console.error(
          "Failed to load sidebar setting:",
          error
        );
      }
    };

    loadSidebarSetting();

    /*
      Listen for changes made from Settings.
      This allows the sidebar to update without
      needing to refresh the page.
    */

    const handleSettingsChange = () => {
      loadSidebarSetting();
    };

    window.addEventListener(
      "crowdRiskSettingsChanged",
      handleSettingsChange
    );

    window.addEventListener(
      "storage",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "crowdRiskSettingsChanged",
        handleSettingsChange
      );

      window.removeEventListener(
        "storage",
        handleSettingsChange
      );
    };
  }, []);

  /* =========================================
     MENU ITEMS
  ========================================= */

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

  /* =========================================
     RENDER MENU
  ========================================= */

  const renderMenu = (items) =>
    items.map((item) => (
      <NavLink
        to={item.path}
        key={item.path}
        className={({ isActive }) =>
          `sidebar-item ${
            isActive ? "active" : ""
          }`
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

  /* =========================================
     SIDEBAR CLASS
  ========================================= */

  const sidebarClass = [
    "sidebar",
    expanded ? "expanded" : "",
    compact ? "compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* =========================================
     UI
  ========================================= */

  return (
    <aside
      className={sidebarClass}
      onMouseEnter={() => {
        if (!compact) {
          setExpanded(true);
        }
      }}
      onMouseLeave={() => {
        if (!compact) {
          setExpanded(false);
        }
      }}
    >

      {/* =====================================
          LOGO
      ===================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          <FaRobot />
        </div>

        <div className="logo-text">
          <h2>AI Crowd</h2>
          <span>Risk Analyzer</span>
        </div>

      </div>


      {/* =====================================
          NAVIGATION
      ===================================== */}

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