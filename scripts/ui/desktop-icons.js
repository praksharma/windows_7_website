import { desktopIcons } from "../core/dom.js";
import { openMarkdownWindow } from "./windows.js";

export function initDesktopIcons() {
  desktopIcons.forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      openMarkdownWindow(icon.dataset.file, icon.dataset.title);
    });
  });
}
