import "../../styles/stats-card.css";

function StatsCard({ stats = [] }) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-content">
            <p className="stats-card-label">No Data Available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`stats-card stats-card-${stat.color || "blue"}`}
        >
          <div className="stats-card-icon">
            {stat.icon}
          </div>

          <div className="stats-card-content">
            <p className="stats-card-label">
              {stat.label}
            </p>

            <h3 className="stats-card-value">
              {stat.value}
            </h3>

            <p className="stats-card-subtext">
              {stat.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;