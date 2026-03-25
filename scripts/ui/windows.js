export function makeDraggable(windowElement) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  const titleBar = windowElement.querySelector(".title-bar");

  titleBar.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - windowElement.offsetLeft;
    offsetY = event.clientY - windowElement.offsetTop;
    windowElement.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    windowElement.style.left = `${event.clientX - offsetX}px`;
    windowElement.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    windowElement.style.cursor = "default";
  });
}

export function openMarkdownWindow(file, title) {
  fetch(`content/${file}`)
    .then((response) => response.text())
    .then((markdown) => {
      const html = marked.parse(markdown);
      const windowElement = document.createElement("div");

      windowElement.className = "window glass active";
      windowElement.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">${title}</div>
          <div class="title-bar-controls">
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          ${html}
        </div>
      `;

      document.body.appendChild(windowElement);
      makeDraggable(windowElement);

      windowElement
        .querySelector('[aria-label="Close"]')
        .addEventListener("click", () => {
          windowElement.remove();
        });
    });
}
