import { IMAGES_PATH } from "./constants.js";
import { lockScroll, unlockScroll } from "./scroll-lock.js";

const overlay = document.querySelector(".overlay");
const modalImage = overlay?.querySelector(".modal__image");
const modalName = overlay?.querySelector(".product__name");
const modalDescription = overlay?.querySelector(".product__description");
const modalSizeList = overlay?.querySelector(".size__list");
const modalAdditiveList = overlay?.querySelector(".additive__list");
const modalTotal = overlay?.querySelector(".total__number");
const modalCloseButton = overlay?.querySelector(".modal__button");

const selectedAdditives = new Set();
let lastFocusedElement = null;
let currentProduct = null;
let selectedSize = null;

function createSizeMarkup([key, { size }]) {
  const activeClass = key === selectedSize ? " size__item_active" : "";

  return `
    <li class="size__item${activeClass}" data-size="${key}">
      <span class="size__icon">${key.toUpperCase()}</span>
      <span class="size__text">${size}</span>
    </li>
  `;
}

function createAdditiveMarkup({ name }, index) {
  return `
    <li class="additive__item" data-additive="${index}">
      <span class="additive__icon">${index + 1}</span>
      <span class="additive__text">${name}</span>
    </li>
  `;
}

function getTotalPrice() {
  const sizePrice = currentProduct.sizes[selectedSize]["add-price"];
  const additivesPrice = [...selectedAdditives].reduce(
    (sum, index) => sum + Number(currentProduct.additives[index]["add-price"]),
    0
  );

  return (
    Number(currentProduct.price) +
    Number(sizePrice) +
    additivesPrice
  ).toFixed(2);
}

function updateTotal() {
  modalTotal.textContent = `$${getTotalPrice()}`;
}

function onSizeListClick(event) {
  const item = event.target.closest(".size__item");

  if (!item) {
    return;
  }

  selectedSize = item.dataset.size;

  modalSizeList.querySelectorAll(".size__item").forEach((element) => {
    element.classList.toggle("size__item_active", element === item);
  });
  updateTotal();
}

function onAdditiveListClick(event) {
  const item = event.target.closest(".additive__item");

  if (!item) {
    return;
  }

  const index = Number(item.dataset.additive);
  const isSelected = item.classList.toggle("additive__item_active");

  if (isSelected) {
    selectedAdditives.add(index);
  } else {
    selectedAdditives.delete(index);
  }

  updateTotal();
}

function fillModal(product) {
  currentProduct = product;
  selectedSize = Object.keys(product.sizes)[0];
  selectedAdditives.clear();

  modalImage.src = `${IMAGES_PATH}${product.image}`;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;

  modalSizeList.innerHTML = Object.entries(product.sizes)
    .map(createSizeMarkup)
    .join("");
  modalAdditiveList.innerHTML = product.additives
    .map(createAdditiveMarkup)
    .join("");

  updateTotal();
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
  modalSizeList.addEventListener("click", onSizeListClick);
  modalAdditiveList.addEventListener("click", onAdditiveListClick);
}
