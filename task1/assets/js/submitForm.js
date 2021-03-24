const form = document.getElementById("my-form");
const name = form.elements["name"];
const email = form.elements["email"];
const phone = form.elements["phone"];
const img = document.querySelector("#camera img");
const video = document.querySelector("#camera video");
const canvas = document.querySelector("canvas");

const convertCanvasToBlob = (dataURI) => {
  // const dataURI = canvaseElement.toDataURL();
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0) {
    byteString = atob(dataURI.split(",")[1]);
  } else {
    byteString = unescape(dataURI.split(",")[1]);
  }
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeString });
};

const onSubmit = (e) => {
  document.getElementById("overlay").style.display = "block";
  e.preventDefault();
  const img = document.querySelector("#camera img");
  if (!img.src || img.src == window.location.href) {
    if (video != undefined) {
      canvasToImg(canvas, video, img);
    }
  }

  message.style.opacity = 1;
  let formData = new FormData(form);
  formData.append("image", convertCanvasToBlob(img.src));
  // console.log(...formData);
  // TODO: (Optimisation) Send API via static URL and not via webapp
  const url = "http://127.0.0.1:8000/api/image/";
  const options = {
    method: "POST",
    // mode: 'no-cors',
    credentials: "same-origin",
    body: formData,
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      // console.log('this is the response data', response);
      const message = document.querySelector("#message");
      const img = document.querySelector("#camera img");
      img.src = "";
      if (video != undefined) {
        video.style.visibility = "visible";
        video.style.position = "static";
      }
      img.style.display = "none";
      img.style.visibility = "hidden";
      img.style.position = "fixed";

      if (response["exception"] == false) {
        // Everything ok
        message.classList.remove("fail");
        message.classList.add("success");
        message.innerHTML = response["detail"];
        document.getElementById("overlay").style.display = "none";
        name.value = "";
        email.value = "";
        phone.value = "";
        console.log("Success!");
      } else if (response["exception"] == true) {
        message.classList.remove("success");
        message.classList.add("fail");
        message.innerHTML = response["detail"];
        document.getElementById("overlay").style.display = "none";
      }
      setTimeout(function () {
        message.style.opacity = 0;
      }, 8000);
      setTimeout(function () {
        message.innerHTML = "";
      }, 10000);
    })
    .catch((err) => {
      message.classList.remove("success");
      message.classList.add("fail");
      document.getElementById("overlay").style.display = "none";
      message.innerHTML = "Please refresh the page and try again.";
      console.error("fail", err);
    });
};

if (form.attachEvent) {
  form.attachEvent("submit", (ev) => onSubmit(ev));
} else {
  form.addEventListener("submit", (ev) => onSubmit(ev));
}
