import { app } from "/scripts/app.js";

const SELECTOR = [
    "img.comfy-preview-image",
    "img.preview-image",
    "img.comfy-image",
    "img[data-element='image-preview']",
    "img[data-preview-image]"
].join(",");

app.registerExtension({
    name: "SP.FullscreenImageViewer",
    async setup() {
        const style = document.createElement("style");
        style.id = "sp-fullscreen-viewer-style";
        style.textContent = `
        #sp-fullscreen-overlay {
            position: fixed;
            inset: 0;
            background: rgba(6, 6, 6, 0.95);
            z-index: 10000;
            display: none;
            color: #e6e6e6;
            flex-direction: column;
            font-family: var(--comfy-ui-font, Inter, sans-serif);
        }
        #sp-fullscreen-overlay.active {
            display: flex;
        }
        #sp-fullscreen-overlay .sp-viewer-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            gap: 16px;
            background: rgba(16, 16, 16, 0.9);
            box-shadow: 0 0 18px rgba(0,0,0,0.45);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        #sp-fullscreen-overlay .sp-viewer-info {
            font-size: 14px;
            opacity: 0.75;
        }
        #sp-fullscreen-overlay .sp-viewer-buttons {
            display: flex;
            gap: 8px;
        }
        #sp-fullscreen-overlay button {
            background: rgba(64,64,64,0.35);
            border: 1px solid rgba(255,255,255,0.1);
            color: inherit;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s, border 0.2s;
        }
        #sp-fullscreen-overlay button:hover {
            background: rgba(128,128,128,0.4);
            border-color: rgba(255,255,255,0.22);
        }
        #sp-fullscreen-overlay button:active {
            transform: scale(0.97);
        }
        #sp-fullscreen-overlay .sp-viewer-canvas {
            flex: 1;
            position: relative;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #sp-fullscreen-overlay .sp-viewer-canvas img {
            max-width: none;
            max-height: none;
            border-radius: 8px;
            box-shadow: 0 0 32px rgba(0,0,0,0.4);
        }
        #sp-fullscreen-overlay .sp-viewer-close-area {
            position: absolute;
            inset: 0;
        }
        .sp-viewer-trigger {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 20;
            background: rgba(10, 10, 10, 0.7);
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.18);
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 6px;
            gap: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s, border 0.2s;
        }
        .sp-viewer-trigger:hover {
            background: rgba(32, 32, 32, 0.85);
            border-color: rgba(255,255,255,0.4);
        }
        .sp-viewer-trigger svg {
            width: 14px;
            height: 14px;
        }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement("div");
        overlay.id = "sp-fullscreen-overlay";
        overlay.innerHTML = `
            <div class="sp-viewer-toolbar">
                <div class="sp-viewer-info">—</div>
                <div class="sp-viewer-buttons">
                    <button data-action="fit" title="Fit to screen">Fit</button>
                    <button data-action="one" title="View 1:1">1:1</button>
                    <button data-action="zoom-in" title="Zoom in">+</button>
                    <button data-action="zoom-out" title="Zoom out">−</button>
                    <button data-action="close" title="Close">Close</button>
                </div>
            </div>
            <div class="sp-viewer-canvas">
                <img alt="Fullscreen preview" />
            </div>
        `;
        document.body.appendChild(overlay);

        const infoLabel = overlay.querySelector(".sp-viewer-info");
        const imageEl = overlay.querySelector("img");
        const canvasEl = overlay.querySelector(".sp-viewer-canvas");
        let naturalWidth = 0;
        let naturalHeight = 0;
        let currentZoom = 1;

        const MIN_ZOOM = 0.05;
        const MAX_ZOOM = 20;

        function updateInfo() {
            const percentage = Math.round(currentZoom * 1000) / 10;
            infoLabel.textContent = `${naturalWidth} × ${naturalHeight} — ${percentage}%`;
        }

        function applyZoom(zoom) {
            currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
            imageEl.style.width = `${naturalWidth * currentZoom}px`;
            imageEl.style.height = `${naturalHeight * currentZoom}px`;
            updateInfo();
        }

        function fitToScreen() {
            if (!naturalWidth || !naturalHeight) return;
            const bounds = canvasEl.getBoundingClientRect();
            const scale = Math.min(bounds.width / naturalWidth, bounds.height / naturalHeight);
            const finalScale = Number.isFinite(scale) ? Math.max(scale, MIN_ZOOM) : 1;
            applyZoom(finalScale);
        }

        function openWithSource(src) {
            if (!src) return;
            overlay.classList.add("active");
            const loader = new Image();
            loader.onload = () => {
                naturalWidth = loader.naturalWidth;
                naturalHeight = loader.naturalHeight;
                imageEl.src = src;
                requestAnimationFrame(() => {
                    fitToScreen();
                });
            };
            loader.src = src;
        }

        function closeViewer() {
            overlay.classList.remove("active");
            imageEl.src = "";
            naturalWidth = 0;
            naturalHeight = 0;
            currentZoom = 1;
        }

        overlay.addEventListener("click", (event) => {
            const action = event.target?.dataset?.action;
            if (action === "close") {
                closeViewer();
            } else if (action === "fit") {
                fitToScreen();
            } else if (action === "one") {
                if (naturalWidth && naturalHeight) {
                    applyZoom(1);
                }
            } else if (action === "zoom-in") {
                applyZoom(currentZoom * 1.25);
            } else if (action === "zoom-out") {
                applyZoom(currentZoom / 1.25);
            } else if (event.target === overlay) {
                closeViewer();
            }
        });

        canvasEl.addEventListener("wheel", (event) => {
            event.preventDefault();
            const direction = Math.sign(event.deltaY);
            const factor = direction > 0 ? 1 / 1.1 : 1.1;
            applyZoom(currentZoom * factor);
        }, { passive: false });

        canvasEl.addEventListener("dblclick", (event) => {
            event.preventDefault();
            if (currentZoom !== 1) {
                applyZoom(1);
            } else {
                fitToScreen();
            }
        });

        function onKeyDown(event) {
            if (!overlay.classList.contains("active")) return;
            if (event.key === "Escape") {
                closeViewer();
            } else if (event.key === "+" || event.key === "=") {
                applyZoom(currentZoom * 1.25);
            } else if (event.key === "-") {
                applyZoom(currentZoom / 1.25);
            } else if (event.key?.toLowerCase() === "f") {
                fitToScreen();
            } else if (event.key === "1") {
                applyZoom(1);
            }
        }
        document.addEventListener("keydown", onKeyDown);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    if (node.matches?.(SELECTOR)) {
                        attachTrigger(node);
                    }
                    node.querySelectorAll?.(SELECTOR).forEach((img) => attachTrigger(img));
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function attachTrigger(img) {
            if (!(img instanceof HTMLImageElement)) return;
            if (img.dataset.spViewerBound === "true") return;
            img.dataset.spViewerBound = "true";
            const parent = img.parentElement;
            if (!parent) return;
            const computed = window.getComputedStyle(parent);
            if (computed.position === "static") {
                parent.style.position = "relative";
            }
            const button = document.createElement("button");
            button.className = "sp-viewer-trigger";
            button.type = "button";
            button.title = "View fullscreen";
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M5 5h6V3H3v8h2V5zm14 0v6h2V3h-8v2h6zM5 13H3v8h8v-2H5v-6zm16 0h-2v6h-6v2h8v-8z"></path>
                </svg>
                View
            `;
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const src = img.currentSrc || img.src;
                if (src) {
                    openWithSource(src);
                }
            });
            parent.appendChild(button);
        }

        document.querySelectorAll(SELECTOR).forEach((img) => attachTrigger(img));
    },
});
