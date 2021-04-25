import { DOMElement } from "src/types/customdom";

export function clickOutside(
  element: DOMElement,
  callback: Function = () => {},
  removeWhenOutside: boolean = true
) {
  const handler = (e: Event) => {
    if (!element.contains(e.target as Element)) {
      callback(e);
      removeWhenOutside && document.removeEventListener("click", handler);
    }
  };
  document.addEventListener("click", handler);
  return handler;
}
