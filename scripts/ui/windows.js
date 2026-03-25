const openWindows = new Map();
let nextWindowZIndex = 1000;

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
  const existingWindow = openWindows.get(file);

  if (existingWindow) {
    restoreOrFocusWindow(existingWindow);
    return Promise.resolve(existingWindow);
  }

  const contentPath = `content/${file}`;

  return fetch(contentPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load ${contentPath} (${response.status} ${response.statusText})`);
      }

      return response.text();
    })
    .then((markdown) => {
      const windowElement = document.createElement("div");
      const html = renderWindowContent(file, markdown);

      windowElement.className = "window glass active";
      windowElement.dataset.windowFile = file;
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
      registerWindow(windowElement, file);
      focusWindow(windowElement);

      return windowElement;
    })
    .catch((error) => {
      console.error("Failed to open markdown window:", error);

      const windowElement = document.createElement("div");

      windowElement.className = "window glass active";
      windowElement.dataset.windowType = "error";
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
          <div class="markdown-content window-error">
            <h1>Could not load this file</h1>
            <p>The page tried to open <code>${contentPath}</code>, but the request failed.</p>
            <p>This usually means the file path is wrong, the file name casing does not match exactly, or GitHub Pages did not publish the file where expected.</p>
            <p class="window-error-detail">${escapeHtml(error.message)}</p>
          </div>
        </div>
      `;

      document.body.appendChild(windowElement);
      makeDraggable(windowElement);
      wireWindowControls(windowElement);
      focusWindow(windowElement);

      return windowElement;
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function registerWindow(windowElement, file) {
  openWindows.set(file, windowElement);
  wireWindowControls(windowElement);
  syncTaskbarState();

  windowElement.addEventListener("mousedown", () => {
    focusWindow(windowElement);
  });
}

function wireWindowControls(windowElement) {
  windowElement
    .querySelector('[aria-label="Close"]')
    .addEventListener("click", () => {
      closeWindow(windowElement);
    });

  windowElement
    .querySelector('[aria-label="Minimize"]')
    .addEventListener("click", (event) => {
      event.preventDefault();
      minimizeWindow(windowElement);
    });

  windowElement
    .querySelector('[aria-label="Maximize"]')
    .addEventListener("click", (event) => {
      event.preventDefault();
      toggleMaximizeWindow(windowElement);
    });
}

function closeWindow(windowElement) {
  const { windowFile } = windowElement.dataset;

  if (windowFile) {
    openWindows.delete(windowFile);
  }

  windowElement.remove();
  syncTaskbarState();
}

function focusWindow(windowElement) {
  if (windowElement.classList.contains("is-minimized")) {
    return;
  }

  document.querySelectorAll(".window").forEach((element) => {
    element.classList.remove("active");
  });

  windowElement.classList.add("active");
  windowElement.style.zIndex = String(nextWindowZIndex);
  nextWindowZIndex += 1;

  syncTaskbarState(windowElement.dataset.windowFile);
}

function syncTaskbarState(activeFile = "") {
  document.querySelectorAll(".taskbar-app").forEach((button) => {
    const isOpen = openWindows.has(button.dataset.file);
    const isActive = button.dataset.file === activeFile;

    button.classList.toggle("is-open", isOpen);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function restoreOrFocusWindow(windowElement) {
  if (windowElement.classList.contains("is-minimized")) {
    windowElement.classList.remove("is-minimized");
  }

  focusWindow(windowElement);
}

export function toggleTaskbarWindow(file, title) {
  const existingWindow = openWindows.get(file);

  if (!existingWindow) {
    return openMarkdownWindow(file, title);
  }

  if (existingWindow.classList.contains("active")) {
    minimizeWindow(existingWindow);
    return Promise.resolve(existingWindow);
  }

  restoreOrFocusWindow(existingWindow);
  return Promise.resolve(existingWindow);
}

function minimizeWindow(windowElement) {
  windowElement.classList.remove("active");
  windowElement.classList.add("is-minimized");

  focusTopVisibleWindow(windowElement);
}

function toggleMaximizeWindow(windowElement) {
  if (windowElement.classList.contains("is-minimized")) {
    windowElement.classList.remove("is-minimized");
  }

  if (windowElement.classList.contains("is-maximized")) {
    restoreWindowSize(windowElement);
    focusWindow(windowElement);
    return;
  }

  saveWindowRect(windowElement);
  windowElement.classList.add("is-maximized");
  focusWindow(windowElement);
}

function restoreWindowSize(windowElement) {
  const { restoreTop, restoreLeft, restoreWidth, restoreHeight } = windowElement.dataset;

  windowElement.classList.remove("is-maximized");

  if (restoreTop) {
    windowElement.style.top = restoreTop;
  }

  if (restoreLeft) {
    windowElement.style.left = restoreLeft;
  }

  if (restoreWidth) {
    windowElement.style.width = restoreWidth;
  } else {
    windowElement.style.removeProperty("width");
  }

  if (restoreHeight) {
    windowElement.style.height = restoreHeight;
  } else {
    windowElement.style.removeProperty("height");
  }
}

function saveWindowRect(windowElement) {
  const computedStyle = window.getComputedStyle(windowElement);

  windowElement.dataset.restoreTop = computedStyle.top;
  windowElement.dataset.restoreLeft = computedStyle.left;
  windowElement.dataset.restoreWidth = computedStyle.width;
  windowElement.dataset.restoreHeight = computedStyle.height;
}

function focusTopVisibleWindow(excludedWindow) {
  const visibleWindows = Array.from(document.querySelectorAll(".window"))
    .filter((element) => {
      return element !== excludedWindow && !element.classList.contains("is-minimized");
    })
    .sort((firstWindow, secondWindow) => {
      return Number(secondWindow.style.zIndex || 0) - Number(firstWindow.style.zIndex || 0);
    });

  const nextWindow = visibleWindows[0];

  if (nextWindow) {
    focusWindow(nextWindow);
    return;
  }

  syncTaskbarState();
}
