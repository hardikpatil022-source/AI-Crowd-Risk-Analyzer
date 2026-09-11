import { useState } from "react";
import api from "../../services/api";


function StartMonitoring({ selectedVideo }) {

  const [loading, setLoading] = useState(false);

  const startMonitoring = async () => {

    if (!selectedVideo) {
      alert("Please select a video first.");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", selectedVideo);

      const response = await api.post(
        "/upload-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ " + response.data.filename + " uploaded successfully!");

    } catch (error) {

      console.error(error);

      alert("Upload failed!");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="camera-card">

      <button
        className="start-btn"
        onClick={startMonitoring}
        disabled={loading}
      >

        {
          loading
            ? "Uploading..."
            : "Start Monitoring"
        }

      </button>

    </div>

  );

}

export default StartMonitoring;