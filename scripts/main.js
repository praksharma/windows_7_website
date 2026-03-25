import { initClock } from "./ui/clock.js";
import { initDesktopContextMenu } from "./ui/context-menu.js";
import { initDesktopIcons } from "./ui/desktop-icons.js";
import { initLoginScreen } from "./ui/login-screen.js";
import { initStartMenu } from "./ui/start-menu.js";
import { initTaskbarApps } from "./ui/taskbar-apps.js";
import { updateGlassColorFromWallpaper } from "./theme/glass.js";

initDesktopIcons();
initClock();
initDesktopContextMenu();
initLoginScreen();
initStartMenu();
initTaskbarApps();
updateGlassColorFromWallpaper("assets/wall.jpg");
