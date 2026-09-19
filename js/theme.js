const STORAGE_KEY = "theme";
const DARK_THEME_CLASS = "theme-dark";
const ACTIVE_ITEM_CLASS = "theme-switch__item_active";

const themeSwitch = document.querySelector(".theme-switch__list");

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  }
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.body.classList.toggle(DARK_THEME_CLASS, theme === "dark");

  if (!themeSwitch) {
    return;
  }

  themeSwitch.querySelectorAll(".theme-switch__button").forEach((button) => {
    const isActive = button.dataset.theme === theme;

    button.setAttribute("aria-pressed", String(isActive));
    button
      .closest(".theme-switch__item")
      .classList.toggle(ACTIVE_ITEM_CLASS, isActive);
  });
}

function onThemeChange(event) {
  const button = event.target.closest(".theme-switch__button");

  if (!button || !themeSwitch.contains(button)) {
    return;
  }

  const { theme } = button.dataset;

  applyTheme(theme);
  storeTheme(theme);
}

applyTheme(readStoredTheme() ?? getSystemTheme());
themeSwitch?.addEventListener("click", onThemeChange);
