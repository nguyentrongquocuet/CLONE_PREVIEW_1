import { extractHeight } from "Scripts/helpers/dom-helpers";
import { DOMElement } from "src/types/customdom";

const expandedMark = "is-expanded";
const sidebarSubItemSelector = ".nav__subitem";
const sidebarItemToggleSelector = ".item__label.collapse-trigger";

type classesConfig = {
  expandedMark: string;
  subItemSelector: string;
  itemToggleSelector: string;
};

const defaultConfig: classesConfig = {
  expandedMark,
  subItemSelector: sidebarSubItemSelector,
  itemToggleSelector: sidebarItemToggleSelector,
};

// helperFunction
function switchExpandingAnimation(item: DOMElement, expandedMark: string) {
  const toggle = item.querySelector(sidebarItemToggleSelector) as DOMElement;
  if (!toggle) return false;
  toggle.classList.toggle(expandedMark);
  return true;
}

function collapse(
  item: DOMElement | number,
  listItem: NodeListOf<Element>,
  expandedMark: string,
  cb: Function = () => {}
) {
  if (item == undefined || item == null) return false;
  if (typeof item == "number") {
    if (listItem) collapse(listItem[item], listItem, expandedMark);
    return true;
  }

  switchExpandingAnimation(item, expandedMark);
  const subItem = item.querySelector(sidebarSubItemSelector) as HTMLElement;
  if (!subItem) return false;
  subItem.classList.remove(expandedMark);
  (subItem as HTMLElement).style.overflow = "";
  (subItem as HTMLElement).style.minHeight = "";
  cb(item);
  return true;
}

function expand(
  item: DOMElement,
  expandedMark: string,
  cb: Function = () => {}
) {
  if (!item) return false;
  switchExpandingAnimation(item, expandedMark);
  const subItem = item.querySelector(sidebarSubItemSelector) as HTMLElement;
  const height = extractHeight(subItem.querySelector("ul"));
  console.log(height);
  subItem.style.minHeight = height + "px";
  subItem.style.overflow = "visible";
  subItem.classList.add(expandedMark);
  cb(item);
  return true;
}

/**
 * Adds a collapsing behavior to the list of Element
 * @param listItem Array of Element
 * @param forceCollapse Forces the collapsing when another has expanded
 * @param classes Configurations
 * @returns Nothing
 */
function addCollapseBehavior(
  listItem: NodeListOf<Element>,
  forceCollapse = true,
  classes: classesConfig = defaultConfig
) {
  let lastExpanded: number | null = null;
  if (!listItem) {
    console.warn("EMPTY LIST ITEM IN addCollapseBehavior function");
    return false;
  }
  const { expandedMark, itemToggleSelector, subItemSelector } = classes;

  // Event listener
  const expandSidebarItem = (e: DOMElement, elementIndex: number) => {
    return (event: MouseEvent) => {
      const subItem = e.querySelector(subItemSelector) as HTMLElement;
      if (lastExpanded == null) {
        expand(e, expandedMark, () => {
          lastExpanded = elementIndex;
        });
      } else {
        if (lastExpanded == elementIndex) {
          collapse(e, listItem, expandedMark, () => (lastExpanded = null));
        } else {
          collapse(lastExpanded, listItem, expandedMark);
          expand(e, expandedMark, () => {
            lastExpanded = elementIndex;
          });
        }
      }
    };
  };

  function addSidebarItemEvents(e: DOMElement, elementIndex: number) {
    const toggle = e.querySelector(itemToggleSelector) as DOMElement;
    toggle.addEventListener(
      "click",
      expandSidebarItem(e, elementIndex) as EventListener
    );
  }

  listItem.forEach(addSidebarItemEvents);
}

export default addCollapseBehavior;
