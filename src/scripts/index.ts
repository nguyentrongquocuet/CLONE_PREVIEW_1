import "Styles/main.scss";
import "Scripts/helpers/animationFrame";
import addCollapseBehavior from "./helpers/addCollapseBehavior";
import { addSidebarToggle } from "./helpers/addSidebarToggle";
import { DOMElement } from "src/types/customdom";
import {
  addBlurEffect,
  addNavigationSlideEffect,
} from "./helpers/addSlideEffect";
import ApplyHeaderReaction from "./helpers/addHeaderReaction";
import addScrollEffect from "./helpers/addScrollEffect";
const sidebarSelector = "#sidebar";
const sidebarItemSelector = ".nav__item.collapsible";

const sidebar = document.querySelector(sidebarSelector) as DOMElement;

const sidebarListItem = sidebar?.querySelectorAll(sidebarItemSelector);

const blurEffCon = document.querySelector(".slideshow__container.has-overlay");

const timeLineShow = document.querySelector(".timeline__list");
const timeLineNavigator = document.querySelector(".timeline__tab ");
addCollapseBehavior(sidebarListItem as NodeListOf<Element>);
addSidebarToggle(sidebar);
// blurEffCon.forEach((e) => addBlurEffect(e));

addBlurEffect(blurEffCon as DOMElement);

addNavigationSlideEffect(
  timeLineShow as DOMElement,
  timeLineNavigator as DOMElement,
  {
    slideContentSelector: ".timeline__content",
    slideSelector: ".item__wrapper",
    slideContentTriggerToken: "is-animated",
    slideShowedToken: "is-selected",
    transitionTime: 1,
    rootElement: document.querySelector(".timeline-section") as HTMLElement,
    hasNav: true,
    navContainerSelector: ".timeline__tab",
    navSelector: ".timeline__tabitem",
    navSelectedToken: "is-selected",
  }
);
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

function setHeaderHeightVar() {
  const header = document.querySelector("header");
  if (header) {
    const height = getComputedStyle(header).height;
    document.body.style.setProperty("--header-height", height);
  }
}

window.addEventListener("resize", setHeaderHeightVar);
window.addEventListener("load", setHeaderHeightVar);
