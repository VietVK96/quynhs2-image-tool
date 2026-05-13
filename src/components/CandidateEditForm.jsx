import { useEffect, useState } from "react";

function CandidateEditForm({ candidate, normalizeLines, onUpdateField, onBulkUpdateField }) {
  const [workExperiencesText, setWorkExperiencesText] = useState(
    candidate.workExperiences.join("\n")
  );
  const [skillsText, setSkillsText] = useState(candidate.skills.join("\n"));
  const [applyWorkExpFontToAll, setApplyWorkExpFontToAll] = useState(true);
  const [applySkillsFontToAll, setApplySkillsFontToAll] = useState(true);

  useEffect(() => {
    setWorkExperiencesText(candidate.workExperiences.join("\n"));
  }, [candidate.workExperiences]);

  useEffect(() => {
    setSkillsText(candidate.skills.join("\n"));
  }, [candidate.skills]);

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 md:grid-cols-2">
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={candidate.code} placeholder="Ma ung vien" onChange={(e) => onUpdateField("code", e.target.value)} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={candidate.position} placeholder="Vi tri ung tuyen" onChange={(e) => onUpdateField("position", e.target.value)} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={candidate.region} placeholder="Khu vuc" onChange={(e) => onUpdateField("region", e.target.value)} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={candidate.salary} placeholder="Muc luong" onChange={(e) => onUpdateField("salary", e.target.value)} />
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={candidate.experienceYears} placeholder="Nam kinh nghiem" onChange={(e) => onUpdateField("experienceYears", e.target.value)} />
      <textarea
        rows={4}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={workExperiencesText}
        placeholder="Kinh nghiem lam viec (moi dong 1 muc)"
        onChange={(e) => setWorkExperiencesText(e.target.value)}
        onBlur={() => onUpdateField("workExperiences", normalizeLines(workExperiencesText))}
      />
      <div className="">
        <label
          className="mb-1 block text-xs font-medium text-slate-600"
          htmlFor={`work-exp-font-${candidate.id}`}
        >
          Cỡ chữ kinh nghiệm làm việc
        </label>
        <input
          id={`work-exp-font-${candidate.id}`}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="text"
          value={candidate.workExperienceFontSize ?? "16px"}
          placeholder="16px"
          onChange={(e) => {
            const next = e.target.value.trim() || "16px";
            if (applyWorkExpFontToAll && onBulkUpdateField) {
              onBulkUpdateField("workExperienceFontSize", next);
            } else {
              onUpdateField("workExperienceFontSize", next);
            }
          }}
        />
        <p className="mt-1 text-xs text-slate-500">Ví dụ: 16px, 18px. Mặc định: 16px.</p>
        {onBulkUpdateField ? (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-700 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={applyWorkExpFontToAll}
              onChange={(e) => {
                const checked = e.target.checked;
                setApplyWorkExpFontToAll(checked);
                if (checked) {
                  onBulkUpdateField(
                    "workExperienceFontSize",
                    candidate.workExperienceFontSize ?? "16px"
                  );
                }
              }}
            />
            Áp dụng cỡ chữ này cho tất cả ảnh
          </label>
        ) : null}
      </div>
      <textarea
        rows={4}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={skillsText}
        placeholder="Ky nang (moi dong 1 muc)"
        onChange={(e) => setSkillsText(e.target.value)}
        onBlur={() => onUpdateField("skills", normalizeLines(skillsText))}
      />
      <div className="">
        <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={`skills-font-${candidate.id}`}>
          Cỡ chữ thẻ kỹ năng
        </label>
        <input
          id={`skills-font-${candidate.id}`}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="text"
          value={candidate.skillsFontSize ?? "14px"}
          placeholder="14px"
          onChange={(e) => {
            const next = e.target.value.trim() || "14px";
            if (applySkillsFontToAll && onBulkUpdateField) {
              onBulkUpdateField("skillsFontSize", next);
            } else {
              onUpdateField("skillsFontSize", next);
            }
          }}
        />
        <p className="mt-1 text-xs text-slate-500">Ví dụ: 14px, 16px. Mặc định: 14px.</p>
        {onBulkUpdateField ? (
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-700 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={applySkillsFontToAll}
              onChange={(e) => {
                const checked = e.target.checked;
                setApplySkillsFontToAll(checked);
                if (checked) {
                  onBulkUpdateField("skillsFontSize", candidate.skillsFontSize ?? "14px");
                }
              }}
            />
            Áp dụng cỡ chữ này cho tất cả ảnh
          </label>
        ) : null}
      </div>
    </div>
  );
}

export default CandidateEditForm;
