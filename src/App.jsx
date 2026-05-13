import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import CandidateCard from "./components/CandidateCard";
import { capturePreviewToPngDataUrl } from "./utils/captureCandidatePng";

const STORAGE_KEY = "candidate_profiles_v1";

function sanitizeFileName(name) {
  const s = String(name || "candidate").replace(/[/\\?%*:|"<>]/g, "_").trim();
  return s.slice(0, 120) || "candidate";
}

function normalizeLines(value) {
  if (value === undefined || value === null) return [];
  return String(value)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRowToCandidate(row, index) {
  return {
    id: `${row[0] || "UV"}-${index}`,
    code: row[0] ? String(row[0]).trim() : "",
    position: row[1] ? String(row[1]).trim() : "",
    region: row[2] ? String(row[2]).trim() : "",
    salary: row[3] ? String(row[3]).trim() : "",
    experienceYears: row[4] ? String(row[4]).trim() : "",
    workExperiences: normalizeLines(row[5]),
    skills: normalizeLines(row[6]),
    workExperienceFontSize: "16px",
    skillsFontSize: "14px"
  };
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      Upload file Excel (.xlsx/.xls) để bắt đầu.
    </div>
  );
}

function App() {
  const [candidates, setCandidates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState({});
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const previewNodesRef = useRef({});
  const bulkToolbarSentinelRef = useRef(null);
  const bulkToolbarInnerRef = useRef(null);
  const [bulkToolbarPinned, setBulkToolbarPinned] = useState(false);
  const [bulkToolbarSpacerHeight, setBulkToolbarSpacerHeight] = useState(0);

  const registerPreviewRef = useCallback((id, node) => {
    if (node) previewNodesRef.current[id] = node;
    else delete previewNodesRef.current[id];
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const selectedCount = useMemo(
    () => Object.entries(selectedIds).filter(([, v]) => v).length,
    [selectedIds]
  );

  const filteredCandidates = useMemo(() => {
    if (!debouncedSearch) return candidates;
    return candidates.filter((candidate) => {
      const searchableContent = [
        candidate.code,
        candidate.region,
        candidate.salary,
        candidate.experienceYears,
        ...(candidate.workExperiences || []),
        ...(candidate.skills || [])
      ]
        .join(" ")
        .toLowerCase();
      return searchableContent.includes(debouncedSearch);
    });
  }, [candidates, debouncedSearch]);

  const candidateCountText = useMemo(() => {
    if (!debouncedSearch) return `${candidates.length} ứng viên`;
    return `${filteredCandidates.length}/${candidates.length} ứng viên`;
  }, [candidates.length, debouncedSearch, filteredCandidates.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSelectedIds({});
  }, [debouncedSearch]);

  useEffect(() => {
    if (candidates.length === 0 || filteredCandidates.length === 0) {
      setBulkToolbarPinned(false);
      return;
    }
    const sentinel = bulkToolbarSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const pin = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setBulkToolbarPinned(pin);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [candidates.length, filteredCandidates.length]);

  useLayoutEffect(() => {
    const el = bulkToolbarInnerRef.current;
    if (!el) return;
    const measure = () => {
      setBulkToolbarSpacerHeight(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [
    bulkToolbarPinned,
    bulkDownloading,
    selectedCount,
    filteredCandidates.length,
    candidates.length
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setCandidates(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (candidates.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      const parsed = rows
        .slice(1)
        .filter((row) => row.some((cell) => String(cell).trim() !== ""))
        .map(parseRowToCandidate);
      setCandidates(parsed);
      setEditingId(null);
      setSelectedIds({});
    } catch (uploadError) {
      setError(`Khong the doc file Excel: ${uploadError.message}`);
    } finally {
      event.target.value = "";
    }
  };

  const updateCandidateField = (id, key, value) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, [key]: value } : candidate
      )
    );
  };

  const handleClearLocalStorage = () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đã lưu trong localStorage không?"
    );
    if (!isConfirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    setCandidates([]);
    setEditingId(null);
    setError("");
    setSelectedIds({});
  };

  const selectAllVisible = () => {
    const next = {};
    filteredCandidates.forEach((c) => {
      next[c.id] = true;
    });
    setSelectedIds(next);
  };

  const clearSelection = () => setSelectedIds({});

  const downloadZipForList = async (list, baseZipName) => {
    setBulkDownloading(true);
    setError("");
    try {
      const zip = new JSZip();
      let count = 0;
      for (const c of list) {
        const node = previewNodesRef.current[c.id];
        if (!node) continue;
        const dataUrl = await capturePreviewToPngDataUrl(node);
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`${sanitizeFileName(c.code || c.id)}.png`, base64, { base64: true });
        count += 1;
      }
      if (count === 0) {
        setError("Không có ảnh để tải: preview chưa sẵn sàng hoặc danh sách rỗng.");
        return;
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${sanitizeFileName(baseZipName)}.zip`;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`Lỗi khi tạo ZIP: ${e.message}`);
    } finally {
      setBulkDownloading(false);
    }
  };

  const handleZipSelected = () => {
    const list = filteredCandidates.filter((c) => selectedIds[c.id]);
    downloadZipForList(list, `ung-vien-da-chon-${list.length}`);
  };

  const handleZipAllVisible = () => {
    downloadZipForList(filteredCandidates, `ung-vien-tat-ca-${filteredCandidates.length}`);
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] p-6">
      <header className="mb-6 rounded-xl bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Candidate Image Generator</h1>
        <p className="mt-1 text-sm text-slate-600">Upload Excel ({candidateCountText})</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <i className="fa-solid fa-file-arrow-up" />
            Upload Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            onClick={handleClearLocalStorage}
          >
            <i className="fa-solid fa-trash" />
            Xóa bộ nhớ
          </button>

          {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </div>
      </header>
      <div className="flex min-w-[260px] flex-1 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 mb-4">
        <i className="fa-solid fa-magnifying-glass mr-2 text-slate-400" />
        <input
          type="text"
          className="w-full border-none bg-transparent text-sm outline-none"
          placeholder="Tìm theo mã, khu vực, kinh nghiệm, lương, kỹ năng..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {candidates.length > 0 && filteredCandidates.length > 0 ? (
        <>
          <div
            ref={bulkToolbarSentinelRef}
            className="pointer-events-none h-px w-full shrink-0"
            aria-hidden
          />
          {bulkToolbarPinned ? (
            <div
              className="w-full shrink-0"
              style={{ height: bulkToolbarSpacerHeight }}
              aria-hidden
            />
          ) : null}
          <div
            ref={bulkToolbarInnerRef}
            className={
              bulkToolbarPinned
                ? "fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 py-3 shadow-md backdrop-blur-sm supports-[backdrop-filter]:bg-white/80"
                : "mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            }
          >
            <div
              className={`mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-2 ${
                bulkToolbarPinned ? "px-6" : ""
              }`}
            >
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={selectAllVisible}
                disabled={bulkDownloading}
              >
                Chọn tất cả hiển thị
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={clearSelection}
                disabled={bulkDownloading}
              >
                Bỏ chọn
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleZipSelected}
                disabled={bulkDownloading || selectedCount === 0}
              >
                <i className="fa-solid fa-file-zipper mr-2" />
                ZIP đã chọn ({selectedCount})
              </button>
              <button
                type="button"
                className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleZipAllVisible}
                disabled={bulkDownloading || filteredCandidates.length === 0}
              >
                <i className="fa-solid fa-download mr-2" />
                ZIP tất cả hiển thị ({filteredCandidates.length})
              </button>
              {bulkDownloading ? (
                <span className="text-sm text-slate-600">
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  Đang tạo file ZIP...
                </span>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {candidates.length === 0 ? (
        <EmptyState />
      ) : filteredCandidates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Không tìm thấy ứng viên phù hợp.
        </div>
      ) : (
        <section className="space-y-10 w-full overflow-x-auto">
          {filteredCandidates.map((candidate) => {
            const isEditing = editingId === candidate.id;
            return (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isEditing={isEditing}
                normalizeLines={normalizeLines}
                onToggleEdit={() =>
                  setEditingId((prev) => (prev === candidate.id ? null : candidate.id))
                }
                onUpdateField={(key, value) => updateCandidateField(candidate.id, key, value)}
                registerPreviewRef={registerPreviewRef}
                isSelected={!!selectedIds[candidate.id]}
                onToggleSelect={toggleSelect}
              />
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;
