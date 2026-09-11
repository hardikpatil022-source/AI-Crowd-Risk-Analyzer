import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

import MonitoringLayout from "../components/monitoring/MonitoringLayout";

function Monitoring() {

  return (

    <div className="dashboard">

      <Header />

      <div className="dashboard-body">

        <Sidebar />

        <main className="dashboard-content">

          <MonitoringLayout />

        </main>

      </div>

    </div>

  );

}

export default Monitoring;