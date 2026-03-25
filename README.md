# Windows 7 UI

Current structure:

- `index.html` keeps the markup entry point.
- `styles/main.css` is the stylesheet entry point and imports smaller files by concern.
- `scripts/main.js` is the JavaScript entry point and initializes the UI modules.
- `content/` holds the markdown content opened in windows.
- `assets/` holds wallpaper and UI image assets.
- `old/` keeps the earlier flat-file version for reference.

## Current features

- A fake Vista-style logon screen appears on first load and can be reopened from the Start menu with `Lock`.
- Desktop icons open markdown files from `content/`.
- Pinned taskbar apps open the same windows as the desktop icons.
- Start menu app entries open the same windows as the desktop and taskbar icons.
- Each app keeps a single window instance instead of opening duplicates.
- Windows can be dragged, minimized, maximized, restored, and closed.
- The taskbar highlights which app is open and which one is active.
- The system tray is currently visual only.
- A decorative desktop right-click context menu is included for presentation only.
- Core app icons are served from local `assets/` files instead of remote icon URLs.

## Local development note

Open the site through a local server, not by double-clicking `index.html`.

Examples:

- VS Code Live Server
- `python3 -m http.server`

Why:

- the windows load markdown with `fetch()`
- `file://` loads can fail or behave inconsistently in the browser

## Add a new markdown app

The desktop icons in `index.html` open markdown files from the `content/` folder.

To add a new app/window:

1. Create a new markdown file in `content/`.

Example:

```md
# Notes

This is a new window powered by markdown.
```

Save it as:

`content/notes.md`

2. Add a matching desktop icon in `index.html`.

Example:

```html
<div class="icon" data-file="notes.md" data-title="Notes">
  <img src="assets/icon-folder.svg" alt="Notes" />
  <span>Notes</span>
</div>
```

How it works:

- `data-file="notes.md"` tells the app which file to load from `content/`.
- `data-title="Notes"` sets the title shown in the window bar.
- The icon opens on double-click.

## Optional start menu entry

The Start menu app links in `index.html` can use the same `data-file` and `data-title` pattern as the desktop icons.

Example:

```html
<li>
  <a href="#" data-file="notes.md" data-title="Notes">
    <img src="assets/icon-folder.svg" alt="Notes" /> Notes
  </a>
</li>
```

The `Lock` link in the right-hand column reopens the fake logon screen.

## Current flow

- Add content in `content/*.md`
- Point a desktop icon at that file with `data-file`
- Optionally add a Start menu app link with the same `data-file` and `data-title`
- Optionally add a pinned taskbar app button that uses the same `data-file` and `data-title`
- Double-click the desktop icon to open it
- Click the Start menu app entry to open the same window
- Click the pinned taskbar app to open, focus, minimize, or restore the same window
