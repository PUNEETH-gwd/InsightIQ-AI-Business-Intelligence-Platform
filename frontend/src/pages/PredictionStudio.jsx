import { useState } from "react";
import api from "../services/api";

function PredictionStudio() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        🔮 Prediction Studio
      </h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button
        onClick={handlePredict}
        className="mt-5 px-6 py-3 bg-blue-600 text-white rounded"
      >
        Predict
      </button>

      {result && (

        <div className="mt-8 border rounded p-5">

          <h2 className="text-xl font-bold">
            Prediction Completed
          </h2>

          <p>
            Rows Predicted:
            {result.rows}
          </p>

          <p>
            File:
            {result.prediction_file}
          </p>

        </div>

      )}

    </div>
  );
}

export default PredictionStudio;