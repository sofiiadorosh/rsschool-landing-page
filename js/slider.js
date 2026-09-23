const ACTIVE_BULLET_CLASS = "bullet__item_active";

const slider = document.querySelector(".choose__slider");
const track = slider?.querySelector(".choose__list");
const slides = track ? [...track.children] : [];
const bullets = [...document.querySelectorAll(".bullet__item")];
const [previousButton, nextButton] = document.querySelectorAll(".arrow__button");

let currentIndex = 0;

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

function initSlider() {
  if (!slider || !slides.length || !previousButton || !nextButton) {
    return;
  }

  showSlide(currentIndex);

  previousButton.addEventListener("click", onPreviousClick);
  nextButton.addEventListener("click", onNextClick);
}

initSlider();
