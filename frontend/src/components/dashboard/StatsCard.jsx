import Card from "../ui/Card";

function StatsCard({ title, value, icon }) {
  return (
    <Card>
      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>
    </Card>
  );
}

export default StatsCard;