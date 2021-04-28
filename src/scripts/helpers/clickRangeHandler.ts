import { DOMElement } from "src/types/customdom";

export function clickOutside(
  element: DOMElement,
  callback: (e: Event) => any = () => {},
  insideCallback: (e: Event) => any = () => {},
  removeWhenOutside: boolean = true
) {
  const handler = (e: Event) => {
    if (!element.contains(e.target as Element)) {
      removeWhenOutside && document.removeEventListener("click", handler);
      callback(e);
      console.log("REMOVED");
    } else {
      console.log("INSIDE");
      insideCallback(e);
    }
  };
  const revoke = () => document.removeEventListener("click", handler);
  document.addEventListener("click", handler);
  return [handler, revoke];
}
