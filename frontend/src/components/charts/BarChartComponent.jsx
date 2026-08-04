import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
 CartesianGrid,
  Tooltip,
} from "recharts";




function BarChartComponent({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Bar Chart
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;