import { useEffect, useState } from "react";

import CameraList from "./CameraList";
import LiveVideo from "./LiveVideo";
import LiveStats from "./LiveStats";
import AlertPanel from "./AlertPanel";
import BottomControls from "./BottomControls";

import "../../styles/monitoring-layout.css";


const defaultCameras = [

  {
    id: "CAM-01",
    name: "Main Stage • Wide",
    location: "North Zone",
    capacity: "500",
    video: "/cctv/CAM-01_Main_Stage_Wide.mp4",
  },

  {
    id: "CAM-02",
    name: "Left Crowd",
    location: "West Zone",
    capacity: "500",
    video: "/cctv/CAM-02_Left_Crowd.mp4",
  },

  {
    id: "CAM-03",
    name: "Center Crowd",
    location: "Central Zone",
    capacity: "500",
    video: "/cctv/CAM-03_Center_Crowd.mp4",
  },

  {
    id: "CAM-04",
    name: "Right Crowd",
    location: "East Zone",
    capacity: "500",
    video: "/cctv/CAM-04_Right_Crowd.mp4",
  },

  {
    id: "CAM-05",
    name: "Front Dense Area",
    location: "South Zone",
    capacity: "500",
    video: "/cctv/CAM-05_Front_Dense_Area.mp4",
  },

  {
    id: "CAM-06",
    name: "Rear Crowd • Wide",
    location: "Rear Zone",
    capacity: "500",
    video: "/cctv/CAM-06_Rear_Crowd_Wide.mp4",
  },

];


function MonitoringLayout() {

  const [cameras, setCameras] =
    useState(defaultCameras);

  const [activeCamera, setActiveCamera] =
    useState(defaultCameras[0]);

  const [analysis, setAnalysis] =
    useState(null);

  const [analyzing, setAnalyzing] =
    useState(false);


  /*
   * Load saved camera information
   */
  useEffect(() => {

    try {

      const saved =
        localStorage.getItem("cameras");

      if (saved) {

        const savedCameras =
          JSON.parse(saved);

        if (Array.isArray(savedCameras)) {

          const mergedCameras =
            defaultCameras.map(
              (defaultCamera) => {

                const savedCamera =
                  savedCameras.find(
                    (camera) =>
                      camera.id ===
                      defaultCamera.id
                  );

                return {
                  ...defaultCamera,
                  ...(savedCamera || {}),

                  // Always use our CCTV
                  // video files
                  video:
                    defaultCamera.video,
                };

              }
            );

          setCameras(mergedCameras);

          setActiveCamera(
            mergedCameras[0]
          );

        }

      }

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

    if (!activeCamera?.video) {

      setAnalysis(null);

      return;

    }

    const filename =
      activeCamera.video
        .split("/")
        .pop();

    if (!filename) {

      setAnalysis(null);

      return;

    }


    let cancelled = false;


    const analyzeCamera = async () => {

      try {

        setAnalyzing(true);

        setAnalysis(null);


        const response = await fetch(
          `http://127.0.0.1:8000/analyze-video/${encodeURIComponent(filename)}`
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