import { startButton, startMenu, startMenuAppLinks } from "../core/dom.js";
import { openMarkdownWindow } from "./windows.js";

export function initStartMenu() {
  startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startMenu.classList.toggle("hidden");
  });

  startMenuAppLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openMarkdownWindow(link.dataset.file, link.dataset.title);
      startMenu.classList.add("hidden");
    });
  });

  document.addEventListener("click", () => {
    startMenu.classList.add("hidden");
  });

  startMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
