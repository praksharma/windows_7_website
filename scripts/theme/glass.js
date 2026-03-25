export function updateGlassColorFromWallpaper(wallpaperPath) {
  const image = new Image();

  image.crossOrigin = "anonymous";
  image.src = wallpaperPath;

  image.onload = () => {
    const colorThief = new ColorThief();
    const [red, green, blue] = colorThief.getColor(image);
    const glassColor = `rgba(${red}, ${green}, ${blue}, 0.35)`;

    document.documentElement.style.setProperty("--glass-color", glassColor);
  };
}
