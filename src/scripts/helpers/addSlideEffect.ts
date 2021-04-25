import { DOMElement } from "src/types/customdom";

function mouseDown(e: Event) {
  console.log("mouseDOWN", e);
}

function mouseMove(e: Event) {
  console.log("mouseMOVE", e);
}

function mouseUp(e: Event) {
  console.log("mouseUP", e);
}

function addBlurEffect(slideShowContainer: DOMElement) {
  slideShowContainer.addEventListener("mousedown", mouseDown);
  slideShowContainer.addEventListener("mousemove", mouseMove);
  slideShowContainer.addEventListener("mouseup", mouseUp);
}

export default addBlurEffect;
