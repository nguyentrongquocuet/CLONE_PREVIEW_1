export function toggleOverflow(element: Element = document.body) {
  const elementClone = element as HTMLElement;
  if (getComputedStyle(element).overflow !== "hidden")
    elementClone.style.overflow = "hidden";
  else elementClone.style.overflow = "";
}
