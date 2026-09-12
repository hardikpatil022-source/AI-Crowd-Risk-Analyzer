import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveMonitoring from "./pages/LiveMonitoring";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import UploadVideo from "./pages/UploadVideo";
import AddCCTV from "./pages/AddCCTV";
import AnalysisHistory from "./pages/AnalysisHistory";
import Analytics from "./pages/Analytics";
import Monitoring from "./pages/Monitoring";

function App() {
  return (
    <Routes>

      {/* ================================================== */}
      {/* LOGIN */}
      {/* ================================================== */}

      <Route path="/" element={<Login />} />


      {/* ================================================== */}
      {/* DASHBOARD */}
      {/* ================================================== */}

      <Route path="/dashboard" element={<Dashboard />} />


      {/* ================================================== */}
      {/* CCTV */}
      {/* ================================================== */}

      <Route path="/add-cctv" element={<AddCCTV />} />


      {/* ================================================== */}
      {/* MONITORING */}
      {/* ================================================== */}

      <Route path="/monitoring" element={<Monitoring />} />


      {/* ================================================== */}
      {/* UPLOAD VIDEO */}
      {/* ================================================== */}

      <Route path="/upload-video" element={<UploadVideo />} />


      {/* ================================================== */}
      {/* ANALYSIS HISTORY */}
      {/* ================================================== */}

      {/* Main history route */}
      <Route
        path="/history"
        element={<AnalysisHistory />}
      />

      {/* Existing/alternative history route */}
      <Route
        path="/analysis-history"
        element={<AnalysisHistory />}
      />


      {/* ================================================== */}
      {/* ANALYTICS */}
      {/* ================================================== */}

      <Route
        path="/analytics"
        element={<Analytics />}
      />


      {/* ================================================== */}
      {/* REPORTS */}
      {/* ================================================== */}

      <Route
        path="/reports"
        element={<Reports />}
      />


      {/* ================================================== */}
      {/* SETTINGS */}
      {/* ================================================== */}

      <Route
        path="/settings"
        element={<Settings />}
      />


      {/* ================================================== */}
      {/* LIVE MONITORING */}
      {/* ================================================== */}

      <Route
        path="/live"
        element={<LiveMonitoring />}
      />


      {/* ================================================== */}
      {/* 404 */}
      {/* ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;