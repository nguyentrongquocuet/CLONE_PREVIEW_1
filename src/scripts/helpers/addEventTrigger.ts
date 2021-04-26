// TYPE
export type SlideEffectAction = (direction: number) => any;
export type SlideEffectTrigger = (
  xBefore: number,
  yBefore: number,
  xAfter: number,
  yAfter: number
) => [boolean, number];

/**
 * Add slide effect to the element
 * @param {Element} element The element aka container
 * @param {SlideEffectTrigger} trigger Trigger the action
 * @param {SlideEffectAction} action Callback with only one argument: direction : 1 | -1
 */
function addSlideEffect(
  element: Element,
  trigger: SlideEffectTrigger,
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

    const [showBetrigged, direction] = trigger(
      xBefore,
      yBefore,
      xAfter,
      yAfter
    );
    if (showBetrigged) {
      action(direction);
    }
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onMouseUp as EventListener);
    // window.removeEventListener("mousemove", onMouseMove);
    console.log(e);
  }

  element.addEventListener("mousedown", onMouseDown as EventListener);
  element.addEventListener("touchstart", onMouseDown as EventListener);
}

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
  let direction = 1; //right-to-left as default
  const slideTrigger = (
    xBefore: number,
    yBefore: number,
    xAfter: number,
    yAfter: number
  ): [boolean, number] => {
    if (xAfter - xBefore >= amount) {
      direction = 1;
      return [true, 1];
    }
    if (xBefore - xAfter >= amount) {
      direction = -1;
      return [true, -1];
    }
    return [false, 1];
  };

  addSlideEffect(element, slideTrigger, action);
}

/**
 * Take a MouseEvent|Touch event and returns the clientX, clientY
 *@param {MouseEvent|TouchEvent} e Event
 *@returns {[number, number]} the array contains clientX, clientY
 */
function getTouchPosition(e: MouseEvent | TouchEvent) {
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
