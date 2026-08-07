import StatsCard from "./StatsCard";

function DashboardStats({ datasets }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <StatsCard
        title="Datasets"
        value={datasets.length}
        icon="📂"
      />

      <StatsCard
        title="AI Reports"
        value="--"
        icon="📄"
      />

      <StatsCard
        title="Models Trained"
        value="--"
        icon="🤖"
      />

      <StatsCard
        title="Predictions"
        value="--"
        icon="🔮"
      />

    </div>
  );
}

export default DashboardStats;