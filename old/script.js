// Make any window draggable
function makeDraggable(windowElement) {
    let isDragging = false, offsetX, offsetY;
  
    const titleBar = windowElement.querySelector(".title-bar");
    titleBar.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - windowElement.offsetLeft;
      offsetY = e.clientY - windowElement.offsetTop;
      windowElement.style.cursor = "grabbing";
      windowElement.style.position = "absolute";
    });
  
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
      }
    });
  
    document.addEventListener("mouseup", () => {
      isDragging = false;
      windowElement.style.cursor = "grab";
    });
  }
  
  // Apply to both windows
  const normalWindow = document.getElementById("myWindow");
  const glassWindow = document.querySelector(".window.glass");
  
  makeDraggable(normalWindow);
  makeDraggable(glassWindow);
  
  // --- Button logic for normal window ---
  document.getElementById("closeBtn").addEventListener("click", () => {
    normalWindow.style.display = "none";
  });
  
  document.getElementById("okBtn").addEventListener("click", () => {
    alert("OK clicked!");
  });
  
  document.getElementById("cancelBtn").addEventListener("click", () => {
    alert("Cancel clicked!");
  });
  