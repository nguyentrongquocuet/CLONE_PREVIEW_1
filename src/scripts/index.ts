import "Styles/main.scss";
import "Scripts/helpers/animationFrame";
import addCollapseBehavior from "./helpers/addCollapseBehavior";
import { addSidebarToggle } from "./helpers/addSidebarToggle";
import { DOMElement } from "src/types/customdom";
import addBlurEffect from "./helpers/addSlideEffect";
import ApplyHeaderReaction from "./helpers/addHeaderReaction";
import addScrollEffect from "./helpers/addScrollEffect";
const sidebarSelector = "#sidebar";
const sidebarItemSelector = ".nav__item.collapsible";

const sidebar = document.querySelector(sidebarSelector) as DOMElement;

const sidebarListItem = sidebar?.querySelectorAll(sidebarItemSelector);
const blurEffCon = document.querySelector(".slideshow__container.has-overlay");

addCollapseBehavior(sidebarListItem as NodeListOf<Element>);
addSidebarToggle(sidebar);
// blurEffCon.forEach((e) => addBlurEffect(e));
addBlurEffect(blurEffCon as DOMElement);

// header

const header = document.querySelector("header");
ApplyHeaderReaction(header as HTMLElement, 100, "has-no-transparent");

// TEST

addScrollEffect(
  document.querySelector(".slideshow__container.category-slideshow") as Element,
  {
    breakpoint: 641,
    reconnect: true,
    slideSelector: ".slide",
    resetApproach: "order",
  }
);
