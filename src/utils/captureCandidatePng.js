import { toPng } from "html-to-image";

export async function waitForImagesLoaded(rootElement) {
  const images = Array.from(rootElement.querySelectorAll("img"));
  if (images.length === 0) return;
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    })
  );
}

/**
 * @param {HTMLElement} node - live preview root
 * @returns {Promise<string>} data URL (image/png)
 */
export async function capturePreviewToPngDataUrl(node) {
  let hiddenRoot = null;
  try {
    const exportNode = node.cloneNode(true);
    exportNode.style.width = "900px";
    exportNode.style.height = "900px";
    exportNode.style.maxWidth = "900px";
    exportNode.style.margin = "0";

    hiddenRoot = document.createElement("div");
    hiddenRoot.style.position = "fixed";
    hiddenRoot.style.left = "-100000px";
    hiddenRoot.style.top = "0";
    hiddenRoot.style.opacity = "0";
    hiddenRoot.style.pointerEvents = "none";
    hiddenRoot.appendChild(exportNode);
    document.body.appendChild(hiddenRoot);

    await waitForImagesLoaded(exportNode);
    const dataUrl = await toPng(exportNode, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "transparent",
      width: 900,
      height: 900,
      canvasWidth: 900,
      canvasHeight: 900
    });

    return dataUrl;
  } finally {
    if (hiddenRoot?.parentNode) hiddenRoot.parentNode.removeChild(hiddenRoot);
  }
}
