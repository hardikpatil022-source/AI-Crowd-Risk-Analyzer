import {
  FaUsers,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";


function LiveStats({
  camera,
  analysis,
  analyzing,
}) {

  const peopleCount =
    analysis?.people_count;


  const density =
    analysis?.crowd_density;


  const risk =
    analysis?.risk_level;


  const capacity =
    Number(camera?.capacity) || 500;


  const capacityPercentage =
    peopleCount !== undefined
      ? Math.min(
          (peopleCount / capacity) * 100,
          100
        )
      : 0;


  return (

    <section className="stats-panel">


      <div className="monitoring-panel-header">

        <div>

          <span className="panel-label">
            LIVE ANALYTICS
          </span>

          <h2>
            Live Stats
          </h2>

        </div>

      </div>


      <div className="stats-camera-name">

        {camera?.id || "CAM-01"}

        {" • "}

        {camera?.location || "Zone not set"}

      </div>


      {/* PEOPLE COUNT */}

      <div className="stat-card">

        <div className="stat-icon people">
          <FaUsers />
        </div>


        <div>

          <span>
            PEOPLE COUNT
          </span>


          <strong>

            {analyzing
              ? "..."
              : peopleCount ?? "--"}

          </strong>

        </div>

      </div>


      {/* CROWD DENSITY */}

      <div className="stat-card">

        <div className="stat-icon density">
          <FaChartLine />
        </div>


        <div>

          <span>
            CROWD DENSITY
          </span>


          <strong>

            {analyzing
              ? "..."
              : density !== undefined
                ? `${density}%`
                : "--"}

          </strong>

        </div>

      </div>


      {/* RISK LEVEL */}

      <div className="stat-card">

        <div className="stat-icon risk">
          <FaShieldAlt />
        </div>


        <div>

          <span>
            RISK LEVEL
          </span>


          <strong>

            {analyzing
              ? "ANALYZING"
              : risk ?? "--"}

          </strong>

        </div>

      </div>


      {/* CAPACITY */}

      <div className="capacity-info">


        <div>

          <span>
            Camera Capacity
          </span>


          <strong>
            {capacity}
          </strong>

        </div>


        <div className="capacity-bar">

          <div
            className="capacity-fill"
            style={{
              width:
                `${capacityPercentage}%`,
            }}
          />

        </div>


      </div>


    </section>

  );

}


export default LiveStats;