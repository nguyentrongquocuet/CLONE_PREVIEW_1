import { DOMElement } from "src/types/customdom";
import { clickOutside } from "Scripts/helpers/clickRangeHandler";
import { toggleBackdrop } from "Scripts/helpers/toggleBackdrop";
import { disableOverflow } from "./CSSHelper";
import { toggleOverflow } from "./toggleOverflow";
const defaultToggleQuery = "#sidebar-toggle";

function toggleSidebar(sidebar: DOMElement, toggledToken = "is-visible") {
  // document.body.classList.toggle("overflow-disabled");
  // disableOverflow();
  sidebar.classList.toggle(toggledToken);
  toggleBackdrop();
  toggleOverflow();
  return sidebar.classList.contains(toggledToken);
}

export function addSidebarToggle(
  sidebar: DOMElement,
  toggleButtonQuery: string = defaultToggleQuery,
  toggledToken: string = "is-visible"
) {
  document.querySelectorAll(toggleButtonQuery).forEach((e) => {
    e.addEventListener("click", (e) => {
      e.stopPropagation();
      if (toggleSidebar(sidebar)) {
        clickOutside(sidebar, () => toggleSidebar(sidebar));
      }
    });
  });
}
