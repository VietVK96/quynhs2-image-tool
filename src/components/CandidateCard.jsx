import { useEffect, useRef, useState } from "react";
import { capturePreviewToPngDataUrl } from "../utils/captureCandidatePng";
import CandidateEditForm from "./CandidateEditForm";
import CandidatePreview from "./CandidatePreview";

function CandidateCard({
  candidate,
  isEditing,
  normalizeLines,
  onToggleEdit,
  onUpdateField,
  registerPreviewRef,
  isSelected,
  onToggleSelect
}) {
  const previewRef = useRef(null);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    return () => {
      registerPreviewRef?.(candidate.id, null);
    };
  }, [candidate.id, registerPreviewRef]);

  const downloadCandidateImage = async () => {
    const node = previewRef.current;
    if (!node) return;
    setIsDownloading(true);
    try {
      const dataUrl = await capturePreviewToPngDataUrl(node);
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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          {onToggleSelect ? (
            <label className="inline-flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={!!isSelected}
                onChange={() => onToggleSelect(candidate.id)}
              />
                 Mã ứng viên: <span className="font-semibold text-slate-900">{candidate.code}</span>
            </label>
          ) : 
          <span>Mã ứng viên: <span className="font-semibold text-slate-900">{candidate.code}</span></span>}
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

      <CandidatePreview
        candidate={candidate}
        setCardRef={(node) => {
          previewRef.current = node;
          registerPreviewRef?.(candidate.id, node);
        }}
      />
    </article>
  );
}

export default CandidateCard;
