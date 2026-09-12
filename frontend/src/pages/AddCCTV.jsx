import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import api from "../services/api";

import "../styles/add-cctv.css";


/* =========================================================
   CAMERA ICON
========================================================= */

function CameraIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
    );
}


/* =========================================================
   CAMERA CARD
========================================================= */

const CameraCard = memo(function CameraCard({
    camera,
    index,
    onUpdate
}) {

    const [videoUrl, setVideoUrl] =
        useState(null);


    /* -------------------------------------------------------
       CREATE VIDEO PREVIEW URL
    ------------------------------------------------------- */

    useEffect(() => {

        if (!camera.video) {

            setVideoUrl(null);

            return;
        }

        const url =
            URL.createObjectURL(
                camera.video
            );

        setVideoUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };

    }, [camera.video]);


    /* -------------------------------------------------------
       FIELD UPDATE
    ------------------------------------------------------- */

    const handleField = (key) => (e) => {

        onUpdate(
            index,
            key,
            e.target.value
        );

    };


    /* -------------------------------------------------------
       FILE UPDATE
    ------------------------------------------------------- */

    const handleFile = (e) => {

        if (e.target.files[0]) {

            onUpdate(
                index,
                "video",
                e.target.files[0]
            );

        }

    };


    return (

        <div className="camera-box">

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="camera-topbar">

                <div className="camera-topbar-left">

                    <div className="camera-icon-badge">
                        <CameraIcon />
                    </div>

                    <div className="camera-heading">

                        <h2>
                            {camera.id}
                        </h2>

                        <span className="camera-type">
                            CCTV CAMERA
                        </span>

                    </div>

                </div>


                <div className="camera-status-pill">

                    <span
                        className={
                            camera.video
                                ? "status-dot ready"
                                : "status-dot"
                        }
                    />

                    <span>
                        {camera.video
                            ? "Ready"
                            : "Empty"}
                    </span>

                </div>

            </div>


            {/* =================================================
                VIDEO PREVIEW
            ================================================= */}

            <div className="camera-preview">

                {videoUrl ? (

                    <video
                        src={videoUrl}
                        muted
                        controls
                    />

                ) : (

                    <div className="preview-placeholder">

                        <div className="preview-icon">
                            <CameraIcon />
                        </div>

                        <strong>
                            No Footage
                        </strong>

                        <span>
                            Upload a video to preview
                        </span>

                    </div>

                )}

            </div>


            {/* =================================================
                CAMERA INFORMATION
            ================================================= */}

            <div className="camera-fields">

                <div className="input-group">

                    <label>
                        CAMERA NAME
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Main Stage"
                        value={camera.name}
                        onChange={handleField("name")}
                    />

                </div>


                <div className="input-group">

                    <label>
                        LOCATION
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. North Zone"
                        value={camera.location}
                        onChange={handleField("location")}
                    />

                </div>


                <div className="input-group">

                    <label>
                        CAPACITY
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 500"
                        value={camera.capacity}
                        onChange={handleField("capacity")}
                    />

                </div>

            </div>


            {/* =================================================
                UPLOAD
            ================================================= */}

            <label className="upload-btn">

                <span className="upload-icon">
                    ↑
                </span>

                Upload CCTV Footage

                <input
                    hidden
                    type="file"
                    accept="video/*"
                    onChange={handleFile}
                />

            </label>


            <span className="upload-hint">
                MP4, MOV up to 200MB
            </span>


            {/* =================================================
                VIDEO NAME
            ================================================= */}

            {camera.video && (

                <div className="video-name">
                    🎥 {camera.video.name}
                </div>

            )}

        </div>

    );
});


/* =========================================================
   PAGE
========================================================= */

