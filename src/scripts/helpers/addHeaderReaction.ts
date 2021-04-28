import { DOMElement } from "src/types/customdom";

// const header = document.querySelector("header");
/**
 * Trigger when document has scroll
 * @param {DOMElement} element Element
 * @param {number} amount The pixels that document has scrolled
 * @param {string} className The class name to add when trigged
 */
const ApplyHeaderReaction = (
  element: DOMElement,
  amount: number = 60,
  className: string
) => {
  const scrollHandler = () => {
    const { scrollTop } = document.documentElement;
    if (scrollTop > amount) {
      element?.classList.add(className);
    } else {
      element?.classList.remove(className);
    }
  };
  document.addEventListener("scroll", scrollHandler);
};
export default ApplyHeaderReaction;
