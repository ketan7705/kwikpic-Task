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

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
  });

  // Click!
  screenshotButton.onclick = video.onclick = function () {
    img.style.display = "inline";
    img.style.visibility = "visible";
    img.style.position = "static";
    canvasToImg(canvas, video, img);
    // Don't ever set video display to none
    video.style.visibility = "hidden";
    video.style.position = "fixed";
  };

  function handleSuccess(stream) {
    video.srcObject = stream;
  }
} else {
  alert("getUserMedia() is not supported by your browser");
}
