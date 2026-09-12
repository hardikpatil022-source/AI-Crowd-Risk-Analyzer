import { useEffect, useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";

import {
    FaUsers,
    FaChartLine,
    FaExclamationTriangle,
    FaDatabase,
    FaVideo,
} from "react-icons/fa";

import "../styles/dashboard.css";

const BACKEND_URL =
    "http://127.0.0.1:8000";


const RISK_ORDER = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];


const RISK_COLORS = {
    LOW: "#22c55e",
    MEDIUM: "#eab308",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
};


/* ============================================================
   CAMERA LABEL
============================================================ */

const getCameraLabel = (
    camera
) => {

    if (!camera) {
        return "Unknown Camera";
    }

    return (
        camera.name ||
        camera.id ||
        "Unknown Camera"
    );

};


/* ============================================================
   ANALYTICS
============================================================ */

function Analytics() {

    const [summary, setSummary] =
        useState(null);

    const [cameras, setCameras] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
     * Empty string = ALL CAMERAS
     */
    const [
        selectedCameraId,
        setSelectedCameraId
    ] = useState("");


    /* ==========================================================
       LOAD CURRENT CAMERAS
    ========================================================== */

    useEffect(() => {

        let cancelled = false;


        const loadData =
            async () => {

                setLoading(true);
                setError(null);


                try {

                    /* ------------------------------------------------
                       GET CURRENT SIX SLOTS FROM LOCAL STORAGE
                    ------------------------------------------------ */

                    const saved =
                        localStorage.getItem(
                            "cameras"
                        );


                    let currentCameras =
                        [];


                    if (saved) {

                        const parsed =
                            JSON.parse(
                                saved
                            );


                        if (
                            Array.isArray(
                                parsed
                            )
                        ) {

                            currentCameras =
                                parsed
                                    .filter(
                                        (camera) =>
                                            camera.cameraId !==
                                            null &&
                                            camera.cameraId !==
                                            undefined
                                    )
                                    .map(
                                        (camera) => ({

                                            /*
                                             * Fixed UI identity
                                             */
                                            id:
                                                camera.cameraId,

                                            name:
                                                camera.id ||
                                                camera.name,

                                            cameraId:
                                                camera.cameraId,

                                            location:
                                                camera.location,

                                            capacity:
                                                camera.capacity,

                                            filename:
                                                camera.filename

                                        })
                                    );

                        }

                    }


                    /*
                     * Sort CAM-01 → CAM-06
                     */

                    currentCameras.sort(
                        (a, b) =>
                            Number(
                                a.name.replace(
                                    "CAM-",
                                    ""
                                )
                            ) -
                            Number(
                                b.name.replace(
                                    "CAM-",
                                    ""
                                )
                            )
                    );


                    /* ------------------------------------------------
                       BUILD ANALYTICS REQUEST
                    ------------------------------------------------ */

                    const params =
                        new URLSearchParams();


                    /*
                     * Specific camera selected
                     */
                    if (
                        selectedCameraId !== ""
                    ) {

                        params.set(
                            "camera_id",
                            selectedCameraId
                        );

                    }


                    const summaryUrl =
                        `${BACKEND_URL}/analytics/summary` +
                        (
                            params.toString()
                                ? `?${params.toString()}`
                                : ""
                        );


                    const summaryResponse =
                        await fetch(
                            summaryUrl
                        );


                    if (
                        !summaryResponse.ok
                    ) {

                        throw new Error(
                            "Failed to load analytics"
                        );

                    }


                    const summaryData =
                        await summaryResponse.json();


                    if (!cancelled) {

                        setCameras(
                            currentCameras
                        );

                        setSummary(
                            summaryData
                        );

                    }

                } catch (err) {

                    console.error(
                        "Analytics error:",
                        err
                    );


                    if (!cancelled) {

                        setError(
                            "Could not load analytics. Make sure the backend is running."
                        );

                    }

                } finally {

                    if (!cancelled) {

                        setLoading(
                            false
                        );

                    }

                }

            };


        loadData();


        return () => {

            cancelled = true;

        };

    }, [selectedCameraId]);


    /* ==========================================================
       SELECTED CAMERA
    ========================================================== */

    const selectedCamera =
        selectedCameraId === ""
            ? null
            : cameras.find(
                (camera) =>
                    String(
                        camera.id
                    ) ===
                    String(
                        selectedCameraId
                    )
            );


    /* ==========================================================
       MAX BREAKDOWN
    ========================================================== */

    const maxBreakdownCount =
        summary &&
        summary.total_analyses > 0

            ? Math.max(
                ...RISK_ORDER.map(
                    (risk) =>
                        summary
                            .risk_level_breakdown?.[
                                risk
                            ] || 0
                ),
                1
            )

            : 1;


    /* ==========================================================
       RENDER
    ========================================================== */

    return (

        <div className="dashboard">

            <Header />


            <div className="dashboard-body">

                <Sidebar />


                <main className="dashboard-content">

                    {/* =================================================
                       HEADER
                    ================================================= */}

                    <section className="section-heading">

                        <div>

                            <span className="section-label">
                                ANALYTICS
                            </span>

                            <h2>
                                Crowd Intelligence Overview
                            </h2>

                        </div>


                        <p>
                            Analytics for your configured CCTV cameras and saved YOLO analysis runs.
                        </p>

                    </section>


                    {/* =================================================
                       CAMERA FILTER
                    ================================================= */}

                    {cameras.length > 0 && (

                        <div
                            className="analytics-camera-filter"
                            style={{
                                marginBottom:
                                    "28px"
                            }}
                        >

                            <div className="analytics-camera-label">

                                <FaVideo />

                                <span>
                                    Camera
                                </span>

                            </div>


                            <select
                                value={
                                    selectedCameraId
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedCameraId(
                                        event.target.value
                                    )
                                }
                                className="analytics-camera-select"
                            >

                                <option value="">
                                    All Cameras
                                </option>


                                {cameras.map(
                                    (camera) => (

                                        <option
                                            key={
                                                camera.cameraId
                                            }
                                            value={
                                                camera.cameraId
                                            }
                                        >
                                            {getCameraLabel(
                                                camera
                                            )}
                                        </option>

                                    )
                                )}

                            </select>


                            <span className="analytics-selected-camera">

                                Showing{" "}

                                <strong>

                                    {selectedCamera
                                        ? getCameraLabel(
                                            selectedCamera
                                        )
                                        : "All Cameras"}

                                </strong>

                            </span>

                        </div>

                    )}


                    {/* =================================================
                       LOADING
                    ================================================= */}

                    {loading && (

                        <div className="analytics-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading analytics...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                       ERROR
                    ================================================= */}

                    {error && (

                        <div className="analytics-error">

                            <FaExclamationTriangle />

                            <div>

                                <strong>
                                    Analytics unavailable
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                       NO DATA
                    ================================================= */}

                    {!loading &&
                        !error &&
                        summary &&
                        summary.total_analyses === 0 && (

                            <div className="analytics-empty">

                                <div className="analytics-empty-icon">
                                    <FaDatabase />
                                </div>


                                <h3>
                                    No Analysis Data
                                </h3>


                                <p>

                                    {selectedCamera

                                        ? `No analysis data is available for ${getCameraLabel(
                                            selectedCamera
                                        )}.`

                                        : "Run a video through Monitoring to generate crowd analytics."}

                                </p>

                            </div>

                        )}


                    {/* =================================================
                       ANALYTICS DATA
                    ================================================= */}

                    {!loading &&
                        !error &&
                        summary &&
                        summary.total_analyses > 0 && (

                            <>

                                {/* =================================================
                                   KPI CARDS
                                ================================================= */}

                                <div className="dashboard-kpis">

                                    <div className="kpi-card">

                                        <div className="kpi-icon blue">
                                            <FaDatabase />
                                        </div>


                                        <div className="kpi-content">

                                            <span>
                                                Total Analyses
                                            </span>

                                            <h2>
                                                {
                                                    summary.total_analyses
                                                }
                                            </h2>

                                            <p>

                                                {selectedCamera
                                                    ? `For ${getCameraLabel(
                                                        selectedCamera
                                                    )}`
                                                    : "Across all cameras"}

                                            </p>

                                        </div>

                                    </div>


                                    {/* PEAK PEOPLE */}

                                    <div className="kpi-card">

                                        <div className="kpi-icon purple">
                                            <FaUsers />
                                        </div>


                                        <div className="kpi-content">

                                            <span>
                                                Peak People Count
                                            </span>

                                            <h2>
                                                {
                                                    summary.peak_people_count
                                                }
                                            </h2>

                                            <p>
                                                Busiest single frame
                                            </p>

                                        </div>

                                    </div>


                                    {/* DENSITY */}

                                    <div className="kpi-card">

                                        <div className="kpi-icon green">
                                            <FaChartLine />
                                        </div>


                                        <div className="kpi-content">

                                            <span>
                                                Average Crowd Density
                                            </span>

                                            <h2>

                                                {Number(
                                                    summary.average_crowd_density ||
                                                    0
                                                ).toFixed(1)}

                                                %

                                            </h2>


                                            <p>

                                                {selectedCamera
                                                    ? `For ${getCameraLabel(
                                                        selectedCamera
                                                    )}`
                                                    : "Across all cameras"}

                                            </p>

                                        </div>

                                    </div>


                                    {/* RISK */}

                                    <div className="kpi-card">

                                        <div className="kpi-icon red">
                                            <FaExclamationTriangle />
                                        </div>


                                        <div className="kpi-content">

                                            <span>
                                                Latest Risk Level
                                            </span>


                                            <h2
                                                style={{
                                                    color:
                                                        RISK_COLORS[
                                                            summary.latest_risk_level
                                                        ] ||
                                                        "inherit"
                                                }}
                                            >

                                                {
                                                    summary.latest_risk_level ||
                                                    "N/A"
                                                }

                                            </h2>


                                            <p>
                                                Most recent analysis
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                   RISK BREAKDOWN
                                ================================================= */}

                                <div
                                    className="analytics-heading"
                                    style={{
                                        marginTop:
                                            "32px"
                                    }}
                                >

                                    <div>

                                        <span className="section-label">
                                            BREAKDOWN
                                        </span>

                                        <h3>
                                            Risk Level Distribution
                                        </h3>

                                    </div>

                                </div>


                                <div
                                    className="analytics-card"
                                    style={{
                                        padding:
                                            "24px",
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        gap:
                                            "18px"
                                    }}
                                >

                                    {RISK_ORDER.map(
                                        (risk) => {

                                            const count =
                                                summary
                                                    .risk_level_breakdown?.[
                                                        risk
                                                    ] || 0;


                                            const widthPercent =
                                                (
                                                    count /
                                                    maxBreakdownCount
                                                ) *
                                                100;


                                            return (

                                                <div
                                                    key={
                                                        risk
                                                    }
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "12px"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            width:
                                                                "90px",
                                                            fontWeight:
                                                                600,
                                                            color:
                                                                RISK_COLORS[
                                                                    risk
                                                                ]
                                                        }}
                                                    >
                                                        {risk}
                                                    </span>


                                                    <div
                                                        style={{
                                                            flex:
                                                                1,
                                                            background:
                                                                "rgba(148, 163, 184, 0.15)",
                                                            borderRadius:
                                                                "8px",
                                                            height:
                                                                "18px",
                                                            overflow:
                                                                "hidden"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                width:
                                                                    `${widthPercent}%`,
                                                                background:
                                                                    RISK_COLORS[
                                                                        risk
                                                                    ],
                                                                height:
                                                                    "100%",
                                                                transition:
                                                                    "width 0.3s ease"
                                                            }}
                                                        />

                                                    </div>


                                                    <span
                                                        style={{
                                                            width:
                                                                "40px",
                                                            textAlign:
                                                                "right",
                                                            fontWeight:
                                                                600
                                                        }}
                                                    >
                                                        {count}
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>


                                {/* =================================================
                                   CAMERA INFORMATION
                                ================================================= */}

                                <div
                                    className="analytics-camera-summary"
                                    style={{
                                        marginTop:
                                            "24px"
                                    }}
                                >

                                    <div>

                                        <span>
                                            Cameras Registered
                                        </span>

                                        <strong>
                                            {
                                                cameras.length
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Current View
                                        </span>

                                        <strong>

                                            {selectedCamera
                                                ? getCameraLabel(
                                                    selectedCamera
                                                )
                                                : "All Cameras"}

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Current Risk
                                        </span>

                                        <strong
                                            style={{
                                                color:
                                                    RISK_COLORS[
                                                        summary.latest_risk_level
                                                    ] ||
                                                    "inherit"
                                            }}
                                        >
                                            {
                                                summary.latest_risk_level ||
                                                "N/A"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </>

                        )}

                </main>

            </div>

        </div>

    );

}


export default Analytics;