let photographButton = document.querySelector(".photograph-button");
let popUp = document.querySelector(".tooltip");
let sliders = document.querySelector(".sliders");
let buttons = document.querySelectorAll(".ellipse");
let counter = 0;
let slider = document.querySelector(".sliders-container");
var strX;

window.addEventListener("load", hidPopupAfterTime);

photographButton.addEventListener("mouseenter", showPopup);
photographButton.addEventListener("mouseout", hidPopup);

slider.addEventListener("touchstart", swipestart);
slider.addEventListener(
  "touchmove",
  debounce((e) => {
    swipemove(e);
  }, 100)
);

buttons[0].classList.add("show-fill-ellipse");

buttons.forEach((itm, i) => {
  itm.addEventListener("click", () => {
    counter = i;
    moveSliders();
    removeFillEliips();
    addFillEllipse();
  });
});

function swipestart(e) {
  strX = e.touches[0].clientX;
}

function debounce(fun, delay) {
  let time;
  return function (...par) {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      fun(...par);
    }, delay);
  };
}

function swipemove(e) {
  var touch = e.touches[0];
  var change = strX - touch.clientX;
  console.log(change);
  if (change > 40) {
    if (counter >= 2) {
      return;
    }
    counter++;
    moveSliders();
    removeFillEliips();
    addFillEllipse();
  } else if (change < -40) {
    if (counter <= 0) {
      return;
    }
    counter--;
    moveSliders();
    removeFillEliips();
    addFillEllipse();
  }
}

function hidPopupAfterTime() {
  setTimeout(() => {
    popUp.classList.remove("show-after-load");
  }, 15000);
}
function showPopup(e) {
  setTimeout(() => {
    popUp.classList.add("show");
  }, 500);
}
function hidPopup(e) {
  popUp.classList.remove("show");
}
function moveSliders() {
  let moveDistance = sliders.children[0].clientWidth;
  sliders.style.transform = `translateX(${-moveDistance * counter}px)`;
}
function removeFillEliips() {
  buttons.forEach((itm) => itm.classList.remove("show-fill-ellipse"));
}
function addFillEllipse() {
  buttons[counter].classList.add("show-fill-ellipse");
}
