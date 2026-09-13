import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/theme.css";


const savedSettings =
  localStorage.getItem("crowdRiskSettings");

if (savedSettings) {
  try {
    const settings = JSON.parse(savedSettings);

    document.documentElement.setAttribute(
      "data-theme",
      settings.theme || "light"
    );

    document.documentElement.setAttribute(
      "data-sidebar",
      settings.compactSidebar
        ? "compact"
        : "normal"
    );

    document.documentElement.setAttribute(
      "data-animations",
      settings.animations === false
        ? "off"
        : "on"
    );

  } catch {
    document.documentElement.setAttribute(
      "data-theme",
      "light"
    );
  }
}


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);