import "Styles/main.scss";
import "Scripts/helpers/animationFrame";
import addCollapseBehavior from "./helpers/addCollapseBehavior";
import { addSidebarToggle } from "./helpers/addSidebarToggle";
import { DOMElement } from "src/types/customdom";
const sidebarSelector = "#sidebar";
const sidebarItemSelector = ".nav__item.collapsible";

const sidebar = document.querySelector(sidebarSelector) as DOMElement;

const sidebarListItem = sidebar?.querySelectorAll(sidebarItemSelector);
addCollapseBehavior(sidebarListItem as NodeListOf<Element>);
addSidebarToggle(sidebar);
