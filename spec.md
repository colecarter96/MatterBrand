# Project Spec: Split-View Tile Dashboard (Next.js)

## Overview

Build a Next.js web app (to be hosted on Vercel) that displays a split screen layout with:

- A vertical list of categories on the left.
- A draggable divider (black vertical line).
- A configurable tile grid on the right where each tile shows a selected category’s content (e.g., Music, Videos).
- Tiles can be dragged, resized, and reconfigured.
- Tile layout is managed via controls in the bottom right of the tile area.

---

## Functional Requirements

### Sidebar (Left)
- Vertical list of categories:
  - Music
  - Movies
  - Videos
  - Colors
  - Fonts
  - Literature
  - Textures
  - Items
  - Feelings
  - Season, temperature, weather
  - Programming stuff
  - Activities
  - Websites
- Static, always visible on the left.
- Selecting a category allows the user to assign it to a tile when in tile layout mode.

### Divider
- A vertical, draggable black line that resizes the width of the sidebar vs. the content pane.

### Right Pane (Main Content)
- Contains resizable, draggable tiles (up to 4) in a CSS grid.
- Bottom-right corner includes a tile configuration panel:
  - Allows user to select how many tiles to show (1–4).
  - Allows each tile to be assigned one of the sidebar categories.
- Each tile displays hardcoded content for the selected category.
- Only one type of content per tile at a time.
- No routing or URL change is required when switching tile content.
- Tiles should support flexible resizing via a React drag/resize library.
- Tiles should be able to be freely dragged and placed wherever in the tile space
- Default locations for tiles should be as follows
    - 1 tile: 1 large tile taking up almost the whole right pane
    - 2 tiles: 2 large tiles side by each taking up almost half of the right pane
    - 3 tiles: 1 large tile on the right side talking up almost the right half of the right pane, 2 vertically stacked tiles taking up half of the rest of the pane
    - 3 tiles: 4 tiles taking up each of the four quadrants of the right pane

---

## Technology Stack

- Framework: **Next.js 14+ with App Router**
- Styling: **Tailwind CSS**
- State Management: **useState / useReducer**
- Drag/Resize: **react-grid-layout** or **react-resizable-box**
- Embeds: Use iframe or components (e.g., Spotify iframe, quotes as text, etc.)
- Hosting: **Vercel**

---

## Component Architecture

### `/app/page.tsx`
- Layout root with two main sections:
  - `<Sidebar />`
  - `<MainGrid />`

### `<Sidebar />`
- Vertical list of category buttons.
- Maintains internal state of currently selected category (per tile slot).

### `<MainGrid />`
- Grid layout (1–4 tiles) using `react-grid-layout` or similar.
- Each tile is a `<Tile contentType="Music" />` component.
- Grid layout control in bottom-right corner.

### `<Tile />`
Props:
- `contentType: string`

Displays hardcoded data from a local content map:
```ts
const content = {
  Music: <iframe src="https://open.spotify.com/embed/playlist/xyz" ... />,
  Movies: <div>Movie images or trailers</div>,
  Videos: <video src="..." />,
  Colors: <div className="grid grid-cols-4">[color swatches]</div>,
  // etc.
}
