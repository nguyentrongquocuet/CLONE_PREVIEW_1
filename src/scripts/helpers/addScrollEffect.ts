import { fillConfig } from "./fillConfig";

type ScrollEffectConfig = {
  breakpoint?: number;
  reconnect?: boolean;
  batchScrollNumber: number;
  slideSelector: string;
  resetApproach: "reorder" | "redistribute";
  navContainerSelector: string;
  navSelector: string;
  navSelectedToken: string;
  hasNav: boolean;
  rootElement: HTMLElement;
};

const defaultScollConfig: ScrollEffectConfig = {
  breakpoint: 641,
  reconnect: true,
  batchScrollNumber: 2,
  resetApproach: "reorder",
  navContainerSelector: ".slide__nav",
  navSelector: ".slide__navitem",
  navSelectedToken: "is-selected",
  hasNav: false,
  rootElement: document.body,
  slideSelector: ".slide",
};

/**
 * The function take a container that contains a list of slide, then turns it to the infinite scroll list
 *@param {Element|HTMLElement} container The HTMLElement, aka the list holds all the slide
 *@param {ScrollEffectConfig} config  The config which has the breakpoint option incase you wanna stretch the list out to display let say grid,
 * and the reconnect determines whether or not the effect should back when the width smaller than breakpoint
 *@returns Nothing
 */
function addScrollEffect(
  container: Element,
  config: Partial<ScrollEffectConfig>
): void {
  const filledConfig = fillConfig(config, defaultScollConfig);
  const {
    breakpoint,
    reconnect,
    batchScrollNumber = 2,
    slideSelector = ".slide",
    rootElement,
    navContainerSelector,
  } = filledConfig;
  let disconnected = true;
  let observer: IntersectionObserver;
  if (breakpoint && window.outerWidth > breakpoint) {
    (rootElement.querySelector(
      navContainerSelector
    ) as HTMLElement).style.display = "none";
    if (!reconnect) {
      return;
    } else {
      const slideList = container.querySelectorAll(slideSelector);
      slideList.forEach((element, index) => {
        (element as HTMLElement).dataset.index = index + "";
        // observer.observe(element);
      });
    }
  } else {
    (rootElement.querySelector(
      navContainerSelector
    ) as HTMLElement).style.display = "";
    observer = setup(container, false, filledConfig);
    disconnected = false;
  }

  if (breakpoint) {
    const onResize = (e: Event) => {
      if (breakpoint && (e.target as Window).outerWidth > breakpoint) {
        (rootElement.querySelector(
          navContainerSelector
        ) as HTMLElement).style.display = "none";
        if (!disconnected) resetToDefault(container, observer, filledConfig);
        disconnected = true;
        if (!reconnect) {
          window.removeEventListener("resize", onResize);
        }
      } else {
        if (disconnected && reconnect) {
          observer = setup(container, true, filledConfig);
          disconnected = false;
          (rootElement.querySelector(
            navContainerSelector
          ) as HTMLElement).style.display = "";
        }
      }
    };
    window.addEventListener("resize", onResize);
  }
  // function reconnect
}

function resetToDefault(
  container: Element,
  observer: IntersectionObserver,
  config: ScrollEffectConfig
) {
  const {
    slideSelector,
    resetApproach,
    hasNav,
    navContainerSelector,
    navSelector,
    rootElement,
  } = config;
  observer.disconnect();
  // container.querySelectorAll(slideSelector).forEach((e) => {
  //   const ogIndex = (e as HTMLElement).dataset.index;
  //   // (e as HTMLElement).style.order = "" + ogIndex;
  //   // Redistribute
  // });

  const slideList = container.querySelectorAll(
    slideSelector as keyof HTMLElementTagNameMap
  );

  redistribute(slideList, resetApproach);
  if (hasNav) {
    const navContainer = rootElement.querySelector(
      navContainerSelector
    ) as HTMLElement;
    const navList = navContainer.querySelectorAll(
      navSelector
    ) as NodeListOf<HTMLElement>;
    // redistribute(navList, resetApproach);
  }
  function redistribute(
    slideList: NodeListOf<HTMLElement>,
    resetApproach: "reorder" | string
  ) {
    switch (resetApproach) {
      case "reorder":
        slideList.forEach((e) => {
          (e as HTMLElement).style.order =
            (e as HTMLElement).dataset.index || "1";
        });
        break;
      default: {
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
    }
  }
}

function setup(
  container: Element,
  isReconnecting: boolean = false,
  config: ScrollEffectConfig
) {
  (container as HTMLElement).style.scrollBehavior = "smooth";
  const slideList = container.querySelectorAll(".slide");
  const l = slideList.length;
  const {
    rootElement,
    hasNav,
    navContainerSelector,
    navSelectedToken,
    navSelector,
    batchScrollNumber,
  } = config;

  const navContainer = rootElement.querySelector(
    navContainerSelector
  ) as HTMLElement;
  const navList = navContainer.querySelectorAll(
    navSelector
  ) as NodeListOf<HTMLElement>;

  if (hasNav && !isReconnecting) {
    navList.forEach((navigator, index) => {
      navigator.dataset.index = "" + index;
      navigator.addEventListener("click", (e) => {
        const navIndex = parseInt(navigator.dataset.index || "0");
        // slideList[navIndex].scrollIntoView();
        const slide = slideList[navIndex] as HTMLElement;
        (slideList[navIndex].parentNode as HTMLElement).scrollLeft =
          slide.offsetLeft;
        console.log(slideList[navIndex]);
      });
    });
  }

  const entryCallback = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      // SWITCH NAVIGATION
      if (hasNav) {
        const index = parseInt(
          (entry.target as HTMLElement).dataset.index || "0"
        );
        navList[index].classList.add(navSelectedToken);
      }
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
    } else {
      if (hasNav) {
        const index = parseInt(
          (entry.target as HTMLElement).dataset.index || "0"
        );
        navList[index].classList.remove(navSelectedToken);
      }
    }
  };

  const observer = createObserve(container, batchScrollNumber, entryCallback);
  if (isReconnecting) {
    slideList.forEach((element, index) => {
      observer.observe(element);
      (element as HTMLElement).style.order = "";
    });
  } else {
    slideList.forEach((element, index) => {
      (element as HTMLElement).dataset.index = index + "";
      observer.observe(element);
    });
  }

  return observer;
}

function createObserve(
  container: Element,
  batchScrollNumber: number,
  entryCallback: (entry: IntersectionObserverEntry) => any
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entryCallback);
    },
    { threshold: 1, root: container }
  );
  return observer;
}

export default addScrollEffect;
