let informIcon = document.querySelector(".informIcon");
let popUp = document.querySelector(".inform-quote");
let element = ".tooltiptext";

informIcon.addEventListener("mouseenter", showPopup);
informIcon.addEventListener("mouseout", hidPopup);

function showPopup(e) {
  // TODO: Correct on 2nd visit: clearInterval(intervalID);
  let t = document.querySelector(element);
  t.style.display = "block";
  t.style.opacity = 1;
  popUp.classList.add("show-inform-quote");
}
function hidPopup(e) {
  setTimeout(setInterval, 2000, hide, 50, element);
}
