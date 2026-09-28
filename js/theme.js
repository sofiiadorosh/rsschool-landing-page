(() => {
  const STORAGE_KEY = "theme";
  const DARK_THEME_CLASS = "theme-dark";
  const ACTIVE_ITEM_CLASS = "theme-switch__item_active";

  let themeSwitch = null;

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

  function getCurrentTheme() {
    return document.documentElement.classList.contains(DARK_THEME_CLASS)
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === "dark");

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

  function initThemeSwitch() {
    themeSwitch = document.querySelector(".theme-switch__list");

    applyTheme(getCurrentTheme());
    themeSwitch?.addEventListener("click", onThemeChange);
  }

  applyTheme(readStoredTheme() ?? getSystemTheme());
  document.addEventListener("DOMContentLoaded", initThemeSwitch);
})();
