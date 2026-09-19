import { PRODUCTS_URL, IMAGES_PATH } from "./constants.js";
import { initModal, openModal } from "./modal.js";

const ACTIVE_ITEM_CLASS = "filter__item_active";
const DEFAULT_CATEGORY = "coffee";
const COLLAPSED_CARDS_COUNT = 4;

const desktopQuery = window.matchMedia("(min-width: 769px)");

const filterList = document.querySelector(".filter__list");
const productList = document.querySelector(".product__list");
const showMoreButton = document.querySelector(".refresh-button");

let products = [];
let activeCategory = DEFAULT_CATEGORY;
let isExpanded = false;

function createProductMarkup({ id, name, description, price, image }) {
  return `
    <li class="product__item" data-id="${id}">
      <div class="product__image-box">
        <img
          src="${IMAGES_PATH}${image}"
          alt=""
          class="product__image"
          width="680"
          height="680"
          loading="lazy"
        />
      </div>
      <div class="product__box">
        <h2 class="product__name">${name}</h2>
        <p class="product__description">${description}</p>
        <p class="product__price">$${price}</p>
      </div>
    </li>
  `;
}

function getCategoryProducts() {
  return products.filter((product) => product.category === activeCategory);
}

function getVisibleCount(total) {
  if (desktopQuery.matches || isExpanded) {
    return total;
  }

  return Math.min(total, COLLAPSED_CARDS_COUNT);
}

function renderProducts() {
  const categoryProducts = getCategoryProducts();
  const visibleCount = getVisibleCount(categoryProducts.length);

  productList.innerHTML = categoryProducts
    .slice(0, visibleCount)
    .map(createProductMarkup)
    .join("");

  showMoreButton.hidden = visibleCount === categoryProducts.length;
}

function setActiveFilter(category) {
  filterList.querySelectorAll(".filter__button").forEach((button) => {
    const isActive = button.dataset.category === category;

    button.setAttribute("aria-pressed", String(isActive));
    button
      .closest(".filter__item")
      .classList.toggle(ACTIVE_ITEM_CLASS, isActive);
  });
}

function onFilterChange(event) {
  const button = event.target.closest(".filter__button");

  if (!button) {
    return;
  }

  activeCategory = button.dataset.category;
  isExpanded = false;

  setActiveFilter(activeCategory);
  renderProducts();
}

function onShowMoreClick() {
  const hiddenProducts = getCategoryProducts().slice(
    productList.children.length
  );

  isExpanded = true;

  productList.insertAdjacentHTML(
    "beforeend",
    hiddenProducts.map(createProductMarkup).join("")
  );
  showMoreButton.hidden = true;
}

function onProductListClick(event) {
  const card = event.target.closest(".product__item");

  if (!card) {
    return;
  }

  const product = products.find(({ id }) => id === Number(card.dataset.id));

  if (product) {
    openModal(product);
  }
}

async function initMenu() {
  if (!filterList || !productList || !showMoreButton) {
    return;
  }

  try {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }

    products = await response.json();
  } catch (error) {
    console.error(error);
    return;
  }

  setActiveFilter(activeCategory);
  renderProducts();
  initModal();

  filterList.addEventListener("click", onFilterChange);
  showMoreButton.addEventListener("click", onShowMoreClick);
  productList.addEventListener("click", onProductListClick);
  desktopQuery.addEventListener("change", renderProducts);
}

initMenu();
