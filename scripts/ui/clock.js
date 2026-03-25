import { clockElement } from "../core/dom.js";

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  clockElement.innerHTML = `
    <span class="clock-time">${time}</span>
    <span class="clock-date">${date}</span>
  `;
}

export function initClock() {
  updateClock();
  window.setInterval(updateClock, 1000);
}