function AddCCTV() {

    const navigate = useNavigate();


    /* -------------------------------------------------------
       SIX FIXED CAMERA SLOTS
    ------------------------------------------------------- */

    const [cameras, setCameras] =
        useState([
            {
                id: "CAM-01",
                name: "CAM-01",
                location: "",
                capacity: "",
                video: null
            },
            {
                id: "CAM-02",
                name: "CAM-02",
                location: "",
                capacity: "",
                video: null
            },
            {
                id: "CAM-03",
                name: "CAM-03",
                location: "",
                capacity: "",
                video: null
            },
            {
                id: "CAM-04",
                name: "CAM-04",
                location: "",
                capacity: "",
                video: null
            },
            {
                id: "CAM-05",
                name: "CAM-05",
                location: "",
                capacity: "",
                video: null
            },
            {
                id: "CAM-06",
                name: "CAM-06",
                location: "",
                capacity: "",
                video: null
            }
        ]);


    /* -------------------------------------------------------
       UPDATE CAMERA
    ------------------------------------------------------- */

    const updateCamera = useCallback(
        (index, key, value) => {

            setCameras((prev) =>
                prev.map((cam, i) => {

                    if (i !== index) {
                        return cam;
                    }

                    /*
                     * Camera slot identity MUST NOT change.
                     *
                     * CAM-01 must always remain CAM-01.
                     */
                    if (key === "name") {

                        return {
                            ...cam,
                            name: value
                        };

                    }

                    return {
                        ...cam,
                        [key]: value
                    };

                })
            );

        },
        []
    );


    const [saving, setSaving] =
        useState(false);

    const [saveError, setSaveError] =
        useState(null);


    /* =========================================================
       SAVE CAMERAS
    ========================================================= */

    const saveCameras = async () => {

        setSaving(true);
        setSaveError(null);

        try {

            const saved =
                await Promise.all(

                    cameras.map(
                        async (camera) => {

                            /*
                             * No video uploaded.
                             *
                             * Keep the fixed slot but don't
                             * create/update a backend analysis
                             * camera.
                             */

                            if (!camera.video) {

                                return {
                                    id: camera.id,
                                    name: camera.id,
                                    location:
                                        camera.location,
                                    capacity:
                                        Number(
                                            camera.capacity
                                        ) || 500,
                                    cameraId: null,
                                    filename: null
                                };

                            }


                            /* =================================================
                               1. UPLOAD VIDEO
                            ================================================= */

                            const formData =
                                new FormData();

                            formData.append(
                                "file",
                                camera.video
                            );


                            const uploadRes =
                                await api.post(
                                    "/upload-video",
                                    formData
                                );


                            const filename =
                                uploadRes.data.filename;


                            /* =================================================
                               2. CREATE / UPDATE FIXED CAMERA SLOT
                            ================================================= */

                            const cameraRes =
                                await api.post(
                                    "/cameras",
                                    {
                                        /*
                                         * IMPORTANT:
                                         *
                                         * The slot identity is used,
                                         * NOT database ID.
                                         */
                                        name: camera.id,

                                        location:
                                            camera.location ||
                                            null,

                                        capacity:
                                            Number(
                                                camera.capacity
                                            ) || 500,

                                        filename
                                    }
                                );


                            /* =================================================
                               3. STORE BOTH IDENTITIES
                            ================================================= */

                            return {

                                /*
                                 * USER-FACING IDENTITY
                                 */
                                id: camera.id,

                                name: camera.id,

                                /*
                                 * BACKEND DATABASE ID
                                 */
                                cameraId:
                                    cameraRes.data.id,

                                location:
                                    cameraRes.data.location,

                                capacity:
                                    cameraRes.data.capacity,

                                filename:
                                    cameraRes.data.filename ||
                                    filename

                            };

                        }
                    )
                );


            /* =================================================
               SAVE CURRENT SIX SLOTS
            ================================================= */

            localStorage.setItem(
                "cameras",
                JSON.stringify(saved)
            );


            /* =================================================
               OPEN MONITORING
            ================================================= */

            navigate(
                "/monitoring"
            );

        } catch (error) {

            console.error(
                "Failed to save cameras:",
                error
            );

            setSaveError(
                "Could not upload one or more videos. Make sure the backend is running, then try again."
            );

        } finally {

            setSaving(false);

        }

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="dashboard">

            <Header />

            <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">

                    <div className="add-cctv-page">

                        {/* =================================================
                           HEADER
                        ================================================= */}

                        <div className="add-cctv-header">

                            <div>

                                <span className="section-label">
                                    CCTV MANAGEMENT
                                </span>

                                <h1>
                                    Add CCTV Cameras
                                </h1>

                                <p className="page-subtitle">
                                    Configure up to 6 surveillance cameras before entering the Control Room.
                                </p>

                            </div>


                            <div className="camera-limit">

                                <span className="limit-dot"></span>

                                6 CAMERA SLOTS

                            </div>

                        </div>


                        {/* =================================================
                           SIX CAMERA SLOTS
                        ================================================= */}

                        <div className="camera-grid">

                            {cameras.map(
                                (camera, index) => (

                                    <CameraCard
                                        key={camera.id}
                                        camera={camera}
                                        index={index}
                                        onUpdate={
                                            updateCamera
                                        }
                                    />

                                )
                            )}

                        </div>


                        {/* =================================================
                           SAVE
                        ================================================= */}

                        <div className="save-container">

                            <button
                                className="save-btn"
                                onClick={
                                    saveCameras
                                }
                                disabled={
                                    saving
                                }
                            >

                                <span>
                                    🛡
                                </span>

                                {saving
                                    ? "UPLOADING..."
                                    : "SAVE & OPEN CONTROL ROOM"}

                                <span>
                                    →
                                </span>

                            </button>


                            {saveError && (

                                <p
                                    className="save-error"
                                    style={{
                                        color:
                                            "#e5484d",
                                        marginTop:
                                            "8px"
                                    }}
                                >
                                    {saveError}
                                </p>

                            )}

                        </div>


                        <p className="save-footnote">
                            You can add or configure up to 6 CCTV cameras for monitoring.
                        </p>

                    </div>

                </main>

            </div>

        </div>

    );
}


export default AddCCTV;