import { startButton, startMenu } from "../core/dom.js";

export function initStartMenu() {
  startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    startMenu.classList.add("hidden");
  });

  startMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
