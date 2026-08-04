import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  ScatterChart,
  Scatter,
  
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#dc2626",
  "#0891b2",
];

function DynamicChart({ chartType, data }) {
  if (!data || data.length === 0) return null;

  switch (chartType) {

    case "scatter":
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
  <CartesianGrid strokeDasharray="3 3" />

  <XAxis
    dataKey="name"
    name="Category"
  />

  <YAxis
    dataKey="value"
    name="Value"
  />

  <Tooltip />

  <Scatter
    data={data}
    fill="#2563eb"
  />
</ScatterChart>
    </ResponsiveContainer>
  );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>
      );
  }
}

export default DynamicChart;