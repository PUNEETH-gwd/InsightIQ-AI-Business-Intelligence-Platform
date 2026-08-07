import Card from "../ui/Card";
import Button from "../ui/Button";

function UploadCard({
  setFile,
  handleUpload,
}) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        Upload Dataset
      </h2>

      <input
        type="file"
        className="mb-4 w-full"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <Button onClick={handleUpload}>
        Upload Dataset
      </Button>
    </Card>
  );
}

export default UploadCard;