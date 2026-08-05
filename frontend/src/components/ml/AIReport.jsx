import Card from "../ui/Card";

function AIReport({ report }) {

  if (!report) return null;

  return (
    <Card>

      <h2 className="text-2xl font-bold mb-6">
        🤖 AI Report
      </h2>

      {/* Dataset Summary */}

      <div className="mb-6">

        <h3 className="font-semibold text-lg">
          📋 Dataset Summary
        </h3>

        <p>Dataset: {report.dataset_summary.dataset_name}</p>

        <p>Rows: {report.dataset_summary.rows}</p>

        <p>Columns: {report.dataset_summary.columns}</p>

        <p>
          Target: {report.dataset_summary.target_column}
        </p>

        <p>
          Problem Type: {report.dataset_summary.problem_type}
        </p>

      </div>

      {/* Data Quality */}

      <div className="mb-6">

        <h3 className="font-semibold text-lg">
          ⚠ Data Quality
        </h3>

        <p>
          Missing Values:
          {report.data_quality.missing_values}
        </p>

        <p>
          Duplicates:
          {report.data_quality.duplicates}
        </p>

      </div>

      {/* Explanation */}

      <div className="mb-6">

        <h3 className="font-semibold text-lg">
          💡 AI Explanation
        </h3>

        {report.explanation.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

      </div>

      {/* Suggestions */}

      <div>

        <h3 className="font-semibold text-lg">
          🚀 Suggestions
        </h3>

        <ul className="list-disc ml-5">

          {report.suggestions.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}

        </ul>

      </div>

    </Card>
  );
}

export default AIReport;