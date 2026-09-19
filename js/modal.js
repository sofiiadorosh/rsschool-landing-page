import { IMAGES_PATH } from "./constants.js";

const overlay = document.querySelector(".overlay");
const modalImage = overlay?.querySelector(".modal__image");
const modalName = overlay?.querySelector(".product__name");
const modalDescription = overlay?.querySelector(".product__description");
const modalSizeList = overlay?.querySelector(".size__list");
const modalAdditiveList = overlay?.querySelector(".additive__list");
const modalTotal = overlay?.querySelector(".total__number");
const modalCloseButton = overlay?.querySelector(".modal__button");

let lastFocusedElement = null;

function createSizeMarkup([key, { size }], index) {
  const activeClass = index === 0 ? " size__item_active" : "";

  return `
    <li class="size__item${activeClass}">
      <span class="size__icon">${key.toUpperCase()}</span>
      <span class="size__text">${size}</span>
    </li>
  `;
}

function createAdditiveMarkup({ name }, index) {
  return `
    <li class="additive__item">
      <span class="additive__icon">${index + 1}</span>
      <span class="additive__text">${name}</span>
    </li>
  `;
}

function fillModal(product) {
  modalImage.src = `${IMAGES_PATH}${product.image}`;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalTotal.textContent = `$${product.price}`;

  modalSizeList.innerHTML = Object.entries(product.sizes)
    .map(createSizeMarkup)
    .join("");
  modalAdditiveList.innerHTML = product.additives
    .map(createAdditiveMarkup)
    .join("");
}

function lockScroll() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

function onDocumentKeydown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

function onOverlayClick(event) {
  if (event.target === overlay) {
    closeModal();
  }
}

export function openModal(product) {
  if (!overlay) {
    return;
  }

  lastFocusedElement = document.activeElement;

  fillModal(product);
  overlay.classList.add("opened");
  lockScroll();
  requestAnimationFrame(() => modalCloseButton.focus());

  document.addEventListener("keydown", onDocumentKeydown);
}

export function closeModal() {
  overlay.classList.remove("opened");
  unlockScroll();

  document.removeEventListener("keydown", onDocumentKeydown);
  lastFocusedElement?.focus();
}

export function initModal() {
  if (!overlay) {
    return;
  }

  overlay.addEventListener("click", onOverlayClick);
  modalCloseButton.addEventListener("click", closeModal);
}
