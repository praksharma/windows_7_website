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
      const windowElement = document.createElement("div");
      const html = renderWindowContent(file, markdown);

      windowElement.className = "window glass active";
      windowElement.dataset.windowType = getWindowType(file);
      windowElement.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">${title}</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize" title="Minimize"></button>
            <button aria-label="Maximize" title="Maximize"></button>
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

      windowElement
        .querySelector('[aria-label="Minimize"]')
        .addEventListener("click", (event) => {
          event.preventDefault();
        });

      windowElement
        .querySelector('[aria-label="Maximize"]')
        .addEventListener("click", (event) => {
          event.preventDefault();
        });
    });
}

function getWindowType(file) {
  if (file === "about.md") {
    return "about";
  }

  return "markdown";
}

function renderWindowContent(file, markdown) {
  const html = marked.parse(markdown);

  if (file === "about.md") {
    return `
      <div class="about-layout">
        <aside class="about-sidebar">
          <div class="about-portrait-frame">
            <img
              class="about-portrait"
              src="assets/profile-illustration.svg"
              alt="Profile illustration"
            />
          </div>
          <p class="about-sidebar-note">Research, code, and systems thinking.</p>
        </aside>
        <article class="markdown-content about-content">
          ${html}
        </article>
      </div>
    `;
  }

  return `<div class="markdown-content">${html}</div>`;
}
