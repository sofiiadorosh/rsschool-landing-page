export function lockScroll() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
}

export function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}
