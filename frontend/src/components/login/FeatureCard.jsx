function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card">

      <div className={`feature-icon ${color}`}>
        {icon}
      </div>

      <div className="feature-text">

        <h3>{title}</h3>

        <p>{description}</p>

      </div>

    </div>
  );
}

export default FeatureCard;