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

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* CCTV */}
      <Route path="/add-cctv" element={<AddCCTV />} />

      {/* Monitoring */}
      <Route path="/monitoring" element={<Monitoring />} />

      {/* Upload Video */}
      <Route path="/upload-video" element={<UploadVideo />} />

      {/* History */}
      <Route path="/analysis-history" element={<AnalysisHistory />} />

      {/* Analytics */}
      <Route path="/analytics" element={<Analytics />} />

      {/* Reports */}
      <Route path="/reports" element={<Reports />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />} />

      {/* Live Monitoring (optional) */}
      <Route path="/live" element={<LiveMonitoring />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;