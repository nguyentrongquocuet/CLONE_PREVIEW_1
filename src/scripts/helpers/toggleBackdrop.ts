function getPageBackdrop() {
  return document.getElementById("backdrop");
}

export function toggleBackdrop(zIndex: number = 4) {
  const backdrop = getPageBackdrop();
  backdrop?.classList.toggle("is-visible");
  return backdrop;
}
