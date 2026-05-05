import { useEffect, useState } from "react";

function CandidateEditForm({ candidate, normalizeLines, onUpdateField }) {
  const [workExperiencesText, setWorkExperiencesText] = useState(
    candidate.workExperiences.join("\n")
  );
  const [skillsText, setSkillsText] = useState(candidate.skills.join("\n"));

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
      <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={candidate.experienceYears} placeholder="Nam kinh nghiem" onChange={(e) => onUpdateField("experienceYears", e.target.value)} />
      <textarea
        rows={4}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={workExperiencesText}
        placeholder="Kinh nghiem lam viec (moi dong 1 muc)"
        onChange={(e) => setWorkExperiencesText(e.target.value)}
        onBlur={() => onUpdateField("workExperiences", normalizeLines(workExperiencesText))}
      />
      <textarea
        rows={4}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={skillsText}
        placeholder="Ky nang (moi dong 1 muc)"
        onChange={(e) => setSkillsText(e.target.value)}
        onBlur={() => onUpdateField("skills", normalizeLines(skillsText))}
      />
    </div>
  );
}

export default CandidateEditForm;
