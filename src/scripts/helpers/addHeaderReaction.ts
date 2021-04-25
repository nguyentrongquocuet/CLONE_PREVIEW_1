import { DOMElement } from "src/types/customdom";

const header = document.querySelector("header");

const ApplyHeaderReaction = (headerElement: DOMElement, amount = 60) => {
  const scrollHandler = () => {
    const { scrollTop } = document.documentElement;
    if (scrollTop > amount) {
      header?.classList.add("has-no-transparent");
    } else {
      header?.classList.remove("has-no-transparent");
    }
  };
  document.addEventListener("scroll", scrollHandler);
};
export default ApplyHeaderReaction;
