import ExcelJS from "exceljs";
import {
  reportColumns, reportDate, reportSummary, reportTitle, reportValues, saveFile,
  type StudentReport,
} from "./report";

export async function downloadExcel(report: StudentReport) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Schoolroom";
  const sheet = workbook.addWorksheet("นักเรียนอายุ 10-12 ปี", {
    views: [{ state: "frozen", ySplit: 6 }],
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true,
      fitToWidth: 1, fitToHeight: 0, printTitlesRow: "1:6" },
  });
  sheet.columns = [
    { width: 18 }, { width: 38 }, { width: 12 }, { width: 12 },
    { width: 16 }, { width: 28 }, { width: 17 },
  ];
  [reportTitle, `ข้อมูล ณ วันที่ ${reportDate(report.asOfDate)}`,
    reportSummary(report), "แสดงห้องที่ยังใช้งานทุกปีการศึกษา ช่องว่างหมายถึงยังไม่มีห้อง",
  ].forEach((text, index) => {
    const n = index + 1;
    sheet.mergeCells(n, 1, n, 7);
    sheet.getCell(n, 1).value = text;
    sheet.getRow(n).height = index === 0 ? 34 : 25;
  });
  sheet.getRow(6).values = reportColumns;
  report.rows.forEach((row) => sheet.addRow(reportValues(row)));
  if (!report.rows.length) {
    sheet.mergeCells("A7:G7");
    sheet.getCell("A7").value = "ไม่พบข้อมูลนักเรียนตามเงื่อนไข";
  }
  sheet.eachRow((row, index) => {
    row.font = { name: "Tahoma", size: 11, color: { argb: "FF253B32" } };
    row.alignment = { vertical: "middle", wrapText: true };
    if (index >= 6) {
      let height = 36;
      row.eachCell((cell, column) => {
        const width = Math.max(8, Number(sheet.getColumn(column).width || 20) - 2);
        height = Math.max(height, Math.ceil(cell.text.length / width) * 18 + 12);
      });
      row.height = height;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = { bottom: { style: "hair", color: { argb: "FFE1E7DC" } } };
        if (index === 6) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF173F35" } };
          cell.font = { name: "Tahoma", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        } else if (index % 2 === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6F0" } };
        }
      });
    }
  });
  sheet.getCell("A1").font = { name: "Tahoma", size: 18, bold: true, color: { argb: "FF173F35" } };
  sheet.getColumn(1).numFmt = "@";
  sheet.getColumn(5).numFmt = "@";
  sheet.getColumn(4).numFmt = "0";
  sheet.getColumn(7).numFmt = "0";
  sheet.autoFilter = { from: "A6", to: `G${report.rows.length ? sheet.rowCount : 6}` };
  const bytes = await workbook.xlsx.writeBuffer();
  saveFile(new Blob([new Uint8Array(bytes)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }), `schoolroom-report-${report.asOfDate}.xlsx`);
}
