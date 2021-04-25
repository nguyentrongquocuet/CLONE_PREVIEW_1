export function disableOverflow(e: HTMLElement = document.body) {
  e.style.overflow = "hidden";
}

export function getCSSVariable(
  variableName: string = "",
  element?: HTMLElement
) {
  return getComputedStyle(element || document.body).getPropertyValue(
    `--${variableName}`
  );
}
