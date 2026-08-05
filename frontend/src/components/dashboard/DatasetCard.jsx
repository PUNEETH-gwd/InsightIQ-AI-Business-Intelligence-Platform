import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  Eye,
  BarChart3,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react";

function DatasetCard({
  dataset,
  onPreview,
  onAnalyze,
  onDownload,
  onDelete,
  onRemoveDuplicates,
  onFillMissing,
  onDropMissing,
  onAIInsights,
  onAIReport,
}) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">
            📄 {dataset.name}
          </h3>

          <p className="text-gray-500 text-sm">
            Uploaded Dataset
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">

        <Button onClick={() => onPreview(dataset.id)}>
          <Eye size={18} />
          Preview
        </Button>

        <Button onClick={() => onAnalyze(dataset.id)}>
          <BarChart3 size={18} />
          Analyze
        </Button>

        <Button onClick={() => onRemoveDuplicates(dataset.id)}>
          <Sparkles size={18} />
          Remove Duplicates
        </Button>

        <Button onClick={() => onFillMissing(dataset.id)}>
          Fill Missing
        </Button>

        <Button onClick={() => onDropMissing(dataset.id)}>
          Drop Missing
        </Button>

        <Button onClick={() => onDownload(dataset.id)}>
          <Download size={18} />
          Download
        </Button>

        <Button onClick={() => onDelete(dataset.id)}>
          <Trash2 size={18} />
          Delete
        </Button>

        <Button onClick={() => onAIInsights(dataset.id)}>
  ✨ AI Insights
</Button>

<Button onClick={() => onAIReport(dataset.id)}>
  🤖 AI Report
</Button>

      </div>
    </Card>
  );
}

export default DatasetCard;