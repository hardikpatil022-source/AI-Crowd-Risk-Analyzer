import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/analytics-charts.css";

function AnalyticsCharts() {
  const crowdData = [
    { time: "00:00", people: 120, capacity: 500 },
    { time: "04:00", people: 85, capacity: 500 },
    { time: "08:00", people: 420, capacity: 500 },
    { time: "12:00", people: 680, capacity: 500 },
    { time: "16:00", people: 920, capacity: 500 },
    { time: "20:00", people: 750, capacity: 500 },
    { time: "23:59", people: 380, capacity: 500 },
  ];

  const riskData = [
    { zone: "Zone 1", highRisk: 5, mediumRisk: 12, lowRisk: 83 },
    { zone: "Zone 2", highRisk: 8, mediumRisk: 25, lowRisk: 67 },
    { zone: "Zone 3", highRisk: 2, mediumRisk: 15, lowRisk: 83 },
    { zone: "Zone 4", highRisk: 10, mediumRisk: 30, lowRisk: 60 },
  ];

  const alertsData = [
    { name: "Critical", value: 8, color: "#ef4444" },
    { name: "Warning", value: 24, color: "#eab308" },
    { name: "Info", value: 68, color: "#3b82f6" },
  ];

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Analytics & Insights</h2>

      {/* Crowd Flow Chart */}
      <div className="chart-card">
        <h3>Crowd Flow Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={crowdData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="people"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
            />
            <Line
              type="monotone"
              dataKey="capacity"
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Assessment Chart */}
      <div className="chart-card">
        <h3>Risk Assessment by Zone</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="zone" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Bar dataKey="highRisk" stackId="a" fill="#ef4444" />
            <Bar dataKey="mediumRisk" stackId="a" fill="#eab308" />
            <Bar dataKey="lowRisk" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Distribution */}
      <div className="chart-card">
        <h3>Alerts Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={alertsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {alertsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f1f5f9" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsCharts;