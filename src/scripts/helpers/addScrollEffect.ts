type ScrollEffectConfig = {
  breakpoint?: number;
  reconnect?: boolean;
  batchScrollNumber?: number;
};

/**
 * The function take a container that contains a list of slide, then turns it to the infinite scroll list
 *@param {Element|HTMLElement} container The HTMLElement, aka the list holds all the slide
 *@param {ScrollEffectConfig} config  The config which has the breakpoint option incase you wanna stretch the list out to display let say grid,
 * and the reconnect determines whether or not the effect should back when the width smaller than breakpoint
 *@returns Nothing
 */
function addScrollEffect(container: Element, config: ScrollEffectConfig): void {
  const { breakpoint, reconnect, batchScrollNumber = 2 } = config;
  let disconnected = true;
  let observer: IntersectionObserver;
  if (breakpoint && window.outerWidth > breakpoint) {
    if (!reconnect) {
      return;
    }
  } else {
    observer = setup(container, batchScrollNumber, false);
    disconnected = false;
  }

  if (breakpoint) {
    const onResize = (e: Event) => {
      if (breakpoint && (e.target as Window).outerWidth > breakpoint) {
        if (!disconnected) resetToDefault(container, observer);
        disconnected = true;
        if (!reconnect) {
          window.removeEventListener("resize", onResize);
        }
      } else {
        if (disconnected && reconnect) {
          observer = setup(container, batchScrollNumber, true);
          disconnected = false;
        }
      }
    };
    window.addEventListener("resize", onResize);
  }
  // function reconnect
}

function resetToDefault(container: Element, observer: IntersectionObserver) {
  observer.disconnect();
  container.querySelectorAll(".slide").forEach((e) => {
    const ogIndex = (e as HTMLElement).dataset.index;
    // (e as HTMLElement).style.order = "" + ogIndex;
    // Redistribute
  });
  const slideList = container.querySelectorAll(".slide");
  const l = slideList.length;
  for (let i = 0; i < l; i++) {
    for (let j = i; j < l; j++) {
      if (
        parseInt((slideList[i] as HTMLElement).dataset.index as string) >
        parseInt((slideList[j] as HTMLElement).dataset.index as string)
      ) {
        container.append(slideList[i]);
      }
    }
  }
}

function setup(
  container: Element,
  batchScrollNumber: number = 2,
  isReconnecting: boolean = false
) {
  (container as HTMLElement).style.scrollBehavior = "smooth";
  const slideList = container.querySelectorAll(".slide");
  const l = slideList.length;
  const observer = createObserve(container, batchScrollNumber);
  if (isReconnecting) {
    slideList.forEach((element, index) => {
      observer.observe(element);
      // (element as HTMLElement).style.order = "";
    });
  } else {
    slideList.forEach((element, index) => {
      (element as HTMLElement).dataset.index = index + "";
      observer.observe(element);
    });
  }

  return observer;
}

function createObserve(container: Element, batchScrollNumber: number) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let consideringEntry = entry.target;
          for (let i = 0; i < batchScrollNumber; i++) {
            const prevSib = consideringEntry.previousElementSibling;
            if (!prevSib) {
              const lastChild = container.lastChild as Element;
              container.prepend(lastChild);
              consideringEntry = lastChild;
            } else {
              consideringEntry = prevSib;
            }
          }

          consideringEntry = entry.target;
          for (let i = 0; i < batchScrollNumber; i++) {
            const nextSib = consideringEntry.nextElementSibling;
            if (!nextSib) {
              const firstChild = container.firstChild as Element;
              container.appendChild(firstChild);
              consideringEntry = firstChild;
            } else {
              consideringEntry = nextSib;
            }
          }
        }
      });
    },
    { threshold: 1, root: container }
  );
  return observer;
}

export default addScrollEffect;
