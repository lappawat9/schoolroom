import { Button, Drawer, Spin, Tag, Timeline } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useRemote } from "./useRemote";
import { EmptyData, ErrorNotice, fullName } from "./shared";
import type { ClassroomHistory, Student } from "./types";

const dateTime = (value: string) => new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok",
}).format(new Date(value));

export default function StudentHistory({ student, revision, onClose }: {
  student: Student; revision: number; onClose: () => void;
}) {
  const result = useRemote<ClassroomHistory[]>(`/students/${student.id}/classroom-history`, revision);
  const entries = result.data ?? [];
  const years = [...new Set(entries.map((entry) => entry.academicYear))].sort((a, b) => b - a);
  return (
    <Drawer open title="ประวัติห้องเรียน" width={700} onClose={onClose}
      extra={<Button icon={<ReloadOutlined />} onClick={result.reload}
        disabled={result.loading} aria-label="โหลดประวัติใหม่" />}>
      <div className="history-student">
        <h2>{fullName(student)}</h2>
        <p>เลขประจำตัว {student.studentCode} · {student.gradeLevel}</p>
      </div>
      <p className="history-description">
        แสดงรายการจัดห้องที่ระบบเก็บไว้ รวมรายการที่สิ้นสุดแล้ว
        การสิ้นสุดอาจเกิดจากการย้ายห้อง นำออก หรือลบห้องเรียน
      </p>
      <ErrorNotice error={result.error} retry={result.reload} />
      <Spin spinning={result.loading}>
        <div className="history-content">
        {!result.loading && !result.error && !entries.length &&
          <EmptyData text="ยังไม่มีประวัติห้องเรียน" description="เมื่อจัดนักเรียนเข้าห้อง รายการจะแสดงที่นี่" />}
        {years.map((year) => <section className="history-year" key={year}>
          <h3>ปีการศึกษา {year}</h3>
          <Timeline items={entries.filter((entry) => entry.academicYear === year).map((entry) => ({
            color: entry.isActive ? "green" : "gray",
            children: <div className="history-entry" key={entry.id}>
              <div className="history-entry-heading">
                <strong>{entry.roomName ?? "ไม่พบข้อมูลห้อง"}</strong>
                <Tag color={entry.isActive ? "green" : undefined}>
                  {entry.classroomDeleted ? "ห้องถูกลบ" : entry.isActive ? "อยู่ในห้องนี้" : "สิ้นสุดการอยู่ห้อง"}
                </Tag>
              </div>
              <p>เลขห้อง {entry.roomNumber ?? "—"}</p>
              <p>เพิ่มเข้าห้อง {dateTime(entry.addedAt)}</p>
              {entry.endedAt && <p>สิ้นสุด {dateTime(entry.endedAt)}</p>}
            </div>,
          }))} />
        </section>)}
        </div>
      </Spin>
      {!!entries.length && <p className="history-footnote">
        เวลาแสดงตามประเทศไทย ชื่อห้องและปีการศึกษาอ้างอิงข้อมูลที่ระบบเก็บไว้
      </p>}
    </Drawer>
  );
}
