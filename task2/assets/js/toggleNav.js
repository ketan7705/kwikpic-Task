let hamburger = document.querySelector(".hamburger");
let navBar = document.querySelector("nav");
var links = document.querySelectorAll("nav a");
let header = document.querySelector("header");
let logo = document.querySelector(".logo");
// var initialPadding = parseInt(header.style.paddingTop.split("px")[0]);
// var initialSize = 0;

links.forEach((link) => link.addEventListener("click", toggleShowNav));
hamburger.addEventListener("click", toggleShowNav);

var opacity = 0;
// TODO: should be a map for multiple intervals
var intervalID = 0;

window.addEventListener("load", function () {
  // TODO: Forcing absolute popup location. improve this
  let photographButton = document.getElementById("correct-from-this");
  if (photographButton != null) {
    photographButton = photographButton.getBoundingClientRect();
    let d = document.getElementById("force-correction");
    d.style.position = "absolute";
    d.style.left = photographButton.x + "px";
    d.style.top = photographButton.y + 50 + "px";
  }

  setTimeout(hideElement, 5000, hide, 50, ".hide-after-5s");
  //   //   initialSize = logo.clientHeight;
  //   window.addEventListener("scroll", scrolling, false);
});

function hideElement(fn, time, element) {
  intervalID = setInterval(hide, 50, ".hide-after-5s");
}

function hide(element) {
  let t = document.querySelector(element);
  if (t == null) {
    clearInterval(intervalID);
    return;
  }
  opacity = Number(window.getComputedStyle(t).getPropertyValue("opacity"));
  if (opacity > 0) {
    opacity = opacity - 0.05;
    t.style.opacity = opacity;
  } else {
    clearInterval(intervalID);
    t.style.display = "none";
  }
}

function toggleShowNav() {
  navBar.classList.toggle("show-nav");
  if (window.innerWidth < 1024) {
    document.body.classList.toggle("non-scroll");
  }
}

// function scrolling() {
//   if (window.scrollY > 0) {
//     if (window.innerWidth > 1024) {
//       // Handle scroll for desktops
//       // 20 is the initial padding
//       //   TODO: Sometimes produces false positives, slight disturbance. fix this
//       header.style.paddingBottom = header.style.paddingTop =
//         Math.floor(Math.max(0, 20 - this.scrollY)) + "px";
//       //   logo.style.width = logo.style.height =
//       //     Math.max(50, initialSize - 2 * this.scrollY) + "px";
//       //   console.log(logo.clientHeight - 2 * this.scrollY, this.scrollY);

//       //   console.log(header.style.paddingTop);
//       //   header.classList.add("shrink");
//     }
//   } else {
//     // header.classList.remove("shrink");
//   }
// }
