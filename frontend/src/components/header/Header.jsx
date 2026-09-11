import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import {
  FaBell,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Header() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const currentTime = time.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="header">

      {/* ================= LEFT ================= */}

      <div className="header-left">

        <div className="header-logo-box">
          <FaShieldAlt />
        </div>

        <div className="header-brand">
          <h1>AI CROWD</h1>
          <span>RISK ANALYZER</span>
        </div>

      </div>


      {/* ================= CENTER ================= */}

      <div className="header-center">

        <span className="header-date">
          {currentDate}
        </span>

        <h2>
          {currentTime}
        </h2>

      </div>


      {/* ================= RIGHT ================= */}

      <div className="header-right">

        <button
          className="header-icon-btn"
          title="Notifications"
        >
          <FaBell />
        </button>

        <button
          className="header-icon-btn"
          title="Settings"
        >
          <FaCog />
        </button>

        <div className="header-user">

          <strong>
            Security Supervisor
          </strong>

          <span>
            <i></i>
            Online
          </span>

        </div>

        {/* LOGOUT */}

        <button
          className="header-logout-btn"
          title="Logout"
          type="button"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
        </button>

      </div>

    </header>
  );
}

export default Header;