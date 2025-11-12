# Comfyui-SP-v01

Smart Preview tools for ComfyUI inspired by [TinyTerra's nodes](https://github.com/TinyTerra/ComfyUI_tinyterraNodes).

## Fullscreen image viewer

### Installation

1. Copy this repository into your ComfyUI `custom_nodes` folder (or clone it directly):
   ```bash
   cd /path/to/ComfyUI/custom_nodes
   git clone https://github.com/<your-account>/Comfyui-SP-v01.git
   ```
   The final layout should look like:
   ```
   ComfyUI/
   └── custom_nodes/
       └── Comfyui-SP-v01/
           └── web/extensions/fullscreen_image_viewer.js
   ```
   > Prefer manual installation? Create the same folder structure and copy `web/extensions/fullscreen_image_viewer.js` into it.
2. Restart ComfyUI. The JavaScript extension will be picked up automatically the next time the web UI loads.

### Using the viewer

This plugin adds a "View" button to every preview image inside the ComfyUI interface. Clicking the button opens a fullscreen viewer that includes:

- **Fit to screen** and **1:1** controls to switch between the natural image size and a screen-filling view.
- **Zoom in/out** actions, mouse wheel zooming, and double-click toggles between fit and 1:1.
- Keyboard shortcuts: `Esc` to close, `+`/`-` to zoom, `F` to fit, and `1` for 1:1.

To try it out, generate an image as usual, hover over the preview, and click **View** (top-right of the thumbnail). Close the viewer with the **Close** button or press `Esc` when you're done.
