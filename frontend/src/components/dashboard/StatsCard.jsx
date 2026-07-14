import "../../styles/stats-card.css";

function StatsCard({ stat }) {
  return (
    <div className={`stats-card stats-card-${stat.color}`}>
      <div className="stats-card-icon">
        {stat.icon}
      </div>
      <div className="stats-card-content">
        <p className="stats-card-label">{stat.label}</p>
        <h3 className="stats-card-value">{stat.value}</h3>
        <p className="stats-card-subtext">{stat.subtext}</p>
      </div>
    </div>
  );
}

export default StatsCard;