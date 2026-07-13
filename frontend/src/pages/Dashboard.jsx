import Sidebar from "../components/dashboard/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <main className="dashboard-content">

        <h1>Dashboard</h1>

        <p>
          Welcome to AI Crowd Risk Analyzer
        </p>

      </main>

    </div>
  );
}

export default Dashboard;