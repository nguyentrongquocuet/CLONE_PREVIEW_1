import "Styles/main.scss";
import "Scripts/helpers/animationFrame";
import addCollapseBehavior from "./helpers/addCollapseBehavior";
import { addSidebarToggle } from "./helpers/addSidebarToggle";
const sidebarSelector = "#sidebar";
const sidebarItemSelector = ".nav__item.collapsible";

// TYPES
type DOMElement = Element | HTMLElement;

const sidebarItemSpacing = parseInt(
  getCSSVariable("navitem-space").replace("px", "")
);
console.log(sidebarItemSpacing);

document
  .getElementById("mobile-sidebar-toggle")
  ?.addEventListener("click", (e) => {
    toggleSidebar();
  });

const requestAnimationFrame = window.requestAnimationFrame(animationLoop);

function animationLoop(args: any) {
  console.log("ANIMATING12");
  console.log(args);
}

function disableOverflow(e: HTMLElement = document.body) {
  e.style.overflow = "hidden";
}

function getCSSVariable(variableName: string = "", element?: HTMLElement) {
  return getComputedStyle(element || document.body).getPropertyValue(
    `--${variableName}`
  );
}

function toggleSidebar() {}

const sidebar = document.querySelector(sidebarSelector) as DOMElement;

const sidebarListItem = sidebar?.querySelectorAll(sidebarItemSelector);
addCollapseBehavior(sidebarListItem as NodeListOf<Element>);
addSidebarToggle(sidebar);
