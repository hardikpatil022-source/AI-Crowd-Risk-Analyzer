import {
  FaUsers,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

import FeatureCard from "./FeatureCard";
import crowdImage from "../../assets/images/crowd.jpg";

function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(3,10,25,.35), rgba(3,10,25,.75)), url(${crowdImage})`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">

        <div className="logo-row">

          <div className="logo-box">
            <FaShieldAlt />
          </div>

          <div className="brand">
            <h1 className="title">AI Crowd</h1>
            <h2 className="gradient-title">Risk Analyzer</h2>
          </div>

        </div>

        <div className="feature-list">

          <FeatureCard
            color="blue"
            icon={<FaUsers />}
            title="Real-Time Crowd Monitoring"
            description="AI-powered detection and counting of people in real time."
          />

          <FeatureCard
            color="purple"
            icon={<FaChartLine />}
            title="Risk Assessment"
            description="Predict dangerous crowd situations before they occur."
          />

          <div className="bottom-card">

            <div className="bottom-icon">
              <FaShieldAlt />
            </div>

            <div>

              <h3>
                Secure • Reliable • Intelligent
              </h3>

              <p>
                Built for public safety and smarter decisions.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;