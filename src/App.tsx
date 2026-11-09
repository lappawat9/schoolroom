import { useState } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  BookOutlined,
  TeamOutlined,
  ReadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Students from "./Students";
import Classrooms from "./Classrooms";

export default function App() {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  const { pathname } = useLocation();
  const isClassroomPage = pathname.startsWith("/classrooms");
  const title = isClassroomPage ? "จัดการห้องเรียน" : "จัดการข้อมูลนักเรียน";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/students" className="brand">
          <span className="brand-icon">
            <ReadOutlined />
          </span>
          <div>Schoolroom</div>
        </NavLink>
        <div className="nav-caption">เมนูจัดการ</div>
        <nav aria-label="เมนูหลัก">
          <NavLink to="/students">
            <TeamOutlined />
            <span>ข้อมูลนักเรียน</span>
          </NavLink>
          <NavLink to="/classrooms">
            <BookOutlined />
            <span>ห้องเรียน</span>
          </NavLink>
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            ระบบจัดการนักเรียน <span>/</span> <strong>{title}</strong>
          </div>
          <span className="date-label">
            {new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(
              new Date(),
            )}
          </span>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <h1>{title}</h1>
              <p>
                {isClassroomPage
                  ? "ข้อมูลห้องเรียน ครูประจำชั้น และรายชื่อนักเรียนในห้อง"
                  : "เพิ่ม แก้ไข และค้นหาข้อมูลนักเรียน"}
              </p>
            </div>
            <Tooltip title="โหลดข้อมูลใหม่">
              <Button
                className="refresh-button"
                icon={<ReloadOutlined />}
                onClick={refresh}
                aria-label="โหลดข้อมูลใหม่"
              />
            </Tooltip>
          </div>
          <Routes>
            <Route
              path="/students"
              element={<Students revision={revision} onChange={refresh} />}
            />
            <Route
              path="/classrooms"
              element={<Classrooms revision={revision} onChange={refresh} />}
            />
            <Route path="*" element={<Navigate to="/students" replace />} />
          </Routes>
          <footer className="footer">ระบบจัดการนักเรียนและห้องเรียน</footer>
        </main>
      </div>
    </div>
  );
}
