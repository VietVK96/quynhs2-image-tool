import * as XLSX from "xlsx";

/** Tiêu đề cột — khớp thứ tự parse trong App.jsx (slice(1) = bỏ dòng đầu làm header) */
export const SAMPLE_EXCEL_HEADERS = [
  "Mã ứng viên",
  "Vị trí ứng tuyển",
  "Khu vực",
  "Mức lương",
  "Năm kinh nghiệm",
  "Kinh nghiệm làm việc",
  "Kỹ năng"
] as const;

/** Một dòng dữ liệu ứng viên (7 cột) */
export type SampleCandidateRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

const POSITIONS = [
  "Nhân viên Tuyển dụng",
  "Chuyên viên HRBP",
  "Nhân viên Hành chính Nhân sự",
  "Chuyên viên Đào tạo",
  "Nhân viên C&B",
  "Intern Talent Acquisition",
  "Chuyên viên Tuyển dụng IT",
  "Nhân sự tổng hợp"
] as const;

const REGIONS = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Bình Dương",
  "Remote",
  "Hà Nội / Hybrid"
] as const;

const WORK_LINES = [
  "Hỗ trợ đăng tin và sàng lọc CV",
  "Phỏng vấn sơ loại qua điện thoại",
  "Phối hợp lịch phỏng vấn với hiring manager",
  "Cập nhật ATS / bảng theo dõi ứng viên",
  "Tham gia job fair và sourcing LinkedIn"
] as const;

const SKILL_LINES = [
  "LinkedIn Recruiter",
  "TopCV / VietnamWorks",
  "Excel / Google Sheets",
  "Giao tiếp tiếng Anh",
  "ATS (Greenhouse / Workable)",
  "Lập kế hoạch tuyển dụng"
] as const;

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length] as T;
}

function buildRow(index1Based: number): SampleCandidateRow {
  const i = index1Based - 1;
  const code = `UV${String(index1Based).padStart(4, "0")}`;
  const position = pick(POSITIONS, i);
  const region = pick(REGIONS, i);
  const salaryLow = 8 + (i % 7);
  const salaryHigh = salaryLow + 2 + (i % 3);
  const salary = `${salaryLow}-${salaryHigh}M`;
  const years = `${1 + (i % 6)} năm`;

  const w1 = pick(WORK_LINES, i);
  const w2 = pick(WORK_LINES, i + 2);
  const w3 = pick(WORK_LINES, i + 4);
  const workCell = [w1, w2, w3].join("\n");

  const s1 = pick(SKILL_LINES, i);
  const s2 = pick(SKILL_LINES, i + 1);
  const s3 = pick(SKILL_LINES, i + 3);
  const skillsCell = [s1, s2, s3].join("\n");

  return [code, position, region, salary, years, workCell, skillsCell];
}

/** Tạo mảng 2D: dòng 1 = header, 100 dòng dữ liệu */
export function buildSampleSheetRows100(): string[][] {
  const rows: string[][] = [Array.from(SAMPLE_EXCEL_HEADERS)];
  for (let n = 1; n <= 100; n += 1) {
    rows.push([...buildRow(n)]);
  }
  return rows;
}

/** Tải file .xlsx 100 ứng viên (fake) */
export function downloadSampleExcel100Candidates(): void {
  const rows = buildSampleSheetRows100();
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 12 },
    { wch: 32 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 42 },
    { wch: 36 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, "UngVien");
  XLSX.writeFile(wb, "mau-100-ung-vien.xlsx");
}
