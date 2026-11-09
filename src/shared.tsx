import { Alert, Button, Empty, Space, Tag } from "antd";
import type { Student } from "./types";
export const genderLabels: Record<string, string> = {
  male: "ชาย",
  female: "หญิง",
};
export const currentYear = new Date().getFullYear() + 543;
export const fullName = (student: Student) =>
  `${student.prefix}${student.firstName} ${student.lastName}`;
export function ErrorNotice({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) {
  return error ? (
    <Alert
      className="error-notice"
      type="error"
      showIcon
      message="โหลดข้อมูลไม่สำเร็จ"
      description={error}
      action={<Button onClick={retry}>ลองใหม่</Button>}
    />
  ) : null;
}
export function EmptyData({
  text = "ยังไม่มีข้อมูล",
  description = "เพิ่มข้อมูลใหม่เพื่อเริ่มต้นใช้งาน",
}: {
  text?: string;
  description?: string;
}) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical" size={2}>
          <strong>{text}</strong>
          <span className="muted">{description}</span>
        </Space>
      }
    />
  );
}
export function RoomTag({ name }: { name?: string | null }) {
  return name ? (
    <Tag className="room-tag">{name}</Tag>
  ) : (
    <span className="muted">ยังไม่จัดห้อง</span>
  );
}
export interface PageProps {
  revision: number;
  onChange: () => void;
}
