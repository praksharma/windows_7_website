import { clockElement } from "../core/dom.js";

function updateClock() {
  clockElement.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initClock() {
  updateClock();
  window.setInterval(updateClock, 1000);
}
