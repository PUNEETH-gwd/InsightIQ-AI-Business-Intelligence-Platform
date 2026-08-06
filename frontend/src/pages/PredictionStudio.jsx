import { useState } from "react";
import api from "../services/api";

function PredictionStudio() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post(
        "/ml/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          🔮 Prediction Studio
        </h1>

        {/* AI Model Status */}

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow mb-8">

          <h2 className="text-2xl font-semibold mb-3">
            🏆 AI Model Status
          </h2>

          <p className="text-lg">
            <strong>Best Model:</strong> Random Forest
          </p>

          <p className="mt-2 text-green-700 font-medium">
            ✅ Your trained AI model is ready for prediction.
          </p>

        </div>

        {/* Upload Section */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-5">
            📂 Upload Prediction Dataset
          </h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-5"
          />

          <br />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Generating..."
              : "🔮 Generate Predictions"}
          </button>

        </div>

        {/* Result */}

        {result && (

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold text-green-700 mb-5">
              ✅ Prediction Completed
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Rows Processed:</strong>{" "}
                {result.rows}
              </p>

              <p>
                <strong>Prediction File:</strong>
              </p>

              <div className="bg-gray-100 rounded-lg p-3">
                {result.prediction_file}
              </div>

            </div>

            {/* AI Summary */}

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

              <h3 className="text-xl font-semibold mb-3">
                🤖 AI Prediction Summary
              </h3>

              <ul className="list-disc ml-5 space-y-2">

                <li>
                  {result.rows} records were processed.
                </li>

                <li>
                  Predictions generated successfully.
                </li>

                <li>
                  Your trained AI model was used for prediction.
                </li>

                <li>
                  You can now download the prediction results.
                </li>

              </ul>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default PredictionStudio;