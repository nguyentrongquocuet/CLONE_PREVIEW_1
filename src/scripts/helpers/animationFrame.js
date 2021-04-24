// type AnimationFrame = (cb: FrameRequestCallback) => number;
// type CancelAnimation = (handler: number) => void;
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  // window as { [key: string]: any };
  // for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  //   window.requestAnimationFrame = window[
  //     vendors[x] + "RequestAnimationFrame"
  //   ] as AnimationFrame;

  //   window.cancelAnimationFrame =
  //     (window[vendors[x] + "CancelAnimationFrame"] as CancelAnimation) ||
  //     (window[vendors[x] + "CancelRequestAnimationFrame"]! as CancelAnimation)!;
  // }
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame;

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
