import { useRef, useState } from "react";
import { App, Button, Modal, Space, Table, Tag } from "antd";
import { FileExcelOutlined, FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRemote } from "./useRemote";
import { ErrorNotice } from "./shared";
import { reportDate, reportSummary, type StudentReport } from "./report";

export default function ReportPreview({ onClose }: { onClose: () => void }) {
  const result = useRemote<StudentReport>("/reports/students");
  const { message } = App.useApp();
  const [exporting, setExporting] = useState<"pdf" | "excel">();
  const busy = useRef(false);
  const report = result.data;

  async function download(format: "pdf" | "excel") {
    if (!report || result.loading || busy.current) return;
    busy.current = true;
    setExporting(format);
    try {
      if (format === "pdf") {
        const { downloadPdf } = await import("./report-pdf");
        await downloadPdf(report);
      } else {
        const { downloadExcel } = await import("./report-excel");
        await downloadExcel(report);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "ดาวน์โหลดรายงานไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      busy.current = false;
      setExporting(undefined);
    }
  }

  const disabled = !report || result.loading || !!exporting;
  return (
    <Modal open title="ตัวอย่างรายงานนักเรียนอายุ 10–12 ปี" width={1060}
      onCancel={() => { if (!exporting) onClose(); }}
      closable={!exporting} maskClosable={!exporting} keyboard={!exporting}
      footer={<Space wrap>
        <Button onClick={onClose} disabled={!!exporting}>ปิด</Button>
        <Button icon={<ReloadOutlined />} aria-label="โหลดข้อมูลรายงานใหม่" onClick={result.reload}
          disabled={result.loading || !!exporting}>โหลดข้อมูลรายงานใหม่</Button>
        <Button icon={<FileExcelOutlined />} disabled={disabled}
          loading={exporting === "excel"} onClick={() => void download("excel")}>
          Excel (.xlsx)
        </Button>
        <Button type="primary" icon={<FilePdfOutlined />} disabled={disabled}
          loading={exporting === "pdf"} onClick={() => void download("pdf")}>
          PDF (.pdf)
        </Button>
      </Space>}>
      <p className="report-description">
        รวมข้อมูลทุกปีการศึกษา ไม่อิงตัวกรองบนหน้านักเรียน นักเรียนหนึ่งคนอาจมีหลายรายการห้อง
        ไฟล์ที่ดาวน์โหลดใช้ข้อมูลชุดเดียวกับตัวอย่างนี้
      </p>
      <ErrorNotice error={result.error} retry={result.reload} />
      {report && <div className="report-summary">
        <span>ข้อมูล ณ วันที่ {reportDate(report.asOfDate)}</span>
        <Tag>{reportSummary(report)}</Tag>
      </div>}
      <Table loading={result.loading} size="small" rowKey="key"
        dataSource={report?.rows.map((row, key) => ({ ...row, key })) ?? []}
        scroll={{ x: 900, y: 400 }}
        locale={{ emptyText: result.error ? "กรุณาลองโหลดข้อมูลใหม่" : "ไม่พบข้อมูลนักเรียนตามเงื่อนไข" }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50],
          showTotal: (total) => `ทั้งหมด ${total} แถว` }}
        columns={[
          { title: "รหัสนักเรียน", dataIndex: "studentCode", width: 120 },
          { title: "ชื่อ-นามสกุล", dataIndex: "fullName", width: 220 },
          { title: "เพศ", dataIndex: "gender", width: 70 },
          { title: "อายุ (ปี)", dataIndex: "age", width: 80 },
          { title: "เลขห้อง", dataIndex: "roomNumber", width: 90, render: (value) => value ?? "—" },
          { title: "ชื่อห้อง", dataIndex: "roomName", render: (value) => value ?? "ยังไม่มีห้อง" },
          { title: "ปีการศึกษา", dataIndex: "academicYear", width: 100, render: (value) => value ?? "—" },
        ]} />
    </Modal>
  );
}
