import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import api from "../services/api";

import "../styles/add-cctv.css";

/* =========================================================
   CAMERA ICON (shared)
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
   SINGLE CAMERA CARD
   - Memoized so typing in one card never re-renders the others
   - Creates its own video object URL ONCE per file, not per render
========================================================= */
const CameraCard = memo(function CameraCard({ camera, index, onUpdate }) {
    const [videoUrl, setVideoUrl] = useState(null);

    // Only create/revoke a blob URL when THIS camera's video file changes
    useEffect(() => {
        if (!camera.video) {
            setVideoUrl(null);
            return;
        }

        const url = URL.createObjectURL(camera.video);
        setVideoUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [camera.video]);

    const handleField = (key) => (e) => {
        onUpdate(index, key, e.target.value);
    };

    const handleFile = (e) => {
        if (e.target.files[0]) {
            onUpdate(index, "video", e.target.files[0]);
        }
    };

    return (
        <div className="camera-box">

            {/* DARK TOPBAR */}
            <div className="camera-topbar">

                <div className="camera-topbar-left">

                    <div className="camera-icon-badge">
                        <CameraIcon />
                    </div>

                    <div className="camera-heading">
                        <h2>{camera.id}</h2>
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
                    ></span>

                    <span>
                        {camera.video ? "Ready" : "Empty"}
                    </span>
                </div>

            </div>


            {/* CAMERA PREVIEW */}
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

                        <strong>No Footage</strong>

                        <span>Upload a video to preview</span>

                    </div>

                )}

            </div>


            {/* CAMERA INFORMATION */}
            <div className="camera-fields">

                <div className="input-group">
                    <label>CAMERA NAME</label>
                    <input
                        type="text"
                        placeholder="e.g. Main Stage"
                        value={camera.name}
                        onChange={handleField("name")}
                    />
                </div>

                <div className="input-group">
                    <label>LOCATION</label>
                    <input
                        type="text"
                        placeholder="e.g. North Zone"
                        value={camera.location}
                        onChange={handleField("location")}
                    />
                </div>

                <div className="input-group">
                    <label>CAPACITY</label>
                    <input
                        type="number"
                        placeholder="e.g. 500"
                        value={camera.capacity}
                        onChange={handleField("capacity")}
                    />
                </div>

            </div>


            {/* UPLOAD */}
            <label className="upload-btn">
                <span className="upload-icon">↑</span>
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


            {/* VIDEO NAME */}
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

    const [cameras, setCameras] = useState([
        { id: "CAM-01", name: "", location: "", capacity: "", video: null },
        { id: "CAM-02", name: "", location: "", capacity: "", video: null },
        { id: "CAM-03", name: "", location: "", capacity: "", video: null },
        { id: "CAM-04", name: "", location: "", capacity: "", video: null },
        { id: "CAM-05", name: "", location: "", capacity: "", video: null },
        { id: "CAM-06", name: "", location: "", capacity: "", video: null },
    ]);

    // Stable function reference (useCallback) + immutable update
    // so React.memo on CameraCard actually prevents unrelated re-renders
    const updateCamera = useCallback((index, key, value) => {
        setCameras((prev) =>
            prev.map((cam, i) =>
                i === index ? { ...cam, [key]: value } : cam
            )
        );
    }, []);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const saveCameras = async () => {
        setSaving(true);
        setSaveError(null);

        try {
            // For each configured camera (has a video file), actually
            // upload the video to the backend, then create a Camera
            // record so History/Analytics/Monitoring can all use it.
            const saved = await Promise.all(
                cameras.map(async (camera) => {

                    // Slot has no video yet -> leave it empty
                    if (!camera.video) {
                        return {
                            id: camera.id,
                            name: camera.name,
                            location: camera.location,
                            capacity: camera.capacity || 500,
                            cameraId: null,
                            filename: null,
                        };
                    }

                    // 1) Upload the actual video file
                    const formData = new FormData();
                    formData.append("file", camera.video);

                    const uploadRes = await api.post(
                        "/upload-video",
                        formData
                    );

                    const filename = uploadRes.data.filename;

                    // 2) Create a Camera record in the backend DB
                    const cameraRes = await api.post("/cameras", {
                        name: camera.name || camera.id,
                        location: camera.location || null,
                        capacity: Number(camera.capacity) || 500,
                        filename,
                    });

                    return {
                        id: camera.id,
                        name: camera.name,
                        location: camera.location,
                        capacity: Number(camera.capacity) || 500,
                        cameraId: cameraRes.data.id,
                        filename,
                    };
                })
            );

            localStorage.setItem("cameras", JSON.stringify(saved));
            navigate("/monitoring");

        } catch (error) {
            console.error("Failed to save cameras:", error);
            setSaveError(
                "Could not upload one or more videos. Make sure the backend is running, then try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard">

            <Header />

            <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">

                    <div className="add-cctv-page">

                        {/* PAGE HEADER */}
                        <div className="add-cctv-header">

                            <div>
                                <span className="section-label">
                                    CCTV MANAGEMENT
                                </span>

                                <h1>Add CCTV Cameras</h1>

                                <p className="page-subtitle">
                                    Configure up to 6 surveillance cameras before entering the Control Room.
                                </p>
                            </div>

                            <div className="camera-limit">
                                <span className="limit-dot"></span>
                                6 CAMERA SLOTS
                            </div>

                        </div>


                        {/* CAMERA ROW */}
                        <div className="camera-grid">

                            {cameras.map((camera, index) => (
                                <CameraCard
                                    key={camera.id}
                                    camera={camera}
                                    index={index}
                                    onUpdate={updateCamera}
                                />
                            ))}

                        </div>


                        {/* SAVE BUTTON */}
                        <div className="save-container">

                            <button
                                className="save-btn"
                                onClick={saveCameras}
                                disabled={saving}
                            >
                                <span>🛡</span>
                                {saving
                                    ? "UPLOADING..."
                                    : "SAVE & OPEN CONTROL ROOM"}
                                <span>→</span>
                            </button>

                            {saveError && (
                                <p className="save-error" style={{ color: "#e5484d", marginTop: "8px" }}>
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