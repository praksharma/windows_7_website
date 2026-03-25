# Windows 7 UI

Current structure:

- `index.html` keeps the markup entry point.
- `styles/main.css` is the stylesheet entry point and imports smaller files by concern.
- `scripts/main.js` is the JavaScript entry point and initializes the UI modules.
- `content/` holds the markdown content opened in windows.
- `assets/` holds wallpaper and UI image assets.
- `old/` keeps the earlier flat-file version for reference.

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
  <img src="https://img.icons8.com/color/48/notepad.png" alt="Notes" />
  <span>Notes</span>
</div>
```

How it works:

- `data-file="notes.md"` tells the app which file to load from `content/`.
- `data-title="Notes"` sets the title shown in the window bar.
- The icon opens on double-click.

## Optional start menu entry

The start menu links in `index.html` are currently visual only and do not open markdown windows yet.

If you want a new item to appear there as well, add another `<li>` under `#applications` in `index.html`. If you want, this can be wired up next so start menu items open the same markdown windows as desktop icons.

## Current flow

- Add content in `content/*.md`
- Point a desktop icon at that file with `data-file`
- Double-click the icon to open it in a draggable window
