import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import "./PeopleCountChart.css";

const data = [
  { time: "6 AM", people: 250 },
  { time: "9 AM", people: 480 },
  { time: "12 PM", people: 920 },
  { time: "3 PM", people: 1500 },
  { time: "6 PM", people: 1100 },
  { time: "9 PM", people: 620 },
];

function PeopleCountChart() {
  return (
    <div className="people-card">

      <div className="people-header">
        <div className="people-title">
          <h2>PEOPLE COUNT</h2>
          <span>(Today)</span>
        </div>

        <div className="people-growth">
          ↑ 12%
        </div>
      </div>

      <div className="people-number">
        1,247
      </div>

      <ResponsiveContainer width="100%" height={145}>
        <BarChart data={data}>
          <XAxis
            dataKey="time"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #1E293B",
              color: "#fff",
              borderRadius: "10px",
            }}
          />

          <Bar
            dataKey="people"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PeopleCountChart;