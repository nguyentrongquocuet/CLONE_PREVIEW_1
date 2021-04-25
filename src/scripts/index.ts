import "Styles/main.scss";
import "Scripts/helpers/animationFrame";
import addCollapseBehavior from "./helpers/addCollapseBehavior";
import { addSidebarToggle } from "./helpers/addSidebarToggle";
import { DOMElement } from "src/types/customdom";
import addBlurEffect from "./helpers/addSlideEffect";
import ApplyHeaderReaction from "./helpers/addHeaderReaction";
const sidebarSelector = "#sidebar";
const sidebarItemSelector = ".nav__item.collapsible";

const sidebar = document.querySelector(sidebarSelector) as DOMElement;

const sidebarListItem = sidebar?.querySelectorAll(sidebarItemSelector);
const blurEffCon = document.querySelector(".has-blur-effect");

addCollapseBehavior(sidebarListItem as NodeListOf<Element>);
addSidebarToggle(sidebar);

// addBlurEffect(blurEffCon as DOMElement);

// header

const header = document.querySelector("header");
ApplyHeaderReaction(header as HTMLElement, 100);
