import Card from "../ui/Card";

function AIInsights({ data }) {
  if (!data) return null;

  return (
    <Card>

      <h2 className="text-3xl font-bold mb-6">
        🤖 AI Data Analyst
      </h2>

      {/* Health Score */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg">
          🟢 Data Health Score
        </h3>

        <div className="w-full bg-gray-200 rounded-full h-5 mt-3">

          <div
            className="bg-green-500 h-5 rounded-full"
            style={{
              width: `${data.health_score}%`,
            }}
          />

        </div>

        <p className="mt-2 font-bold text-xl">
          {data.health_score}/100
        </p>

      </div>

      {/* Dataset Summary */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          📊 Dataset Summary
        </h3>

        <ul className="space-y-2">

          <li>
            Rows: {data.dataset_summary.rows}
          </li>

          <li>
            Columns: {data.dataset_summary.columns}
          </li>

          <li>
            Numeric Columns:
            {" "}
            {data.dataset_summary.numeric_columns}
          </li>

          <li>
            Categorical Columns:
            {" "}
            {data.dataset_summary.categorical_columns}
          </li>

        </ul>

      </div>

      {/* Quality */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          ⚠ Data Quality
        </h3>

        <ul className="space-y-2">

          <li>
            Missing Values:
            {" "}
            {data.quality.missing_values}
          </li>

          <li>
            Duplicate Rows:
            {" "}
            {data.quality.duplicate_rows}
          </li>

          <li>
            Outliers:
            {" "}
            {data.quality.outliers}
          </li>

        </ul>

      </div>

      {/* Recommendations */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          💡 Recommendations
        </h3>

        <ul className="list-disc pl-6">

          {data.recommendations.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}

        </ul>

      </div>

      {/* Algorithms */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          🤖 Suggested Algorithms
        </h3>

        <ul className="list-disc pl-6">

          {data.recommended_algorithms.map((algo, index) => (
            <li key={index}>
              {algo}
            </li>
          ))}

        </ul>

      </div>

      {/* Target */}

      <div className="mb-8">

        <h3 className="font-semibold text-lg mb-3">
          🎯 Suggested Target Columns
        </h3>

        <ul className="list-disc pl-6">

          {data.suggested_targets.map((target, index) => (
            <li key={index}>
              {target}
            </li>
          ))}

        </ul>

      </div>

      {/* Next Action */}

      <div className="bg-blue-50 rounded-xl p-4">

        <h3 className="font-bold">
          🚀 Next Action
        </h3>

        <p className="mt-2">
          {data.next_action}
        </p>

      </div>

    </Card>
  );
}

export default AIInsights;