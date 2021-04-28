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
  const triggerList = document.querySelectorAll(toggleButtonQuery);
  let revoke: null | Function = null;
  triggerList.forEach((e) => {
    e.addEventListener("click", (e) => {
      console.log("TRIGGERD");
      e.stopPropagation();
      if (toggleSidebar(sidebar)) {
        revoke = clickOutside(sidebar, () => {
          toggleSidebar(sidebar);
        })[1];
      } else {
        if (revoke) revoke();
        revoke = null;
      }
    });
  });
}
