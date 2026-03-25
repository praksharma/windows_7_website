function makeDraggable(windowElement) {
    let isDragging = false, offsetX, offsetY;
    const titleBar = windowElement.querySelector(".title-bar");
  
    titleBar.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - windowElement.offsetLeft;
      offsetY = e.clientY - windowElement.offsetTop;
      windowElement.style.cursor = "grabbing";
    });
  
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
      }
    });
  
    document.addEventListener("mouseup", () => {
      isDragging = false;
      windowElement.style.cursor = "default";
    });
  }
  
  function openMarkdownWindow(file, title) {
    fetch(`content/${file}`)
      .then(res => res.text())
      .then(md => {
        const html = marked.parse(md);
        const win = document.createElement("div");
        win.className = "window glass active";
          win.innerHTML = `
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
        document.body.appendChild(win);
        makeDraggable(win);
        win.querySelector('[aria-label="Close"]').addEventListener("click", () => {
          win.remove();
        });
      });
  }
  
  // Desktop icon clicks
  document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("dblclick", () => {
      openMarkdownWindow(icon.dataset.file, icon.dataset.title);
    });
  });
  
  // Clock update
  function updateClock() {
    document.getElementById("clock").textContent =
      new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }
  setInterval(updateClock, 1000);
  updateClock();

  function updateGlassColorFromWallpaper(wallpaperPath) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = wallpaperPath;
  
    img.onload = function () {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(img);
  
      // Slight transparency for Aero effect
      const glassColor = `rgba(${r}, ${g}, ${b}, 0.35)`;
  
      // Apply to CSS variable
      document.documentElement.style.setProperty('--glass-color', glassColor);
    };
  }
  
  // Call this with your wallpaper path
  updateGlassColorFromWallpaper('assets/wall.jpg');

const startBtn = document.querySelector(".start-btn");
const startMenu = document.getElementById("startmenu");
  
  // Toggle menu on orb click
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from closing it instantly
    startMenu.classList.toggle("hidden");
  });
  
  // Close when clicking anywhere else
  document.addEventListener("click", () => {
    startMenu.classList.add("hidden");
  });
  
  // Prevent closing when clicking inside menu
  startMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  