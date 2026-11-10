import { useState } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ReportPreview from "./ReportPreview";

export default function ReportDownload() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<DownloadOutlined />} aria-label="ดาวน์โหลดรายงาน" onClick={() => setOpen(true)}>
        ดาวน์โหลดรายงาน
      </Button>
      {open && <ReportPreview onClose={() => setOpen(false)} />}
    </>
  );
}
