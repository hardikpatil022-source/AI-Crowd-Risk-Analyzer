import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CameraList from "./CameraList";
import LiveVideo from "./LiveVideo";
import LiveStats from "./LiveStats";
import AlertPanel from "./AlertPanel";
import BottomControls from "./BottomControls";

import "../../styles/monitoring-layout.css";


const BACKEND_URL = "http://127.0.0.1:8000";


function MonitoringLayout() {

  const [cameras, setCameras] =
    useState([]);

  const [activeCamera, setActiveCamera] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [analyzing, setAnalyzing] =
    useState(false);


  /*
   * Load the cameras that were actually
   * uploaded via Add CCTV (saved by
   * AddCCTV.jsx to localStorage, each
   * with a real backend filename).
   */
  useEffect(() => {

    try {

      const saved =
        localStorage.getItem("cameras");

      if (!saved) return;

      const savedCameras =
        JSON.parse(saved);

      if (!Array.isArray(savedCameras)) return;

      const preparedCameras =
        savedCameras.map((camera) => ({
          id: camera.id,
          name: camera.name,
          location: camera.location,
          capacity: camera.capacity || 500,
          cameraId: camera.cameraId ?? null,
          filename: camera.filename ?? null,

          // Build a playable URL from whatever
          // the backend actually saved
          video: camera.filename
            ? `${BACKEND_URL}/uploads/${encodeURIComponent(camera.filename)}`
            : null,
        }));

      setCameras(preparedCameras);

      // Default to the first camera that actually has footage
      setActiveCamera(
        preparedCameras.find((camera) => camera.video) ||
        preparedCameras[0] ||
        null
      );

    } catch (error) {

      console.error(
        "Could not load cameras:",
        error
      );

    }

  }, []);


  /*
   * Analyze selected camera
   */
  useEffect(() => {

    // Need a real backend filename to analyze - cameras with no
    // uploaded footage (or not yet loaded) just show empty state.
    if (!activeCamera?.filename) {

      setAnalysis(null);

      return;

    }

    const filename = activeCamera.filename;


    let cancelled = false;


    const analyzeCamera = async () => {

      try {

        setAnalyzing(true);

        setAnalysis(null);


        const params = new URLSearchParams();

        if (activeCamera.cameraId) {
          params.set("camera_id", activeCamera.cameraId);
        }

        if (activeCamera.capacity) {
          params.set("camera_capacity", activeCamera.capacity);
        }

        const response = await fetch(
          `${BACKEND_URL}/analyze-video/${encodeURIComponent(filename)}?${params.toString()}`
        );


        if (!response.ok) {

          throw new Error(
            "Unable to analyze camera"
          );

        }


        const data =
          await response.json();


        if (!cancelled) {

          setAnalysis(data);

        }

      } catch (error) {

        console.error(
          "Camera analysis error:",
          error
        );


        if (!cancelled) {

          setAnalysis(null);

        }

      } finally {

        if (!cancelled) {

          setAnalyzing(false);

        }

      }

    };


    analyzeCamera();


    return () => {

      cancelled = true;

    };

  }, [activeCamera]);


  /*
   * Camera selection
   */
  const handleCameraSelect =
    (camera) => {

      setActiveCamera(camera);

    };


  if (cameras.length === 0) {

    return (

      <div className="monitoring-layout">

        <div style={{ padding: "48px", textAlign: "center" }}>

          <h2>No cameras configured yet</h2>

          <p>Upload footage in Add CCTV to start monitoring.</p>

          <Link to="/add-cctv" className="save-btn" style={{ display: "inline-flex", marginTop: "16px" }}>
            Go to Add CCTV →
          </Link>

        </div>

      </div>

    );

  }


  return (

    <div className="monitoring-layout">


      <div className="monitoring-top">


        <CameraList
          cameras={cameras}
          activeCamera={activeCamera}
          onCameraSelect={
            handleCameraSelect
          }
        />


        <LiveVideo
          camera={activeCamera}
          analysis={analysis}
          analyzing={analyzing}
        />


        <LiveStats
          camera={activeCamera}
          analysis={analysis}
          analyzing={analyzing}
        />


      </div>


      <AlertPanel
        camera={activeCamera}
        analysis={analysis}
      />


      <BottomControls
        camera={activeCamera}
      />


    </div>

  );

}


export default MonitoringLayout;