import { DOMElement } from "src/types/customdom";

function addBlurEffect(slideShowContainer: DOMElement) {
  if (!slideShowContainer) return false;
  const slideList = slideShowContainer.querySelectorAll(".slide");

  // function mouseDown(e: Event) {
  //   slideShowContainer.addEventListener("mousemove", mouseMove);
  // }

  // function mouseMove(e: Event) {
  //   console.log("mouseMOVE", e);
  // }

  // function mouseUp(e: Event) {
  //   console.log("mouseUP", e);
  //   slideShowContainer.removeEventListener("mousemove", mouseMove);
  // }

  slideShowContainer.addEventListener("click", (e) => {
    slideList.forEach((slide, index) => {
      (slide as HTMLElement).style.width = "100%";
      (slide as HTMLElement).style.height = "100%";
      (slide as HTMLElement).style.position = "absolute";
      (slide as HTMLElement).style.transition = "opacity 0.25s 0.25s";
      (slide as HTMLElement).style.opacity = "0";
      (slide as HTMLElement).style.zIndex = "" + index;
    });
  });
  // slideShowContainer.addEventListener("mouseup", mouseUp);
}

export default addBlurEffect;
