import { toggleTaskbarWindow } from "./windows.js";

export function initTaskbarApps() {
  const taskbarApps = document.querySelectorAll(".taskbar-app");

  taskbarApps.forEach((button) => {
    button.addEventListener("click", () => {
      toggleTaskbarWindow(button.dataset.file, button.dataset.title);
    });
  });
}
