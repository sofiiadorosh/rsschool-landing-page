const ACTIVE_BULLET_CLASS = "bullet__item_active";
const SWIPE_THRESHOLD = 50;

const slider = document.querySelector(".choose__slider");
const track = slider?.querySelector(".choose__list");
const slides = track ? [...track.children] : [];
const bullets = [...document.querySelectorAll(".bullet__item")];
const [previousButton, nextButton] = document.querySelectorAll(".arrow__button");

let currentIndex = 0;
let position = 1;
let isAnimating = false;
let touchStartX = null;
let touchStartY = null;
let swipeDirection = null;

function setTrackPosition(nextPosition, animate = true) {
  position = nextPosition;
  track.style.transition = animate ? "" : "none";
  track.style.transform = `translateX(-${position * 100}%)`;

  if (!animate) {
    track.getBoundingClientRect();
    track.style.transition = "";
  }
}

function hasTransition() {
  return parseFloat(getComputedStyle(track).transitionDuration) > 0;
}

function showSlide(index) {
  if (isAnimating) {
    return;
  }

  const nextPosition = index + 1;

  currentIndex = (index + slides.length) % slides.length;

  bullets.forEach((bullet, bulletIndex) => {
    bullet.classList.toggle(ACTIVE_BULLET_CLASS, bulletIndex === currentIndex);
  });

  if (!hasTransition()) {
    setTrackPosition(currentIndex + 1, false);
    return;
  }

  isAnimating = true;
  setTrackPosition(nextPosition);
}

function onTransitionEnd(event) {
  if (event.target !== track || event.propertyName !== "transform") {
    return;
  }

  isAnimating = false;

  if (position === 0 || position === slides.length + 1) {
    setTrackPosition(currentIndex + 1, false);
  }
}

function onPreviousClick() {
  showSlide(currentIndex - 1);
}

function onNextClick() {
  showSlide(currentIndex + 1);
}

function createClone(slide) {
  const clone = slide.cloneNode(true);

  clone.setAttribute("aria-hidden", "true");

  return clone;
}

function onTouchStart(event) {
  const touch = event.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  swipeDirection = null;
}

function onTouchMove(event) {
  if (touchStartX === null) {
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
  if (touchStartX === null) {
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

  track.prepend(createClone(slides[slides.length - 1]));
  track.append(createClone(slides[0]));
  setTrackPosition(position, false);

  track.addEventListener("transitionend", onTransitionEnd);
  previousButton.addEventListener("click", onPreviousClick);
  nextButton.addEventListener("click", onNextClick);
  slider.addEventListener("touchstart", onTouchStart, { passive: true });
  slider.addEventListener("touchmove", onTouchMove, { passive: false });
  slider.addEventListener("touchend", onTouchEnd, { passive: true });
}

initSlider();
