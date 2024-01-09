import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";

const videoConstraints = {
  width: 220,
  facingMode: "environment",
};

const Camera = (props) => {
  const webcamRef = useRef(null);
  const [url, setUrl] = React.useState(null);

  const capturePhoto = React.useCallback(() => {
    console.log("url", url);
    const imageSrc = webcamRef?.current?.getScreenshot();
    console.log((typeof imageSrc, "type"));
    setUrl(imageSrc);
    props?.imageCallback(imageSrc);
    // downloadImage(imageSrc)
  }, [webcamRef]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  const downloadImage = (imageSrc) => {
    saveAs(imageSrc, "image.jpg"); // Put your image url here.
  };
  return (
    <>
      <div>
        <div>
          {url ? (
            <div>
              <img src={url} alt="sreenshot"></img>
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              onUserMedia={onUserMedia}
              mirrored={true}
            ></Webcam>
          )}
        </div>
        <div>
          <button onClick={capturePhoto} type="button">
            Capture
          </button>
          <button
            type="button"
            onClick={() => {
              setUrl(null);
              props.refreshCamera();
            }}
          >
            Re-Capture
          </button>
          <button type="button" onClick={() => props.closeCamera(false)}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Camera;
