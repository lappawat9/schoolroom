export interface StudentReportRow {
  studentCode: string;
  fullName: string;
  gender: string;
  age: number;
  roomNumber: string | null;
  roomName: string | null;
  academicYear: number | null;
}

export interface StudentReport {
  asOfDate: string;
  rows: StudentReportRow[];
}

export const reportTitle = "รายงานนักเรียนอายุ 10-12 ปี";
export const reportColumns = [
  "รหัสนักเรียน", "ชื่อ-นามสกุล", "เพศ", "อายุ (ปี)",
  "เลขห้อง", "ชื่อห้อง", "ปีการศึกษา",
];

export function reportDate(date: string) {
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export function reportValues(row: StudentReportRow) {
  return [row.studentCode, row.fullName, row.gender, row.age,
    row.roomNumber ?? "", row.roomName ?? "", row.academicYear ?? ""];
}

export function reportSummary(report: StudentReport) {
  const students = new Set(report.rows.map((row) => row.studentCode)).size;
  return `นักเรียน ${students} คน · ข้อมูล ${report.rows.length} แถว`;
}

export function saveFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
