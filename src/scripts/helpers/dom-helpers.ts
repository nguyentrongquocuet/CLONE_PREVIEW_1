import { DOMElement } from "src/types/customdom";

export function extractHeight(element: HTMLElement | null) {
  if (!element) return 0;
  const ogHeight = getComputedStyle(element).getPropertyValue("height");
  const height = parseFloat(ogHeight.replace("px", ""));
  return height;
}

export function addMultipleEventListeners(
  element: DOMElement,
  cb: EventListener,
  ...eventNames: string[]
) {
  element &&
    eventNames.forEach((eventName) => {
      element.addEventListener(eventName, cb);
    });
}
