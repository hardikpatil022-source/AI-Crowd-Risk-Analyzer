import {
    FaCloudUploadAlt,
    FaVideo
} from "react-icons/fa";

import "../../styles/upload-section.css";

function UploadSection({

    selectedVideo,

    setSelectedVideo

}) {

    const handleVideo = (e) => {

        const file = e.target.files[0];

        if(file){

            setSelectedVideo(file);

        }

    };

    return(

        <div className="camera-card upload-card">

            <h2>

                Upload Video

            </h2>

            <p>

                Select CCTV footage to start monitoring.

            </p>

            <div className="upload-box">

                <FaCloudUploadAlt className="upload-icon"/>

                <h3>

                    Drag & Drop Video

                </h3>

                <span>

                    or

                </span>

                <label htmlFor="video-upload" className="browse-btn">
    Browse Video
</label>

<input
    id="video-upload"
    type="file"
    accept="video/*"
    onChange={handleVideo}
    style={{ display: "none" }}
/>

                <small>

                    MP4 • AVI • MOV

                </small>

            </div>

            <div className="selected-file">

                <FaVideo/>

                <span>

                    {

                        selectedVideo

                        ?

                        selectedVideo.name

                        :

                        "No video selected"

                    }

                </span>

            </div>

        </div>

    );

}

export default UploadSection;