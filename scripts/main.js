import { initClock } from "./ui/clock.js";
import { initDesktopIcons } from "./ui/desktop-icons.js";
import { initStartMenu } from "./ui/start-menu.js";
import { initTaskbarApps } from "./ui/taskbar-apps.js";
import { updateGlassColorFromWallpaper } from "./theme/glass.js";

initDesktopIcons();
initClock();
initStartMenu();
initTaskbarApps();
updateGlassColorFromWallpaper("assets/wall.jpg");
