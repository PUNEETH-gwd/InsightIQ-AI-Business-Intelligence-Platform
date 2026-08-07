import { useEffect, useState } from "react";
import api from "../services/api";
import AIInsights from "../components/ai/AIInsights";
import Navbar from "../components/layout/Navbar";
import UploadCard from "../components/dashboard/UploadCard";
import DatasetCard from "../components/dashboard/DatasetCard";
import PreviewTable from "../components/dashboard/PreviewTable";
import QualityCard from "../components/dashboard/QualityCard";
import StatsCard from "../components/dashboard/StatsCard";
import DynamicChart from "../components/charts/DynamicChart";
import ChartBuilder from "../components/charts/ChartBuilder";
import MLStudio from "../components/ml/MLStudio";
import ModelResult from "../components/ml/ModelResult";
import AIReport from "../components/ml/AIReport";
import {
  Database,
  Rows3,
  TriangleAlert,
  Copy,
} from "lucide-react";


function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [columns, setColumns] = useState([]);
  const [qualityReport, setQualityReport] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [aiReport, setAiReport] = useState(null);
  const [yAxis, setYAxis] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [algorithm, setAlgorithm] = useState("Linear Regression");
  const [modelResult, setModelResult] = useState(null);
 

  const loadDatasets = async () => {
    try {
      const response = await api.get("/datasets");
      setDatasets(response.data);
    } catch (error) {
      console.error(error);
    }
  };
   useEffect(() => {
    loadDatasets();
  }, []);

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
    setSelectedDatasetId(datasetId);
  try {
    // Load preview (columns + rows)
    const previewResponse = await api.get(
      `/datasets/${datasetId}/preview`
    );

    setColumns(previewResponse.data.columns);
    setPreview(previewResponse.data.rows);

    // Load quality report
    const qualityResponse = await api.get(
      `/datasets/${datasetId}/quality-summary`
    );

    setQualityReport(qualityResponse.data);

    // Load chart data
    const chartResponse = await api.get(
      `/datasets/${datasetId}/charts/bar`
    );

    setBarChartData(chartResponse.data);

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

const generateChart = async () => {

  if (!xAxis || !yAxis) {
    alert("Please select X and Y axis.");
    return;
  }

  try {

  const datasetId = selectedDatasetId;

    if (!datasetId) {
      alert("No dataset selected.");
      return;
    }

    const response = await api.post(
      `/datasets/${datasetId}/charts/generate`,
      {
        chart_type: chartType,
        x_axis: xAxis,
        y_axis: yAxis,
      }
    );

    setBarChartData(response.data);

  } catch (error) {
    console.error(error);
    alert("Chart generation failed.");
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
const handleDownload = async (datasetId) => {
  try {
    const response = await api.get(
      `/datasets/${datasetId}/download`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    

    const link = document.createElement("a");
    link.href = url;
    link.download = "cleaned_dataset.csv";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Download failed.");
  }
};

const handleAIInsights = async (datasetId) => {
  try {
    const response = await api.get(
      `/datasets/${datasetId}/ai-insights`
    );

    setAiInsights(response.data);

  } catch (error) {
    console.error(error);
    alert("AI Insights failed.");
  }
};

const trainModel = async () => {
  if (!selectedDatasetId) {
    alert("Please analyze a dataset first.");
    return;
  }

  if (!targetColumn) {
    alert("Please select a target column.");
    return;
  }

  try {
    const response = await api.post("/ml/train", {
      dataset_id: selectedDatasetId,
      target_column: targetColumn,
      algorithm: algorithm,
    });

    setModelResult(response.data);

    alert("Model trained successfully!");

  } catch (error) {
    console.error(error);
    alert("Model training failed.");
  }
};
const handleAIReport = async (datasetId) => {

  if (!yAxis) {
    alert("Please select a target column first.");
    return;
  }

  const response = await api.get(
    `/ml/${datasetId}/ai-report`,
    {
      params: {
        target_column: yAxis,
      },
    }
  );

  setAiReport(response.data);
};

return (
  <>
    <Navbar />

   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">

  <h1 className="text-4xl font-bold text-gray-800">
    👋 Welcome to InsightIQ
  </h1>

  <p className="text-gray-600 mt-2">
    Upload datasets, analyze data, train AI models, generate predictions, and export professional reports.
  </p>

</div>

        {/* Upload + Statistics */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <UploadCard
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
          />


<div className="grid grid-cols-2 gap-4">

  <StatsCard
    title="Datasets"
    value={datasets.length}
    icon={<Database size={34} />}
  />

  <StatsCard
    title="Rows"
    value={
      qualityReport
        ? qualityReport.statistics.rows
        : "-"
    }
    icon={<Rows3 size={34} />}
  />

  <StatsCard
    title="Missing"
    value={
      qualityReport
        ? qualityReport.missing_values.total_missing
        : "-"
    }
    icon={<TriangleAlert size={34} />}
  />

  <StatsCard
    title="Duplicates"
    value={
      qualityReport
        ? qualityReport.duplicates.duplicate_rows
        : "-"
    }
    icon={<Copy size={34} />}
  />

</div>

        </div>

        {/* Keep the rest of your dashboard below exactly as it is */}
<div className="flex items-center justify-between mb-6">

  <div>

    <h2 className="text-3xl font-bold text-gray-800">
      📂 My Datasets
    </h2>

    <p className="text-gray-500 mt-1">
      Manage and analyze your uploaded datasets.
    </p>

  </div>

</div>

{datasets.length === 0 ? (
  <p>No datasets uploaded.</p>
) : (
 <div className="space-y-5">
  {datasets.map((dataset) => (
    <DatasetCard
      key={dataset.id}
      dataset={dataset}
      onPreview={handlePreview}
      onAnalyze={handleAnalyze}
      onDownload={handleDownload}
      onDelete={handleDelete}
      onRemoveDuplicates={handleRemoveDuplicates}
      onFillMissing={handleFillMissing}
      onDropMissing={handleDropMissing}
      onAIInsights={handleAIInsights}
      onAIReport={handleAIReport}
    />
  ))}
</div>
  
)}

<PreviewTable
  columns={columns}
  preview={preview}
/>


<ChartBuilder
  columns={columns}
  chartType={chartType}
  setChartType={setChartType}
  xAxis={xAxis}
  setXAxis={setXAxis}
  yAxis={yAxis}
  setYAxis={setYAxis}
  generateChart={generateChart}
/>
<DynamicChart
    chartType={chartType}
    data={barChartData}
/>
<QualityCard
  report={qualityReport}
/>
<AIInsights data={aiInsights} />

<MLStudio
  columns={columns}
  targetColumn={targetColumn}
  setTargetColumn={setTargetColumn}
  algorithm={algorithm}
  setAlgorithm={setAlgorithm}
  trainModel={trainModel}
/>
<ModelResult result={modelResult} />
<AIReport report={aiReport} />
      </div>
    </div>
  </>
);    
}
export default Dashboard;