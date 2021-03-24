const allowedUpload = 0.6; //in MBs
const max_dimension = 1024;

function preview_image(event) {
  var new_img = new Image();
  new_img.onload = function (e) {
    let ctx = canvas.getContext("2d");
    console.log("original dimensions", new_img.width, new_img.height);

    canvas.width = new_img.width;
    canvas.height = new_img.height;

    ctx.drawImage(new_img, 0, 0, new_img.width, new_img.height);
    img.src = canvas.toDataURL("image/jpeg");

    let upload_size = img.src.length / 1024 / 1024;
    console.log("upload size", upload_size);

    if (upload_size > allowedUpload) {
      // Compress image so that size is less than allowed upload size
      let resizeRatio = Math.sqrt(allowedUpload / upload_size);
      new_width = new_img.width * resizeRatio;
      new_height = new_img.height * resizeRatio;
      if (new_width > max_dimension) {
        new_width = max_dimension;
        new_height = (new_height / new_width) * max_dimension;
      }
      if (new_height > max_dimension) {
        new_height = max_dimension;
        new_width = (new_width / new_height) * max_dimension;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      console.log("resize ratio", resizeRatio);

      canvas.width = new_width;
      canvas.height = new_height;

      ctx.drawImage(
        new_img,
        0,
        0,
        new_img.width,
        new_img.height,
        0,
        0,
        new_img.width * resizeRatio,
        new_img.height * resizeRatio
      );
      img.src = canvas.toDataURL("image/jpeg");

      console.log("new size", img.src.length / 1024 / 1024);
    }
  };

  new_img.src = URL.createObjectURL(event.target.files[0]);
  // canvas.style.display = "block";
  img.style.display = "inline";
  img.style.visibility = "visible";
  img.style.position = "static";
}
