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
let pointerStartX = null;
let pointerStartY = null;
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

function resetSwipe() {
  pointerStartX = null;
  pointerStartY = null;
  swipeDirection = null;
}

function onPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  swipeDirection = null;
  slider.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (pointerStartX === null) {
    return;
  }

  const distanceX = event.clientX - pointerStartX;
  const distanceY = event.clientY - pointerStartY;

  if (!swipeDirection && (distanceX || distanceY)) {
    swipeDirection =
      Math.abs(distanceX) > Math.abs(distanceY) ? "horizontal" : "vertical";
  }

  if (swipeDirection === "horizontal" && event.pointerType === "mouse") {
    event.preventDefault();
  }
}

function onPointerUp(event) {
  if (pointerStartX === null) {
    return;
  }

  const distance = event.clientX - pointerStartX;
  const wasHorizontal = swipeDirection === "horizontal";

  resetSwipe();

  if (!wasHorizontal || Math.abs(distance) < SWIPE_THRESHOLD) {
    return;
  }

  if (distance < 0) {
    onNextClick();
    return;
  }

  onPreviousClick();
}

function onDragStart(event) {
  event.preventDefault();
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
  slider.addEventListener("pointerdown", onPointerDown);
  slider.addEventListener("pointermove", onPointerMove);
  slider.addEventListener("pointerup", onPointerUp);
  slider.addEventListener("pointercancel", resetSwipe);
  slider.addEventListener("dragstart", onDragStart);
}

initSlider();
