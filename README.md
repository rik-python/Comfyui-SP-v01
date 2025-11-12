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
   > Prefer manual installation? Create the same folder structure and copy the **JavaScript** file `web/extensions/fullscreen_image_viewer.js` into it. (There is no JSON node file for this plugin.)
2. Restart ComfyUI. The JavaScript extension will be picked up automatically the next time the web UI loads.
3. Confirm the extension loaded by refreshing the ComfyUI page in your browser—there is no node called `fullscreen_image_viewer`. Instead, the preview thumbnails will gain a **View** button (see below).

### Using the viewer

Once loaded, this plugin augments the existing preview thumbnails—no extra graph node is required. Hover any generated image and click the new "View" button in the corner to open the fullscreen viewer, which includes:

- **Fit to screen** and **1:1** controls to switch between the natural image size and a screen-filling view.
- **Zoom in/out** actions, mouse wheel zooming, and double-click toggles between fit and 1:1.
- Keyboard shortcuts: `Esc` to close, `+`/`-` to zoom, `F` to fit, and `1` for 1:1.

To try it out, generate an image as usual, hover over the preview, and click **View** (top-right of the thumbnail). Close the viewer with the **Close** button or press `Esc` when you're done.
