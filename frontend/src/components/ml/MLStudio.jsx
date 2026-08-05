import Card from "../ui/Card";
import Button from "../ui/Button";

function MLStudio({
  columns,
  targetColumn,
  setTargetColumn,
  algorithm,
  setAlgorithm,
  trainModel,
}) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        🤖 Machine Learning Studio
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-semibold">
            Target Column
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={targetColumn}
            onChange={(e) =>
              setTargetColumn(e.target.value)
            }
          >
            <option value="">
              Select Target Column
            </option>

            {columns.map((column) => (
              <option
                key={column}
                value={column}
              >
                {column}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
  <h3 className="font-semibold text-blue-700">
    🤖 AutoML Engine
  </h3>

  <p className="text-sm text-gray-700 mt-2">
    InsightIQ will automatically:
  </p>

  <ul className="list-disc ml-5 mt-2 text-sm">
    <li>Detect the machine learning problem type</li>
    <li>Train suitable models</li>
    <li>Compare their performance</li>
    <li>Select the best model automatically</li>
  </ul>
</div>
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={algorithm}
            onChange={(e) =>
              setAlgorithm(e.target.value)
            }
          >
            <option>
              Linear Regression
            </option>

            <option>
              Random Forest
            </option>

            <option>
              Decision Tree
            </option>

            <option>
              Logistic Regression
            </option>
          </select>
        </div>

      </div>

      <Button
        className="mt-6"
        onClick={trainModel}
      >
        🚀 Train Model
      </Button>

    </Card>
  );
}

export default MLStudio;