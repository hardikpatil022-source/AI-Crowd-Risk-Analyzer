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


    /* =========================================================
       LOAD CURRENT SIX CAMERA SLOTS
    ========================================================= */

    useEffect(() => {

        try {

            const saved =
                localStorage.getItem(
                    "cameras"
                );

            if (!saved) {
                return;
            }

            const savedCameras =
                JSON.parse(saved);

            if (
                !Array.isArray(
                    savedCameras
                )
            ) {
                return;
            }


            /*
             * IMPORTANT:
             *
             * id       = CAM-01
             * cameraId = backend database ID
             *
             * These are NOT the same thing.
             */

            const preparedCameras =
                savedCameras.map(
                    (camera) => {

                        const slotName =
                            camera.id ||
                            camera.name;

                        const backendId =
                            camera.cameraId ??
                            null;

                        const filename =
                            camera.filename ??
                            null;


                        return {

                            /*
                             * USER-FACING IDENTITY
                             */
                            id: slotName,

                            name: slotName,

                            /*
                             * INTERNAL BACKEND ID
                             */
                            cameraId:
                                backendId,

                            location:
                                camera.location ||
                                "Zone not set",

                            capacity:
                                Number(
                                    camera.capacity
                                ) || 500,

                            filename,

                            video:
                                filename
                                    ? `${BACKEND_URL}/uploads/${encodeURIComponent(
                                        filename
                                      )}`
                                    : null
                        };

                    }
                );


            /*
             * Always keep the six Add CCTV
             * slots in CAM-01 → CAM-06 order.
             */

            preparedCameras.sort(
                (a, b) =>
                    Number(
                        a.id.replace(
                            "CAM-",
                            ""
                        )
                    ) -
                    Number(
                        b.id.replace(
                            "CAM-",
                            ""
                        )
                    )
            );


            setCameras(
                preparedCameras
            );


            /*
             * Select first camera that has footage.
             */

            setActiveCamera(
                preparedCameras.find(
                    (camera) =>
                        camera.video
                ) ||
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


    /* =========================================================
       YOLO ANALYSIS
    ========================================================= */

    useEffect(() => {

        if (
            !activeCamera?.filename
        ) {

            setAnalysis(null);

            return;
        }


        const filename =
            activeCamera.filename;

        let cancelled = false;


        const analyzeCamera =
            async () => {

                try {

                    setAnalyzing(true);

                    setAnalysis(null);


                    const params =
                        new URLSearchParams();


                    /*
                     * Send INTERNAL database ID.
                     *
                     * Example:
                     *
                     * CAM-01
                     *    ↓
                     * cameraId = 1
                     *    ↓
                     * camera_id=1
                     */

                    if (
                        activeCamera.cameraId !==
                        null
                    ) {

                        params.set(
                            "camera_id",
                            activeCamera.cameraId
                        );

                    }


                    if (
                        activeCamera.capacity
                    ) {

                        params.set(
                            "camera_capacity",
                            activeCamera.capacity
                        );

                    }


                    const response =
                        await fetch(
                            `${BACKEND_URL}/analyze-video/${encodeURIComponent(
                                filename
                            )}?${params.toString()}`
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Unable to analyze camera"
                        );

                    }


                    const data =
                        await response.json();


                    if (!cancelled) {

                        setAnalysis(
                            data
                        );

                    }

                } catch (error) {

                    console.error(
                        "Camera analysis error:",
                        error
                    );


                    if (!cancelled) {

                        setAnalysis(
                            null
                        );

                    }

                } finally {

                    if (!cancelled) {

                        setAnalyzing(
                            false
                        );

                    }

                }

            };


        analyzeCamera();


        return () => {

            cancelled = true;

        };

    }, [activeCamera]);


    /* =========================================================
       CAMERA SELECT
    ========================================================= */

    const handleCameraSelect =
        (camera) => {

            setActiveCamera(
                camera
            );

        };


    /* =========================================================
       NO CAMERAS
    ========================================================= */

    if (
        cameras.length === 0
    ) {

        return (

            <div className="monitoring-layout">

                <div
                    style={{
                        padding:
                            "48px",
                        textAlign:
                            "center"
                    }}
                >

                    <h2>
                        No cameras configured yet
                    </h2>

                    <p>
                        Upload footage in Add CCTV to start monitoring.
                    </p>

                    <Link
                        to="/add-cctv"
                        className="save-btn"
                        style={{
                            display:
                                "inline-flex",
                            marginTop:
                                "16px"
                        }}
                    >
                        Go to Add CCTV →
                    </Link>

                </div>

            </div>

        );

    }


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="monitoring-layout">

            <div className="monitoring-top">

                <CameraList
                    cameras={cameras}
                    activeCamera={
                        activeCamera
                    }
                    onCameraSelect={
                        handleCameraSelect
                    }
                />


                <LiveVideo
                    camera={
                        activeCamera
                    }
                    analysis={
                        analysis
                    }
                    analyzing={
                        analyzing
                    }
                />


                <LiveStats
                    camera={
                        activeCamera
                    }
                    analysis={
                        analysis
                    }
                    analyzing={
                        analyzing
                    }
                />

            </div>


            <AlertPanel
                camera={
                    activeCamera
                }
                analysis={
                    analysis
                }
            />


            <BottomControls
                camera={
                    activeCamera
                }
            />

        </div>

    );

}


export default MonitoringLayout;