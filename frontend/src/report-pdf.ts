import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions, TableCell } from "pdfmake/interfaces";
import {
  reportColumns, reportDate, reportSummary, reportTitle, reportValues, saveFile,
  type StudentReport,
} from "./report";

export async function downloadPdf(report: StudentReport) {
  const font = (name: string) => new URL(`/fonts/${name}`, window.location.origin).href;
  pdfMake.addFonts({
    Sarabun: {
      normal: font("Sarabun-Regular.ttf"), bold: font("Sarabun-Bold.ttf"),
      italics: font("Sarabun-Regular.ttf"), bolditalics: font("Sarabun-Bold.ttf"),
    },
  });
  const body: TableCell[][] = [
    reportColumns.map((text) => ({ text, bold: true, color: "#ffffff", fillColor: "#173f35" })),
    ...report.rows.map((row) => reportValues(row).map((value) => ({ text: String(value) }))),
  ];
  if (!report.rows.length) body.push([
    { text: "ไม่พบข้อมูลนักเรียนตามเงื่อนไข", colSpan: 7, alignment: "center" },
    {}, {}, {}, {}, {}, {},
  ]);
  const document: TDocumentDefinitions = {
    pageSize: "A4", pageOrientation: "landscape", pageMargins: [32, 32, 32, 42],
    info: { title: reportTitle, author: "Schoolroom" },
    defaultStyle: { font: "Sarabun", fontSize: 10, color: "#253b32" },
    content: [
      { text: "SCHOOLROOM", fontSize: 10, color: "#607f58", margin: [0, 0, 0, 6] },
      { text: reportTitle, bold: true, fontSize: 20, margin: [0, 0, 0, 8] },
      { text: `ข้อมูล ณ วันที่ ${reportDate(report.asOfDate)} · ${reportSummary(report)}`, margin: [0, 0, 0, 5] },
      { text: "แสดงห้องที่ยังใช้งานทุกปีการศึกษา ช่องว่างหมายถึงยังไม่มีห้อง", color: "#637268", margin: [0, 0, 0, 16] },
      { table: { headerRows: 1, dontBreakRows: true,
        widths: [65, "*", 40, 45, 65, 100, 65], body },
        layout: {
          hLineWidth: () => 0.5, vLineWidth: () => 0,
          hLineColor: () => "#e1e7dc",
          paddingTop: () => 7, paddingBottom: () => 7,
          paddingLeft: () => 8, paddingRight: () => 8,
          fillColor: (index: number) => index > 0 && index % 2 === 1 ? "#f3f6f0" : null,
        },
      },
    ],
    footer: (current, total) => ({
      columns: [{ text: "Schoolroom · รายงานนักเรียน", color: "#637268" },
        { text: `หน้า ${current} / ${total}`, alignment: "right", color: "#637268" }],
      margin: [32, 12, 32, 0], fontSize: 9,
    }),
  };
  const blob = await pdfMake.createPdf(document).getBlob();
  saveFile(blob, `schoolroom-report-${report.asOfDate}.pdf`);
}
