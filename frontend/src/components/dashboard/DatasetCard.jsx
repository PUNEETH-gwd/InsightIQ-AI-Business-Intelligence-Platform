import Button from "../ui/Button";
import Card from "../ui/Card";

function DatasetCard({
  dataset,
  onPreview,
  onAnalyze,
  onDelete,
}) {
  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center">

        <div>
          <h3 className="font-bold">
            📄 {dataset.name}
          </h3>
        </div>

        <div className="flex gap-2">

          <Button
            onClick={() =>
              onPreview(dataset.id)
            }
          >
            Preview
          </Button>

          <Button
            onClick={() =>
              onAnalyze(dataset.id)
            }
          >
            Analyze
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={() =>
              onDelete(dataset.id)
            }
          >
            Delete
          </Button>

        </div>
      </div>
    </Card>
  );
}

export default DatasetCard;