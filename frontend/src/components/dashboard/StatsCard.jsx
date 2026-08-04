import Card from "../ui/Card";

function StatsCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;