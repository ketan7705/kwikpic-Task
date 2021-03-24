const kcp_form = document.getElementById("kcp-form");
const onSubmitKcpId = (ev) => {
  ev.preventDefault();
  const kcp_id = document.getElementById("certificate-number").value;
  const url = "http://127.0.0.1:8000/kcp/" + kcp_id;
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      if (response["detail"] == "Not found.") {
        window.location.href = "./certNotVerified.html";
      } else {
        document.getElementById("hiding1").style.display = "none";
        document.getElementById("name").append(response["name"]);
        document.getElementById("address").append(response["address"]);
        document
          .getElementById("joining_date")
          .append(response["joining_date"]);
        document.getElementById("valid_till").append(response["valid_till"]);
        document.getElementById("hiding2").style.display = "block";
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("server_down").style.display = "block";
    });
};

kcp_form.addEventListener("submit", (ev) => onSubmitKcpId(ev));
