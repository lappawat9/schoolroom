import { Link, useSearchParams } from "react-router-dom";
import { ArrowRightOutlined, BookOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Progress, Select, Spin } from "antd";
import { DASHBOARD } from "./queries";
import { useRemote } from "./useRemote";
import { currentYear, ErrorNotice } from "./shared";
import type { DashboardSummary } from "./types";
import ReportDownload from "./ReportDownload";

export default function Dashboard({ revision }: { revision: number }) {
  const [params, setParams] = useSearchParams();
  const value = Number(params.get("academicYear"));
  const academicYear = Number.isInteger(value) && value >= 2400 && value <= 3000 ? value : undefined;
  const result = useRemote<DashboardSummary>(DASHBOARD, { academicYear }, revision);
  const summary = academicYear === undefined || result.data?.academicYear === academicYear ? result.data : undefined;
  const year = summary?.academicYear ?? academicYear ?? currentYear;
  const disabled = result.loading || !summary;
  const cards = [
    { title: "นักเรียนทั้งหมด", value: summary?.totalStudents, unit: "คน", hint: "นักเรียนที่ยังใช้งานอยู่ในระบบ",
      to: `/students?academicYear=${year}`, label: "ดูนักเรียนทั้งหมด", icon: <TeamOutlined />, color: "green" },
    { title: "ห้องเรียน", value: summary?.totalClassrooms, unit: "ห้อง", hint: `ห้องที่ใช้งานในปีการศึกษา ${year}`,
      to: `/classrooms?academicYear=${year}`, label: "ดูห้องเรียนในปีที่เลือก", icon: <BookOutlined />, color: "blue" },
    { title: "ยังไม่จัดห้อง", value: summary?.unassignedStudents, unit: "คน", hint: `ยังไม่มีห้องในปีการศึกษา ${year}`,
      to: `/students?academicYear=${year}&unassigned=true`, label: "ดูนักเรียนที่ยังไม่จัดห้อง", icon: <UserAddOutlined />, color: "amber" },
  ];
  const percent = summary?.totalStudents ? Math.round(summary.assignedStudents / summary.totalStudents * 100) : 0;
  return (
    <>
      <section className="dashboard-toolbar">
        <div className="dashboard-year">
          <label htmlFor="dashboard-year">ปีการศึกษา</label>
          <Select id="dashboard-year" value={year} style={{ width: 130 }}
            options={(summary?.academicYears ?? [year]).map((item) => ({ value: item, label: String(item) }))}
            onChange={(next) => setParams({ academicYear: String(next) })} />
        </div>
        <ReportDownload />
      </section>
      <p className="dashboard-description">
        นับนักเรียนที่ยังใช้งานอยู่ในระบบ ส่วนห้องเรียนและการจัดห้องอ้างอิงปีการศึกษาที่เลือก
      </p>
      <ErrorNotice error={result.error} retry={result.reload} />
      <Spin spinning={result.loading}>
        <div className="dashboard-cards">
          {cards.map((card) => <Link key={card.title} to={card.to} className="dashboard-card"
            aria-label={card.label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
            onClick={(event) => { if (disabled) event.preventDefault(); }}>
            <div className="dashboard-card-heading"><span className={`stat-icon ${card.color}`}>{card.icon}</span>
              <ArrowRightOutlined className="muted" /></div>
            <h2>{card.title}</h2>
            <div className="dashboard-value"><strong>{card.value?.toLocaleString("th-TH") ?? "—"}</strong><span>{card.unit}</span></div>
            <p>{card.hint}</p>
          </Link>)}
        </div>
      </Spin>
      <section className="panel dashboard-assignment">
        <div className="dashboard-assignment-heading">
          <div><h2>การจัดห้อง ปีการศึกษา {year}</h2><p>กดดูรายชื่อเพื่อจัดนักเรียนเข้าห้องเรียน</p></div>
          <strong>{summary ? `${summary.assignedStudents.toLocaleString("th-TH")} / ${summary.totalStudents.toLocaleString("th-TH")} คน` : "—"}</strong>
        </div>
        <Progress percent={percent} showInfo={false} strokeColor="#477855" trailColor="#edf1e7" />
        <div className="dashboard-assignment-footer">
          <span>{summary ? `จัดห้องแล้ว ${percent}% · ยังไม่จัดห้อง ${summary.unassignedStudents.toLocaleString("th-TH")} คน` : result.error ? "โหลดข้อมูลไม่สำเร็จ" : "กำลังโหลดข้อมูล"}</span>
          <Link to={`/classrooms?academicYear=${year}`} aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0} onClick={(event) => { if (disabled) event.preventDefault(); }}>
            จัดนักเรียนเข้าห้อง <ArrowRightOutlined />
          </Link>
        </div>
      </section>
    </>
  );
}
