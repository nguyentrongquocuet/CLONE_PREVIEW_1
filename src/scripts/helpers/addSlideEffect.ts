import { has } from "lodash";
import { DOMElement } from "src/types/customdom";
import {
  NavigationEffectConfig,
  onClickNavigation,
  onHorizontalSlide,
} from "./addEventTrigger";
import { fillConfig } from "./fillConfig";

type BlurEffectConfig = {
  rootElement: HTMLElement;
  containerAnimatedToken: string;
  slideSelector: string;
  slideContentSelector: string;
  slideContentTriggerToken: string;
  slideShowedToken: string;
  beginZIndex: number;
  beginSlide: number;
  transitionTime: number;
  transitionDelay: number;
  navContainerSelector: string;
  navSelector: string;
  navSelectedToken: string;
  hasNav: boolean;
};

const defaultClassesConfig: BlurEffectConfig = {
  rootElement: document.body,
  slideSelector: ".slide",
  slideContentSelector: ".slide__content",
  containerAnimatedToken: "has-scaling-effect",
  transitionTime: 1,
  beginZIndex: 0,
  slideContentTriggerToken: "is-animated",
  slideShowedToken: "is-visible",
  beginSlide: 0,
  transitionDelay: 0.4,
  navContainerSelector: "dasdad",
  navSelector: "div",
  navSelectedToken: "is-selected",
  hasNav: false,
};

export function addBlurEffect(
  slideShowContainer: DOMElement,
  config?: Partial<BlurEffectConfig>
) {
  if (!config) config = defaultClassesConfig;
  const filledConfig = fillConfig<BlurEffectConfig>(
    config,
    defaultClassesConfig
  );
  if (!slideShowContainer) return false;

  const { nextSlide } = slideHandler(slideShowContainer, filledConfig);
  if (!nextSlide) {
    console.warn("THE FUNCTION HAS NO EFFECT ON ", slideShowContainer);
    return null;
  }

  onHorizontalSlide(slideShowContainer, "50%", (step: number) => {
    nextSlide(step);
  });
}

// export function addNavigationSlideEffect(
//   slideShowContainer: DOMElement,
//   navigationContainer: DOMElement,
//   config: Partial<BlurEffectConfig>,
//   navConfig?: NavigationEffectConfig
// ) {
//   if (!slideShowContainer) return false;

//   const { nextSlide } = slideHandler(
//     slideShowContainer,
//     config as BlurEffectConfig
//   );
//   if (!nextSlide) {
//     console.warn("THE FUNCTION HAS NO EFFECT ON ", slideShowContainer);
//     return null;
//   }
//   onClickNavigation(
//     navigationContainer as HTMLElement,
//     (step: number) => {
//       console.log("STEP", step);
//       nextSlide(step);
//     },
//     navConfig
//   );
// }

// TODO: ADD NAVIGATION SYNC
function slideHandler(container: DOMElement, config: BlurEffectConfig) {
  const {
    slideSelector,
    beginSlide,
    hasNav,
    navContainerSelector,
    navSelector,
    navSelectedToken,
    rootElement,
    containerAnimatedToken,
  } = config;
  if (!slideSelector) {
    console.warn(
      "BETTER PROVIDE slideSelector, otherwise div will become selector"
    );
    return {};
  }
  (container as HTMLElement).style.position = "relative";
  (container as HTMLElement).style.zIndex = "0";
  (container as HTMLElement).style.overflow = "hidden";
  container.classList.add(containerAnimatedToken);

  const navContainer = rootElement.querySelector(navContainerSelector);
  const navList = navContainer?.querySelectorAll(
    navSelector
  ) as NodeListOf<HTMLElement>;

  const slideList = container.querySelectorAll(slideSelector);
  const slideLength = slideList.length;

  if (!slideList || !slideLength) return {};

  let visibleSlide = beginSlide || 0;
  if (hasNav) {
    navList[visibleSlide].classList.add(navSelectedToken);
    navList.forEach((navigator) => {
      navigator.addEventListener("click", (e) => {
        const step = calculateStep(navigator);
        // console.log("EMBEDDED ", step);
        nextSlide(step);
      });
    });
  }
  const { setupSlide, hide, show } = generateHelperFunction(config);

  slideList.forEach(setupSlide);

  function calculateStep(e: HTMLElement) {
    return getDataIndex(e) - visibleSlide;
  }

  function getDataIndex(e: HTMLElement) {
    return parseInt(e.dataset.index || "0");
  }

  function nextSlide(step: number = 1) {
    if (step) {
      hide(slideList[visibleSlide] as HTMLElement);

      visibleSlide = (visibleSlide + step + slideLength) % slideLength;
      // console.log("CHECK_VISIBLE_SLIDE", visibleSlide);
      show(slideList[visibleSlide] as HTMLElement);
    }
  }
  return {
    nextSlide,
  };
}

