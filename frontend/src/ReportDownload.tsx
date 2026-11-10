import { useRef, useState } from "react";
import { App, Button, Dropdown } from "antd";
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { api } from "./api";
import { STUDENT_REPORT } from "./queries";
import type { StudentReport } from "./report";

export default function ReportDownload() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);

  async function download(format: string) {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    try {
      const report = await api<StudentReport>(STUDENT_REPORT);
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
      setLoading(false);
    }
  }

  return (
    <Dropdown trigger={["click"]} disabled={loading} menu={{
      items: [
        { key: "pdf", label: "PDF (.pdf)", icon: <FilePdfOutlined /> },
        { key: "excel", label: "Excel (.xlsx)", icon: <FileExcelOutlined /> },
      ],
      onClick: ({ key }) => void download(key),
    }}>
      <Button icon={<DownloadOutlined />} loading={loading}
        title="รายงานนักเรียนอายุ 10–12 ปี ทุกห้องและทุกปีการศึกษา">
        ดาวน์โหลดรายงาน
      </Button>
    </Dropdown>
  );
}
