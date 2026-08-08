import { memo } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

function ChartBuilder({
  columns,
  chartType,
  setChartType,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  generateChart,
}) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        Chart Builder
      </h2>

      <div className="grid md:grid-cols-3 gap-5">

        <div>
          <label className="font-semibold block mb-2">
            Chart Type
          </label>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="histogram">Histogram</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-2">
            X Axis
          </label>

          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select</option>

           {(columns || []).map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Y Axis
          </label>

          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select</option>

            {(columns || []).map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

      </div>

      <Button
        onClick={generateChart}
        className="mt-6"
      >
        Generate Chart
      </Button>
    </Card>
  );
}

export default memo(ChartBuilder);