import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [columns, setColumns] = useState([]);

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

  const handleDelete = async (datasetId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/datasets/${datasetId}`);

      alert("Dataset deleted successfully!");

      setPreview(null);
      setColumns([]);

      loadDatasets();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>InsightIQ Dashboard</h1>

      <hr />

      <h2>Upload Dataset</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        style={{ marginLeft: "10px" }}
      >
        Upload
      </button>

      <hr />

      <h2>My Datasets</h2>

      {datasets.length === 0 ? (
        <p>No datasets uploaded.</p>
      ) : (
        <ul>
          {datasets.map((dataset) => (
            <li key={dataset.id}>
              {dataset.name}

              <button
                onClick={() => handlePreview(dataset.id)}
                style={{ marginLeft: "10px" }}
              >
                Preview
              </button>

              <button
                onClick={() => handleDelete(dataset.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Dataset Preview</h2>

      {preview && (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {preview.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>
                    {String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;