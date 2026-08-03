import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import UploadCard from "../components/dashboard/UploadCard";
import DatasetCard from "../components/dashboard/DatasetCard";
import PreviewTable from "../components/dashboard/PreviewTable";
import QualityCard from "../components/dashboard/QualityCard";
import StatsCard from "../components/dashboard/StatsCard";

function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [columns, setColumns] = useState([]);
  const [qualityReport, setQualityReport] = useState(null);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const response = await api.get("/datasets");
      setDatasets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/datasets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");

      setFile(null);
      loadDatasets();
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const handlePreview = async (datasetId) => {
    try {
      const response = await api.get(`/datasets/${datasetId}/preview`);

      setColumns(response.data.columns);
      setPreview(response.data.rows);
    } catch (error) {
      console.error(error);
      alert("Preview failed.");
    }
  };

  const handleAnalyze = async (datasetId) => {
    try {
      const response = await api.get(
        `/datasets/${datasetId}/quality-summary`
      );

      setQualityReport(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed.");
    }
  };

  const handleDelete = async (datasetId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/datasets/${datasetId}`);

      alert("Dataset deleted successfully!");

      setPreview(null);
      setColumns([]);
      setQualityReport(null);

      loadDatasets();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  const handleRemoveDuplicates = async (datasetId) => {
  try {
    const response = await api.post(
      `/datasets/${datasetId}/clean/remove-duplicates`
    );

    alert(
      `${response.data.removed_duplicates} duplicate rows removed.`
    );

    handleAnalyze(datasetId);
  } catch (error) {
    console.error(error);
    alert("Operation failed.");
  }
};

const handleFillMissing = async (datasetId) => {
  try {
    const response = await api.post(
      `/datasets/${datasetId}/clean/fill-missing`
    );

    alert(response.data.message);

    handleAnalyze(datasetId);
  } catch (error) {
    console.error(error);
    alert("Operation failed.");
  }
};

const handleDropMissing = async (datasetId) => {
  try {
    const response = await api.post(
      `/datasets/${datasetId}/clean/drop-missing`
    );

    alert(
      `${response.data.removed_rows} rows removed.`
    );

    handleAnalyze(datasetId);
  } catch (error) {
    console.error(error);
    alert("Operation failed.");
  }
};

const handleDownload = (datasetId) => {
  window.open(
    `http://127.0.0.1:8000/api/v1/datasets/${datasetId}/download`,
    "_blank"
  );
};
return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Upload + Statistics */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <UploadCard
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
          />
<p className="text-red-500">
  Selected File: {file ? file.name : "No file selected"}
</p>


          <div className="grid grid-cols-2 gap-4">

            <StatsCard
              title="Datasets"
              value={datasets.length}
            />

            <StatsCard
              title="Rows"
              value={
                qualityReport
                  ? qualityReport.statistics.rows
                  : "-"
              }
            />

            <StatsCard
              title="Missing"
              value={
                qualityReport
                  ? qualityReport.missing_values.total_missing
                  : "-"
              }
            />

            <StatsCard
              title="Duplicates"
              value={
                qualityReport
                  ? qualityReport.duplicates.duplicate_rows
                  : "-"
              }
            />

          </div>

        </div>

        {/* Keep the rest of your dashboard below exactly as it is */}
<h2 className="text-2xl font-bold mb-4">
  My Datasets
</h2>

{datasets.length === 0 ? (
  <p>No datasets uploaded.</p>
) : (
  <ul className="space-y-4">
    {datasets.map((dataset) => (
      <li
        key={dataset.id}
        className="bg-white shadow rounded-lg p-4"
      >
        <h3 className="font-semibold mb-3">
          📄 {dataset.name}
        </h3>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => handlePreview(dataset.id)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Preview
          </button>

          <button
            onClick={() => handleAnalyze(dataset.id)}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            Analyze
          </button>

          <button
            onClick={() => handleRemoveDuplicates(dataset.id)}
            className="bg-yellow-500 text-white px-3 py-2 rounded"
          >
            Remove Duplicates
          </button>

          <button
            onClick={() => handleFillMissing(dataset.id)}
            className="bg-purple-500 text-white px-3 py-2 rounded"
          >
            Fill Missing
          </button>

          <button
            onClick={() => handleDropMissing(dataset.id)}
            className="bg-orange-500 text-white px-3 py-2 rounded"
          >
            Drop Missing
          </button>

          <button
            onClick={() => handleDownload(dataset.id)}
            className="bg-indigo-500 text-white px-3 py-2 rounded"
          >
            Download
          </button>

          <button
            onClick={() => handleDelete(dataset.id)}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Delete
          </button>

        </div>

      </li>
    ))}
  </ul>
)}

<PreviewTable
  columns={columns}
  preview={preview}
/>

<QualityCard
  report={qualityReport}
/>

      </div>
    </div>
  </>
);
     
}

export default Dashboard;