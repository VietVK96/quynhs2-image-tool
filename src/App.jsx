import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import CandidateCard from "./components/CandidateCard";

const STORAGE_KEY = "candidate_profiles_v1";

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
    skills: normalizeLines(row[6])
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
          <div className="flex min-w-[260px] flex-1 items-center rounded-lg border border-slate-300 bg-white px-3 py-2">
            <i className="fa-solid fa-magnifying-glass mr-2 text-slate-400" />
            <input
              type="text"
              className="w-full border-none bg-transparent text-sm outline-none"
              placeholder="Tìm theo mã, khu vực, kinh nghiệm, lương, kỹ năng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </div>
      </header>

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
              />
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;
