// TYPE
export type SlideEffectAction = (direction: number) => any;
export type DragEffectTrigger = (
  xBefore: number,
  yBefore: number,
  xAfter: number,
  yAfter: number
) => [boolean, number];

export type NavigationEffectConfig = {
  navItemSelector: string;
  getIndex: (e: HTMLElement) => number;
  getLastSelectedIndex: (navElement: HTMLElement) => number;
};
/**
 * Trigger a action when user drag on the element
 * @param {Element} element The element to work on
 * @param {string} slideAmount The amount of width in % or px to trigger the action when user drag
 * @param {SlideEffectAction} action Callback
 * @returns Nothing0
 */

export function onHorizontalSlide(
  element: Element,
  slideAmount: string,
  action: SlideEffectAction
) {
  const mathPattern = slideAmount.match(/\d+(?=(px|%)$)/);
  if (!mathPattern) return null;
  let [amount, unit] = mathPattern.map((pattern) =>
    isNaN(parseFloat(pattern)) ? pattern : parseFloat(pattern)
  );
  switch (unit) {
    case "px":
      break;
    case "%":
      amount = ((amount as number) / 100) * element.clientWidth;
      break;
  }
  // let direction = 1; //right-to-left as default
  const slideTrigger = (
    xBefore: number,
    yBefore: number,
    xAfter: number,
    yAfter: number
  ): [boolean, number] => {
    if (xAfter - xBefore >= amount) {
      // direction = 1;
      return [true, 1];
    }
    if (xBefore - xAfter >= amount) {
      // direction = -1;
      return [true, -1];
    }
    return [false, 1];
  };

  addDragEffect(element, slideTrigger, action);
}

export function onClickNavigation(
  navElement: HTMLElement,
  action: SlideEffectAction,
  config: NavigationEffectConfig = {
    navItemSelector: "div",
    getIndex: (e) => {
      return parseInt(e.dataset.index || "0");
    },
    getLastSelectedIndex: (navElement) => {
      return parseInt(
        (navElement.querySelector(".is-selected") as HTMLElement).dataset
          .index || "0"
      );
    },
  }
) {
  const { getLastSelectedIndex, getIndex, navItemSelector } = config;
  const navItemList = navElement.querySelectorAll(navItemSelector);
  navItemList.forEach((item, index) => {
    // PREPARE
    if (!index) (item as HTMLElement).classList.add("is-selected");
    (item as HTMLElement).dataset.index = "" + index;
    item.addEventListener("click", (e) => {
      const clickedIndex = getIndex(item as HTMLElement);
      const lastSelectedIndex = getLastSelectedIndex(navElement);
      console.log("CURRENT INDEX", lastSelectedIndex);
      console.log("CHOOSING INDEX", clickedIndex);
      action(clickedIndex - lastSelectedIndex);
    });
  });
}

/**
 * Take a MouseEvent|Touch event and returns the clientX, clientY
 *@param {MouseEvent|TouchEvent} e Event
 *@returns {[number, number]} the array contains clientX, clientY
 */
function getTouchPosition(e: MouseEvent | TouchEvent): [number, number] {
  let x: number, y: number;
  if (e instanceof TouchEvent) {
    x = (e.touches[0] || e.changedTouches[0]).clientX;
    y = (e.touches[0] || e.changedTouches[0]).clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  return [x, y];
}

/**
 * Add drag effect to the element
 * @param {Element} element The element aka container
 * @param {DragEffectTrigger} trigger Trigger the action
 * @param {SlideEffectAction} action Callback with only one argument: direction : 1 | -1
 */
function addDragEffect(
  element: Element,
  trigger: DragEffectTrigger,
  action: SlideEffectAction
) {
  let xBefore: number, yBefore: number, xAfter: number, yAfter: number;

  function onMouseDown(e: MouseEvent | TouchEvent) {
    [xBefore, yBefore] = getTouchPosition(e);
    window.addEventListener("touchend", onMouseUp as EventListener);
    window.addEventListener("mouseup", onMouseUp);
    // window.addEventListener("mousemove", onMouseMove);
    console.log(e);
  }

  function onMouseMove(e: MouseEvent) {}

  function onMouseUp(e: MouseEvent | TouchEvent) {
    [xAfter, yAfter] = getTouchPosition(e);

    const [showBetrigged, step] = trigger(xBefore, yBefore, xAfter, yAfter);
    if (showBetrigged) {
      action(step);
    }
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onMouseUp as EventListener);
    // window.removeEventListener("mousemove", onMouseMove);
    console.log(e);
  }

  element.addEventListener("mousedown", onMouseDown as EventListener);
  element.addEventListener("touchstart", onMouseDown as EventListener);
}
