"""Smart Preview extension loader for ComfyUI."""

from pathlib import Path

WEB_DIRECTORY = Path(__file__).resolve().parent / "web"

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

__all__ = [
    "WEB_DIRECTORY",
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
]
