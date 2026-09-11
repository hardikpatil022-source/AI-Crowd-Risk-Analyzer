import {
    FaCamera,
    FaCircle
} from "react-icons/fa";

import "../../styles/video-preview.css";

function VideoPreview({

    selectedVideo

}) {

    return(

        <div className="camera-card preview-card">

            <div className="preview-header">

                <div className="preview-title">

                    <FaCamera/>

                    Camera Preview

                </div>

                <div className="camera-status">

                    <FaCircle className="live-dot"/>

                    {

                        selectedVideo

                        ?

                        "Ready"

                        :

                        "Waiting"

                    }

                </div>

            </div>

            <div className="video-container">

                {

                    selectedVideo

                    ?

                    <video

                        controls

                        autoPlay

                        width="100%"

                        height="100%"

                        src={URL.createObjectURL(selectedVideo)}

                    />

                    :

                    <div className="video-placeholder">

                        No Video Selected

                    </div>

                }

            </div>

        </div>

    );

}

export default VideoPreview;