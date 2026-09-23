const ACTIVE_BULLET_CLASS = "bullet__item_active";
const SWIPE_THRESHOLD = 50;

const slider = document.querySelector(".choose__slider");
const track = slider?.querySelector(".choose__list");
const slides = track ? [...track.children] : [];
const bullets = [...document.querySelectorAll(".bullet__item")];
const [previousButton, nextButton] = document.querySelectorAll(".arrow__button");

let currentIndex = 0;
let touchStartX = null;
let touchStartY = null;
let swipeDirection = null;

function showSlide(index) {
  currentIndex = index;
  track.style.transform = `translateX(-${index * 100}%)`;

  bullets.forEach((bullet, bulletIndex) => {
    bullet.classList.toggle(ACTIVE_BULLET_CLASS, bulletIndex === index);
  });
}

function onPreviousClick() {
  showSlide((currentIndex - 1 + slides.length) % slides.length);
}

function onNextClick() {
  showSlide((currentIndex + 1) % slides.length);
}

function onTouchStart(event) {
  const touch = event.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  swipeDirection = null;
}

function onTouchMove(event) {
  if (!touchStartX) {
    return;
  }

  const touch = event.changedTouches[0];
  const distanceX = touch.clientX - touchStartX;
  const distanceY = touch.clientY - touchStartY;

  if (!swipeDirection && (distanceX || distanceY)) {
    swipeDirection =
      Math.abs(distanceX) > Math.abs(distanceY) ? "horizontal" : "vertical";
  }

  if (swipeDirection === "horizontal" && event.cancelable) {
    event.preventDefault();
  }
}

function onTouchEnd(event) {
  if (!touchStartX) {
    return;
  }

  const distance = event.changedTouches[0].clientX - touchStartX;
  const wasHorizontal = swipeDirection === "horizontal";

  touchStartX = null;
  swipeDirection = null;

  if (!wasHorizontal || Math.abs(distance) < SWIPE_THRESHOLD) {
    return;
  }

  if (distance < 0) {
    onNextClick();
    return;
  }

  onPreviousClick();
}

function initSlider() {
  if (!slider || !slides.length || !previousButton || !nextButton) {
    return;
  }

  showSlide(currentIndex);

  previousButton.addEventListener("click", onPreviousClick);
  nextButton.addEventListener("click", onNextClick);
  slider.addEventListener("touchstart", onTouchStart, { passive: true });
  slider.addEventListener("touchmove", onTouchMove, { passive: false });
  slider.addEventListener("touchend", onTouchEnd, { passive: true });
}

initSlider();
