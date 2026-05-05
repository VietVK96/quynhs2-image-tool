import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import CandidateEditForm from "./CandidateEditForm";
import CandidatePreview from "./CandidatePreview";

async function waitForImagesLoaded(rootElement) {
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

function CandidateCard({ candidate, isEditing, normalizeLines, onToggleEdit, onUpdateField }) {
  const previewRef = useRef(null);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCandidateImage = async () => {
    const node = previewRef.current;
    if (!node) return;
    let hiddenRoot = null;
    setIsDownloading(true);
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

      if (hiddenRoot.parentNode) hiddenRoot.parentNode.removeChild(hiddenRoot);

      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `${candidate.code || candidate.id}.png`;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setDownloadError("");
    } catch (error) {
      setDownloadError(`Khong the download anh: ${error.message}`);
      if (hiddenRoot?.parentNode) hiddenRoot.parentNode.removeChild(hiddenRoot);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Mã ứng viên: <span className="font-semibold text-slate-900">{candidate.code}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900" onClick={onToggleEdit}>
            <i className="fa-solid fa-pen-to-square mr-2" />
            {isEditing ? "Done" : "Edit"}
          </button>
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={downloadCandidateImage}
            disabled={isDownloading}
          >
            <i className={`mr-2 fa-solid ${isDownloading ? "fa-spinner fa-spin" : "fa-download"}`} />
            {isDownloading ? "Dang tai..." : "Download"}
          </button>
        </div>
      </div>

      {downloadError ? <p className="mb-3 text-sm text-red-600">{downloadError}</p> : null}

      {isEditing ? (
        <CandidateEditForm
          candidate={candidate}
          normalizeLines={normalizeLines}
          onUpdateField={onUpdateField}
        />
      ) : null}

      <CandidatePreview candidate={candidate} setCardRef={(node) => { previewRef.current = node; }} />
    </article>
  );
}

export default CandidateCard;
