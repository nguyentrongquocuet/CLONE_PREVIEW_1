import { fillConfig } from "./fillConfig";

type ScrollEffectConfig = {
  breakpoint?: number;
  autoReconnect?: boolean;
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
  autoReconnect: true,
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
 * and the autoReconnect determines whether or not the effect should back when the width smaller than breakpoint
 *@returns Nothing
 */
function addScrollEffect(
  container: Element,
  config: Partial<ScrollEffectConfig>
): void {
  const filledConfig = fillConfig(config, defaultScollConfig);
  const {
    breakpoint,
    autoReconnect,
    batchScrollNumber = 2,
    slideSelector = ".slide",
    rootElement,
    navContainerSelector,
    navSelector,
  } = filledConfig;
  let disconnected = true;
  let observer: IntersectionObserver;

  let lastStatus: LastSetupState = "no_breakpoint";

  const navContainer = rootElement.querySelector(
    navContainerSelector
  ) as HTMLElement;
  const navList = navContainer?.querySelectorAll(
    navSelector
  ) as NodeListOf<HTMLElement>;

  if (breakpoint && window.outerWidth > breakpoint) {
    lastStatus = "above_breakpoint";
    navContainer.style.display = "none";
    if (!autoReconnect) {
      return;
    } else {
      const slideList = container.querySelectorAll(slideSelector);
      slideList.forEach((element, index) => {
        (element as HTMLElement).dataset.index = index + "";
      });
      // navList.forEach((nav, index) => (nav.dataset.index = "" + index || "0"));
    }
  } else {
    lastStatus = "below_breakpoint";
    navContainer.style.display = "";
    observer = setup(container, false, filledConfig);
    disconnected = false;
  }

  if (breakpoint) {
    const onResize = (e: Event) => {
      if (breakpoint && (e.target as Window).outerWidth > breakpoint) {
        lastStatus = "above_breakpoint";
        navContainer.style.display = "none";
        if (!disconnected) resetToDefault(container, observer, filledConfig);
        disconnected = true;
        if (!autoReconnect) {
          window.removeEventListener("resize", onResize);
        }
      } else {
        lastStatus = "below_breakpoint";
        if (disconnected && autoReconnect) {
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

type LastSetupState = "below_breakpoint" | "above_breakpoint" | "no_breakpoint";

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

  const onNavClick = (e: Event) => {
    console.log("TRIGGERD");
    const navIndex = parseInt(
      (e.currentTarget as HTMLElement).dataset.index || "0"
    );
    // slideList[navIndex].scrollIntoView();
    const slide = slideList[navIndex] as HTMLElement;
    (slideList[navIndex].parentNode as HTMLElement).scrollLeft =
      slide.offsetLeft;
    // console.log(slideList[navIndex]);
  };

  if (hasNav) {
    navList.forEach((navigator, index) => {
      if (!navigator.dataset.index) {
        navigator.dataset.index = "" + index;
        // navigator.removeEventListener("click", onNavClick);
        navigator.addEventListener("click", onNavClick);
      }
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
