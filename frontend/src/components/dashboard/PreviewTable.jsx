import Card from "../ui/Card";

function PreviewTable({ columns, preview }) {
  if (!preview) return null;

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-4">
        Dataset Preview
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 border"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {preview.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="border px-4 py-2"
                  >
                    {String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default PreviewTable;