import Swiper from "swiper";
import { CSSSelector } from "swiper/types/shared";
import { SwiperOptions } from "swiper/types/swiper-options";
import { fillConfig } from "./fillConfig";
import { keyOf } from "./objectUtils";

// import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Scrollbar,
  EffectFade,
  Autoplay,
} from "swiper/core";

// Install modules
Swiper.use([EffectFade, Autoplay, Pagination]);

const defaultFadeSwiperOptions: SwiperOptions = {
  effect: "fade",
  fadeEffect: {
    crossFade: false,
  },
  speed: 1500,
  spaceBetween: 0,
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    stopOnLastSlide: false,
    reverseDirection: true,
  },
  loop: true,
  longSwipes: true,
  longSwipesMs: 300,
  resistance: true,
};

/**
 * use slideClass.querySelector(selector) to get child class
 */
type EffectOptions = {
  containerClass: string;
  wrapperClass: string;
  slideClass: string;
  slideChildClass: {
    [selector: string]: string;
  };
  activeSlideClass: string;
  activeSlideChildClass: {
    [selector: string]: string;
  };
  useActiveSettings: boolean;
  destroyBreakpoint:
    | {
        threshold: number;
        reInit: boolean;
      }
    | boolean;
};

const defaultEffectOption: EffectOptions = {
  containerClass: "slideshow__container",
  wrapperClass: "",
  slideClass: "slide",
  activeSlideClass: "is-selected",
  slideChildClass: {
    ".slide__content": "",
    // '.slide__img__container':"",
    "div:nth-child(2)": "",
  },
  activeSlideChildClass: {
    ".slide__content": "is-animated",
    // 'slide__img__container':"is-animated",
    "div:nth-child(2)": "is-animated",
  },
  useActiveSettings: true,
  destroyBreakpoint: false,
};

export class FadeEffect {
  /**
   * _initialed: swiper instance has been initialed, might or might not init
   */
  _initialed = false;
  swiperInstance: Swiper | undefined;

  constructor(
    public readonly container: HTMLElement | CSSSelector,
    public swiperOptions?: SwiperOptions,
    public effectOptions?: Partial<EffectOptions>,
    public root: HTMLElement | CSSSelector = document.body
  ) {
    this.swiperOptions = fillConfig(
      swiperOptions || {},
      defaultFadeSwiperOptions
    );
    this.effectOptions = fillConfig(effectOptions || {}, defaultEffectOption);
    this.prepare();
  }

  prepare() {
    if (!this._initialed) {
      if (this.isValidElement(this.container, this.root)) {
        this.swiperInstance = new Swiper(this.container, this.swiperOptions);
        this.addOptionsClasses();
        if (this.swiperInstance.params.init) {
          if (
            this.effectOptions?.destroyBreakpoint &&
            !this.setupDestroyOnBreakpoint()
          ) {
            return;
          }
          this._initialed = true;
          // this.setupDestroyOnBreakpoint();
          this.animateSlide();
          this.swiperInstance?.on("slideChange", this.animateSlide.bind(this));
        }
      } else {
        console.error(
          "INVALID container in module: FadeEffect",
          this.container
        );
        return;
      }
    } else {
      if (this.swiperInstance) {
        if (
          this.effectOptions?.destroyBreakpoint &&
          !this.setupDestroyOnBreakpoint()
        ) {
          return;
        }

        this.swiperInstance?.init();
        this.animateSlide();
        this.swiperInstance?.on("slideChange", this.animateSlide);
        this._initialed = true;
      } else console.error("CANNOT INITIAL, swiperInstance got null value");
    }
  }

  addOptionsClasses() {
    if (this.swiperInstance) {
      const { containerClass, wrapperClass, slideClass, slideChildClass } = this
        .effectOptions as EffectOptions;

      containerClass && this.swiperInstance.el.classList.add(containerClass);
      wrapperClass && this.swiperInstance.wrapperEl.classList.add(wrapperClass);
      this.swiperInstance.slides.forEach((slide) => {
        slide.classList.add(slideClass);
        keyOf(slideChildClass).forEach((selector) => {
          slideChildClass[selector] &&
            slide
              .querySelector(selector)
              ?.classList.add(slideChildClass[selector]);
        });
      });
    }
  }

  animateSlide() {
    const { useActiveSettings, activeSlideChildClass, activeSlideClass } = this
      .effectOptions as EffectOptions;

    this.swiperInstance?.slides.forEach((slide, index) => {
      if (index === this.swiperInstance?.activeIndex) {
        (slide as HTMLElement).style.visibility = "";
        if (useActiveSettings) {
          slide.classList.add(activeSlideClass);
          keyOf(activeSlideChildClass).forEach((selector) => {
            activeSlideChildClass[selector] &&
              slide
                .querySelector(selector)
                ?.classList.add(activeSlideChildClass[selector]);
          });
        }
      } else {
        // (slide as HTMLElement).style.visibility = "hidden";
        if (useActiveSettings) {
          slide.classList.remove(activeSlideClass);
          keyOf(activeSlideChildClass).forEach((selector) => {
            activeSlideChildClass[selector] &&
              slide
                .querySelector(selector)
                ?.classList.remove(activeSlideChildClass[selector]);
          });
        }
      }
    });
  }

  isValidElement(
    container: HTMLElement | CSSSelector,
    rootElement: Element | CSSSelector = document.body
  ) {
    if (!container || !rootElement) return false;
    if (typeof container === "string") {
      if (typeof rootElement === "string") {
        return Boolean(
          document.querySelector(rootElement)?.querySelector(container)
        );
      }
      if (
        rootElement instanceof Element ||
        rootElement instanceof HTMLElement
      ) {
        return Boolean(rootElement.querySelector(container));
      }
    }
    return false;
  }

  setupDestroyOnBreakpoint() {
    const { destroyBreakpoint } = this.effectOptions as EffectOptions;
    if (typeof destroyBreakpoint === "boolean") {
      return false;
    } else {
      if (destroyBreakpoint) {
        const { reInit, threshold } = destroyBreakpoint;
        if (threshold) {
          if (window.innerWidth > threshold) {
            !this.swiperInstance?.destroyed && this.swiperInstance?.destroy();
          }
          window.addEventListener("resize", () => {
            if (window.innerWidth > threshold) {
              console.log(this.swiperInstance?.destroyed);
              !this.swiperInstance?.destroyed && this.swiperInstance?.destroy();
            } else {
              if (reInit) {
                console.log(this.swiperInstance?.destroyed);
                this.swiperInstance?.destroyed && this.prepare();
              }
            }
          });
        }
      }
    }
  }
}
