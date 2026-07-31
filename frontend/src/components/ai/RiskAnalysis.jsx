import "../../styles/risk-analysis.css";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaBell,
  FaVolumeUp,
  FaBullhorn,
  FaMapMarkedAlt,
} from "react-icons/fa";

function RiskAnalysis() {
  return (
    <div className="risk-panel">

      <h3 className="risk-title">AI RISK ANALYSIS</h3>

      <div className="risk-top">

        <div className="confidence-circle">

          <svg viewBox="0 0 120 120" width="120" height="120">

            <circle
              className="circle-bg"
              cx="60"
              cy="60"
              r="48"
            />

            <circle
              className="circle-progress"
              cx="60"
              cy="60"
              r="48"
            />

          </svg>

          <div className="confidence-content">
            <h2>96%</h2>
            <span>Confidence</span>
          </div>

        </div>

        <div className="risk-info">

          <div className="risk-header">

            <FaExclamationTriangle />

            <div>

              <h2>HIGH RISK</h2>

              <p>Possible Stampede</p>

            </div>

          </div>

          <div className="risk-row">
            <span>People Detected</span>
            <strong>1,247</strong>
          </div>

          <div className="risk-row">
            <span>Crowd Density</span>
            <strong>High</strong>
          </div>

          <div className="risk-row">
            <span>Movement</span>
            <strong>Congested</strong>
          </div>

          <div className="risk-row">
            <span>Prediction</span>
            <strong>Possible Stampede</strong>
          </div>

        </div>

      </div>

      <div className="recommendation-card">

        <div className="recommendation-title">

          <FaShieldAlt />

          Recommendation

        </div>

        <p>
          Deploy security personnel immediately and redirect
          crowd flow to alternate exits.
        </p>

      </div>

      <div className="quick-actions">

        <h4>QUICK ACTIONS</h4>

        <div className="actions">

          <button>
            <FaBell />
            <span>Send Alert</span>
          </button>

          <button>
            <FaVolumeUp />
            <span>Siren</span>
          </button>

          <button>
            <FaBullhorn />
            <span>Broadcast</span>
          </button>

          <button>
            <FaMapMarkedAlt />
            <span>View Map</span>
          </button>

        </div>

      </div>

    </div>
  );
}

export default RiskAnalysis;