import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import "../styles/settings.css";
import {
  FaCog,
  FaBell,
  FaShieldAlt,
  FaUser,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    riskAlerts: true,
    dailySummary: true,
    twoFactorAuth: false,
    dataRetention: "30days",
    theme: "dark",
    sensitivity: "medium",
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <div className="settings-header">
          <h1>Settings</h1>
          <p className="settings-subtitle">Configure your account and preferences</p>
        </div>

        <div className="settings-container">
          {/* Profile Section */}
          <div className="settings-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h2>Profile Settings</h2>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" defaultValue="Hardik Patil" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" defaultValue="hardik@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <button className="save-btn">Save Changes</button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <div className="section-header">
              <FaBell className="section-icon" />
              <h2>Notifications</h2>
            </div>
            <div className="settings-toggles">
              <div className="toggle-item">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive alerts via email</p>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => toggleSetting("emailNotifications")}
                >
                  {settings.emailNotifications ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
              <div className="toggle-item">
                <div>
                  <h4>Push Notifications</h4>
                  <p>Get browser push alerts</p>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => toggleSetting("pushNotifications")}
                >
                  {settings.pushNotifications ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
              <div className="toggle-item">
                <div>
                  <h4>Risk Alerts</h4>
                  <p>Alert me about high-risk zones</p>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => toggleSetting("riskAlerts")}
                >
                  {settings.riskAlerts ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
              <div className="toggle-item">
                <div>
                  <h4>Daily Summary</h4>
                  <p>Send daily analytics summary</p>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => toggleSetting("dailySummary")}
                >
                  {settings.dailySummary ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="settings-section">
            <div className="section-header">
              <FaShieldAlt className="section-icon" />
              <h2>Security</h2>
            </div>
            <div className="settings-toggles">
              <div className="toggle-item">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security</p>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => toggleSetting("twoFactorAuth")}
                >
                  {settings.twoFactorAuth ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
              <div className="form-group">
                <label>Change Password</label>
                <input type="password" placeholder="Enter current password" />
                <input type="password" placeholder="Enter new password" />
                <button className="save-btn">Update Password</button>
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="settings-section">
            <div className="section-header">
              <FaCog className="section-icon" />
              <h2>System Preferences</h2>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label>Data Retention Period</label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => updateSetting("dataRetention", e.target.value)}
                >
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="90days">90 Days</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>
              <div className="form-group">
                <label>Detection Sensitivity</label>
                <select
                  value={settings.sensitivity}
                  onChange={(e) => updateSetting("sensitivity", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <button className="save-btn">Save Preferences</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;