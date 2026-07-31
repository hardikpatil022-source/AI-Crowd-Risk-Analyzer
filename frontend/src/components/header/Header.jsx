import { useEffect, useState } from "react";
import "./Header.css";

import {
  FaBell,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Header() {
  const [time, setTime] = useState(new Date());

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

  const currentTime = time.toLocaleTimeString("en-IN");

  return (
    <header className="header">

      {/* LEFT */}

      <div className="header-left">

        <div className="logo-box">
          <FaShieldAlt />
        </div>

        <div className="brand">

          <h1>AI CROWD</h1>

          <span>RISK ANALYZER</span>

        </div>

      </div>

      {/* CENTER */}

      <div className="header-center">

        <span className="date">
          {currentDate}
        </span>

        <h2>
          {currentTime}
        </h2>

      </div>

      {/* RIGHT */}

      <div className="header-right">

        <button className="icon-btn">
          <FaBell />
        </button>

        <button className="icon-btn">
          <FaCog />
        </button>

        <div className="user-info">

          <strong>
            Security Supervisor
          </strong>

          <span>
            ● Online
          </span>

        </div>

        <button className="logout-btn">

          <FaSignOutAlt />

        </button>

      </div>

    </header>
  );
}

export default Header;