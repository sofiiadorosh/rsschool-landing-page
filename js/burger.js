import { lockScroll, unlockScroll } from "./scroll-lock.js";

const OPENED_NAV_CLASS = "navigation_opened";
const OPENED_BUTTON_CLASS = "burger-button_opened";

const desktopQuery = window.matchMedia("(min-width: 769px)");

const burgerButton = document.querySelector(".burger-button");
const navigation = document.querySelector(".navigation");

function isMenuOpened() {
  return navigation.classList.contains(OPENED_NAV_CLASS);
}

function openMenu() {
  navigation.classList.add(OPENED_NAV_CLASS);
  burgerButton.classList.add(OPENED_BUTTON_CLASS);
  burgerButton.setAttribute("aria-expanded", "true");
  burgerButton.setAttribute("aria-label", "Close menu");
  lockScroll();

  document.addEventListener("keydown", onDocumentKeydown);
}

function closeMenu() {
  if (!isMenuOpened()) {
    return;
  }

  navigation.classList.remove(OPENED_NAV_CLASS);
  burgerButton.classList.remove(OPENED_BUTTON_CLASS);
  burgerButton.setAttribute("aria-expanded", "false");
  burgerButton.setAttribute("aria-label", "Open menu");
  unlockScroll();

  document.removeEventListener("keydown", onDocumentKeydown);
}

function onBurgerButtonClick() {
  if (isMenuOpened()) {
    closeMenu();
    return;
  }

  openMenu();
}

function onDocumentKeydown(event) {
  if (event.key === "Escape") {
    closeMenu();
  }
}

function onNavigationClick(event) {
  if (event.target.closest("a")) {
    closeMenu();
  }
}

function onBreakpointChange(event) {
  if (event.matches) {
    closeMenu();
  }
}

function initBurger() {
  if (!burgerButton || !navigation) {
    return;
  }

  burgerButton.addEventListener("click", onBurgerButtonClick);
  navigation.addEventListener("click", onNavigationClick);
  desktopQuery.addEventListener("change", onBreakpointChange);
}

initBurger();
