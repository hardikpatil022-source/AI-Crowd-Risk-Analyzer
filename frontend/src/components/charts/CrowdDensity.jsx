import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "../../styles/crowd-density.css";

const data = [
  { time: "10:00", density: 18 },
  { time: "10:10", density: 24 },
  { time: "10:20", density: 40 },
  { time: "10:30", density: 55 },
  { time: "10:40", density: 50 },
  { time: "10:50", density: 68 },
  { time: "11:00", density: 72 },
  { time: "11:10", density: 86 },
  { time: "11:20", density: 78 },
  { time: "11:30", density: 83 },
  { time: "11:40", density: 80 },
  { time: "11:50", density: 92 },
];

export default function CrowdDensity() {
  return (
    <div className="density-card">

      <div className="density-top">

        <h3>CROWD DENSITY</h3>

        <span className="density-badge">
          High
        </span>

      </div>

      <div className="density-chart">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 5,
              left: -15,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="fillDensity"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#ef5350"
                  stopOpacity={0.40}
                />

                <stop
                  offset="95%"
                  stopColor="#ef5350"
                  stopOpacity={0.05}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="rgba(120,70,70,.12)"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="time"
              tick={{
                fill: "#6f777b",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#6f777b",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
            />

            <Area
              type="monotone"
              dataKey="density"
              stroke="#ef5350"
              strokeWidth={3}
              fill="url(#fillDensity)"
              dot={false}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}