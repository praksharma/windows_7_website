import {
  lockScreenLink,
  loginEnterButton,
  loginScreen,
  startMenu,
} from "../core/dom.js";

export function initLoginScreen() {
  if (!loginScreen || !loginEnterButton) {
    return;
  }

  loginEnterButton.addEventListener("click", () => {
    hideLoginScreen();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !loginScreen.classList.contains("hidden")) {
      hideLoginScreen();
    }
  });

  if (lockScreenLink) {
    lockScreenLink.addEventListener("click", (event) => {
      event.preventDefault();
      showLoginScreen();
      startMenu.classList.add("hidden");
    });
  }
}

function showLoginScreen() {
  loginScreen.classList.remove("hidden");
  loginScreen.setAttribute("aria-hidden", "false");
}

function hideLoginScreen() {
  loginScreen.classList.add("hidden");
  loginScreen.setAttribute("aria-hidden", "true");
}
