function canvasToImg(canvas, video, img) {
  // Ratio of the video's intrisic dimensions
  let videoRatio = video.videoWidth / video.videoHeight;
  // The width and height of the video element
  let dispWidth = video.offsetWidth,
    dispHeight = video.offsetHeight;
  // The ratio of the element's width to its height
  let elementRatio = dispWidth / dispHeight;
  // If the video element is short and wide
  if (elementRatio > videoRatio) dispWidth = dispHeight * videoRatio;
  // It must be tall and thin, or exactly equal to the original ratio
  else dispHeight = dispWidth / videoRatio;

  // // Uncomment if rescaling not important
  // dispWidth = video.videoWidth;
  // dispHeight = video.videoHeight;

  // Setting image for sending to server
  img.width = canvas.width = dispWidth;
  img.height = canvas.height = dispHeight;

  let ctx = canvas.getContext("2d");
  ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Other browsers will fall back to image/png
  img.src = canvas.toDataURL("image/jpeg");
}

function hasGetUserMedia() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

if (hasGetUserMedia()) {
  const screenshotButton = document.querySelector("#click");
  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
    },
  };

  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
    })
    .then(makePredictions);

  // Click!
  screenshotButton.onclick = video.onclick = function () {
    img.style.display = "inline";
    img.style.visibility = "visible";
    img.style.position = "static";
    canvasToImg(canvas, video, img);
    // Don't ever set video display to none
    video.style.visibility = "hidden";
    video.style.position = "fixed";
    document.getElementById("canvas2").style.display = "none";
  };

  function handleSuccess(stream) {
    video.srcObject = stream;
  }
} else {
  alert("getUserMedia() is not supported by your browser");
}

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("./models");
}

function makePredictions() {
  // get the #canvas
  const overlayCanvas = document.getElementById("canvas2");
  // resize the canvas to the #video dimensions
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(overlayCanvas, displaySize);

  /* get "detections" for every 300 milliseconds */
  setInterval(async function () {
    // if user clicked pic, stop making predictions
    if (video.style.visibility !== "hidden") {
      /* this "detections" array has all the things like the "prediction results" as well as the 
		 "bounding box" configurations */

      // below threshold of 0.7, we prompt no face detected
      const options = new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: 0.7,
      });
      const useTinyModel = true;
      const detections = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks(useTinyModel);
      // console.log(detections);
      var ctx = overlayCanvas.getContext("2d");
      ctx.font = "50px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      if (detections.length > 1) {
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        ctx.fillText("More than one person!", 350, 50);
      } else if (detections.length == 0) {
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        var img = document.getElementById("default-face-overlay");
        // console.log(img.width, img.height);
        ctx.drawImage(img, 0, 0, overlayCanvas.width, overlayCanvas.height);
      } else {
        /* resize the detected boxes to match our video dimensions */
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        // before start drawing, clear the canvas
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        // use faceapi.draw to draw "detections"
        faceapi.draw.drawDetections(overlayCanvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(overlayCanvas, resizedDetections);
      }
    }
  }, 300);
}

loadModels();
