import { DOMElement } from "src/types/customdom";
import { onHorizontalSlide } from "./addEventTrigger";

type BlurEffectConfig = {
  slideSelector: string;
  slideContentSelector: string;
  beginZIndex: number;
  slideContentTriggerToken: string;
  slideShowedToken: string;
  beginSlide: number;
  transitionTime: number;
  transitionDelay: number;
};

const defaultClassesConfig: BlurEffectConfig = {
  slideSelector: ".slide",
  slideContentSelector: ".slide__content",
  transitionTime: 1,
  beginZIndex: 0,
  slideContentTriggerToken: "is-animated",
  slideShowedToken: "is-visible",
  beginSlide: 0,
  transitionDelay: 0.4,
};

function addBlurEffect(
  slideShowContainer: DOMElement,
  classes: BlurEffectConfig = defaultClassesConfig
) {
  if (!slideShowContainer) return false;

  const { nextSlide } = slideHandler(slideShowContainer, classes);
  if (!nextSlide) {
    console.warn("THE FUNCTION HAS NO EFFECT ON ", slideShowContainer);
    return null;
  }

  onHorizontalSlide(slideShowContainer, "50%", (direction: number) => {
    nextSlide(direction);
  });
}

function slideHandler(container: DOMElement, classes: BlurEffectConfig) {
  const { slideSelector, beginSlide } = classes;
  if (!slideSelector) {
    console.warn(
      "BETTER PROVIDE slideSelector, otherwise div will become selector"
    );
    return {};
  }
  (container as HTMLElement).style.position = "relative";
  (container as HTMLElement).style.zIndex = "0";
  (container as HTMLElement).style.overflow = "hidden";
  container.classList.add("has-scaling-effect");

  const slideList = container.querySelectorAll(slideSelector);
  const slideLength = slideList.length;
  if (!slideList || !slideLength) return {};

  let visibleSlide = beginSlide || 0;

  const { setupSlide, hide, show } = generateHelperFunction(classes);

  slideList.forEach(setupSlide);

  return {
    nextSlide(step: number = 1) {
      hide(slideList[visibleSlide] as HTMLElement);

      visibleSlide = (visibleSlide + step + slideLength) % slideLength;
      console.log("CHECK_VISIBLE_SLIDE", visibleSlide);
      show(slideList[visibleSlide] as HTMLElement);
    },
  };
}

function generateHelperFunction(classes: BlurEffectConfig) {
  const {
    // slideSelector,
    // beginZIndex,
    slideContentSelector,
    slideContentTriggerToken,
    slideShowedToken,
    beginSlide,
    transitionTime = 0,
    transitionDelay = 0,
  } = classes;
  return {
    hide(slide: HTMLElement) {
      slide.style.opacity = "0";
      slide.style.visibility = "hidden";
      slide.style.zIndex = "0";
      slide.classList.remove(slideShowedToken);
      slide
        .querySelector(slideContentSelector)
        ?.classList.remove(slideContentTriggerToken);
      (slide.querySelector(
        slideContentSelector
      ) as HTMLElement).style.transition = `${transitionTime}s ${transitionDelay}s`;
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
    },
    setupSlide(slide: Element, index: number, slideList: NodeListOf<Element>) {
      const slideClone = <HTMLElement>slide;
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

export default addBlurEffect;
