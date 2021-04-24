import "../styles/main.scss";
import "Scripts/helpers/animationFrame";

const sidebarItemClass = "sidebar__item";
const sidebarSubItemClass = "sidebar__subitem";
const sidebarItemToggleClass = "sidebar__expand-toggle";
const sidebarItemSubcontentClass = "sidebar__item__subcontent";
const expandedMark = "is-expanded";

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

function extractHeight(element: HTMLElement | null) {
  if (!element) return 0;
  const ogHeight = getComputedStyle(element).getPropertyValue("height");
  const height = parseFloat(ogHeight.replace("px", ""));
  return height;
}

const expandSidebarItem = (e: HTMLElement) => {
  return (event: MouseEvent) => {
    const subcontentItem = e.querySelector(`.${sidebarItemSubcontentClass}`);
    if (!subcontentItem || subcontentItem.classList.contains(expandedMark)) {
      (subcontentItem as HTMLElement).classList.remove(expandedMark);
      (subcontentItem as HTMLElement).style.overflow = "";
      (subcontentItem as HTMLElement).style.minHeight = "";
      return;
    }
    const height = extractHeight(e.querySelector("ul"));
    console.log(height);
    (subcontentItem as HTMLElement).style.minHeight = height + "px";
    (subcontentItem as HTMLElement).style.overflow = "visible";
    (subcontentItem as HTMLElement).classList.add(expandedMark);
  };
};

function addSidebarItemEvents(e: Element) {
  const toggle = e.querySelector(`.${sidebarItemToggleClass}`);
  toggle?.addEventListener("click", (e) => {
    (e.currentTarget as HTMLElement).classList.toggle(expandedMark);
  });

  toggle?.addEventListener(
    "click",
    expandSidebarItem(e as HTMLElement) as EventListener
  );
}

const sidebar = document.getElementById("side-header");

const sidebarListItem = sidebar?.querySelectorAll(`.${sidebarItemClass}`);

sidebarListItem?.forEach(addSidebarItemEvents);
