import { desktopArea, desktopContextMenu, startMenu } from "../core/dom.js";

export function initDesktopContextMenu() {
  if (!desktopContextMenu) {
    return;
  }

  document.addEventListener("contextmenu", (event) => {
    if (!shouldOpenContextMenu(event.target)) {
      hideContextMenu();
      return;
    }

    event.preventDefault();
    openContextMenu(event.clientX, event.clientY);
  });

  document.addEventListener("click", () => {
    hideContextMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideContextMenu();
    }
  });

  window.addEventListener("resize", () => {
    hideContextMenu();
  });

  desktopContextMenu.addEventListener("click", (event) => {
    event.preventDefault();
    hideContextMenu();
  });
}

function shouldOpenContextMenu(target) {
  if (!target) {
    return false;
  }

  if (startMenu && startMenu.contains(target)) {
    return false;
  }

  if (desktopContextMenu.contains(target)) {
    return false;
  }

  return target === document.body || desktopArea.contains(target);
}

function openContextMenu(clientX, clientY) {
  desktopContextMenu.classList.remove("hidden");
  desktopContextMenu.setAttribute("aria-hidden", "false");

  const menuWidth = desktopContextMenu.offsetWidth;
  const menuHeight = desktopContextMenu.offsetHeight;
  const left = Math.min(clientX, window.innerWidth - menuWidth - 8);
  const top = Math.min(clientY, window.innerHeight - menuHeight - 56);

  desktopContextMenu.style.left = `${Math.max(8, left)}px`;
  desktopContextMenu.style.top = `${Math.max(8, top)}px`;
}

function hideContextMenu() {
  desktopContextMenu.classList.add("hidden");
  desktopContextMenu.setAttribute("aria-hidden", "true");
}