function generateHelperFunction(config: BlurEffectConfig) {
  const {
    // slideSelector,
    // beginZIndex,
    slideContentSelector,
    slideContentTriggerToken,
    slideShowedToken,
    beginSlide = 0,
    transitionTime = 0,
    transitionDelay = 0,
    hasNav,
    navContainerSelector,
    navSelectedToken,
    navSelector,
    rootElement,
  } = config;

  const navContainer = rootElement.querySelector(navContainerSelector);
  const navList = navContainer?.querySelectorAll(
    navSelector
  ) as NodeListOf<HTMLElement>;
  return {
    hide(slide: HTMLElement) {
      slide.style.opacity = "0";
      slide.style.visibility = "hidden";
      slide.style.zIndex = "0";
      slide.classList.remove(slideShowedToken);
      slide
        .querySelector(slideContentSelector)
        ?.classList.remove(slideContentTriggerToken);
      if (hasNav) {
        const index = parseInt(slide.dataset.index || "0");
        navList[index]?.classList.remove(navSelectedToken);
      }
      return !slide.classList.contains(slideShowedToken);
    },
    show(slide: HTMLElement) {
      (slide.querySelector(
        slideContentSelector
      ) as HTMLElement).style.transition = `${transitionTime}s ${
        transitionDelay + transitionTime
      }s`;

      slide.style.opacity = "1";
      slide.style.visibility = "visible";
      slide.style.zIndex = "1";
      slide.classList.add(slideShowedToken);
      slide
        .querySelector(slideContentSelector)
        ?.classList.add(slideContentTriggerToken);
      if (hasNav) {
        const index = parseInt(slide.dataset.index || "0");
        navList[index]?.classList.add(navSelectedToken);
      }
    },
    setupSlide(slide: Element, index: number, slideList: NodeListOf<Element>) {
      const slideClone = <HTMLElement>slide;
      // console.log(slide, index, beginSlide);
      if (index === beginSlide) {
        slideClone.classList.add(slideShowedToken);
        slide
          .querySelector(slideContentSelector)
          ?.classList.add(slideContentTriggerToken);
      }
      index === beginSlide && slideClone.classList.add(slideShowedToken);
      slideClone.style.opacity = index !== beginSlide ? "0" : "1";
      slideClone.style.visibility = index !== beginSlide ? "hidden" : "visible";

      slideClone.style.zIndex = index !== beginSlide ? "0" : "1";
      if (hasNav) {
        // indexing for navigating
        slideClone.dataset.index = "" + index;
        navList[index].dataset.index = "" + index;
        if (index === beginSlide)
          navList[index].classList.add(navSelectedToken);
      }
      (slideClone.querySelector(
        slideContentSelector
      ) as HTMLElement).style.transition = `${transitionTime}s ${
        transitionTime + transitionDelay
      }s`;
      // slideClone.style.width = "100%";
      // slideClone.style.height = "100%";
      slideClone.style.position = "relative";
      slideClone.style.top = "0px";
      slideClone.style.left = -index * 100 + "%";
      slideClone.style.transition = `opacity ${transitionTime}s ${transitionDelay}s, visibility ${transitionTime}s ${transitionDelay}s`;
    },
  };
}
