import Card from "../ui/Card";

function StatsCard({ title, value }) {
  return (
    <Card className="text-center">
      <h3 className="text-gray-500 text-sm font-semibold">
        {title}
      </h3>

      <p className="text-3xl font-bold text-blue-600 mt-2">
        {value}
      </p>
    </Card>
  );
}

export default StatsCard;