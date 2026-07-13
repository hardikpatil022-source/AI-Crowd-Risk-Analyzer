import {
  FaChartPie,
  FaVideo,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaRobot,
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-icon">
          <FaRobot />
        </div>

        <div>
          <h2>AI Crowd</h2>
          <span>Risk Analyzer</span>
        </div>

      </div>

      <nav className="sidebar-menu">

        <a href="#" className="active">
          <FaChartPie />
          <span>Dashboard</span>
        </a>

        <a href="#">
          <FaVideo />
          <span>Live Monitoring</span>
        </a>

        <a href="#">
          <FaChartLine />
          <span>Reports</span>
        </a>

        <a href="#">
          <FaCog />
          <span>Settings</span>
        </a>

      </nav>

      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;