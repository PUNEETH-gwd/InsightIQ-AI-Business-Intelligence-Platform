import Card from "../ui/Card";

function QualityCard({ report }) {
  if (!report) return null;

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-4">
        Data Quality Report
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">Rows</p>
          <h3 className="text-2xl font-bold">
            {report.statistics.rows}
          </h3>
        </div>

        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">Columns</p>
          <h3 className="text-2xl font-bold">
            {report.statistics.columns}
          </h3>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">Missing</p>
          <h3 className="text-2xl font-bold">
            {report.missing_values.total_missing}
          </h3>
        </div>

        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">Duplicates</p>
          <h3 className="text-2xl font-bold">
            {report.duplicates.duplicate_rows}
          </h3>
        </div>

      </div>
    </Card>
  );
}

export default QualityCard;