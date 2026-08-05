import Card from "../ui/Card";

function ModelResult({ result }) {
  if (!result) return null;

  const quality =
    result.problem_type === "regression"
      ? "⭐⭐⭐⭐⭐ Excellent"
      : "⭐⭐⭐⭐ Good";

  return (
    <Card>
      <h2 className="text-3xl font-bold mb-8">
        🤖 AI Analysis
      </h2>

      {/* Status */}

      <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-green-700 text-xl">
          🟢 Model Status
        </h3>

        <p className="mt-2">
          Your dataset is ready for prediction.
        </p>
      </div>

      {/* AI Decision */}

      <div className="mb-6">
        <h3 className="font-semibold text-xl">
          🧠 AI Decision
        </h3>

        <p className="mt-2">
          InsightIQ analyzed your dataset and automatically
          selected the best machine learning model.
        </p>
      </div>

      {/* Selected Model */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-xl">
          🏆 Selected Model
        </h3>

        <p className="text-3xl font-bold text-blue-700 mt-3">
          {result.best_model}
        </p>
      </div>

      {/* Prediction Quality */}

      <div className="mb-6">
        <h3 className="font-semibold text-xl">
          📈 Prediction Quality
        </h3>

        <p className="text-2xl mt-2">
          {quality}
        </p>
      </div>

      {/* AI Explanation */}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-xl">
          💡 AI Explanation
        </h3>

        <p className="mt-3">
          Your target column was identified as a{" "}
          <strong>{result.problem_type}</strong> problem.
        </p>

        <p className="mt-2">
          After evaluating multiple machine learning models,
          <strong> {result.best_model}</strong> delivered the
          best overall performance and was selected automatically.
        </p>
      </div>

      {/* Recommendation */}

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h3 className="font-semibold text-xl">
          🚀 Next Step
        </h3>

        <p className="mt-3">
          Your AI model is ready.
        </p>

        <p>
          Continue to Prediction Studio and upload new
          unseen data to generate predictions.
        </p>
      </div>
    </Card>
  );
}

export default ModelResult;