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
  DashboardOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Students from "./Students";
import Classrooms from "./Classrooms";
import Dashboard from "./Dashboard";

export default function App() {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  const { pathname } = useLocation();
  const isClassroomPage = pathname.startsWith("/classrooms");
  const isDashboardPage = pathname === "/" || pathname.startsWith("/dashboard");
  const title = isDashboardPage ? "ภาพรวมระบบ" : isClassroomPage ? "จัดการห้องเรียน" : "จัดการข้อมูลนักเรียน";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand">
          <img className="brand-icon" src="/icons/schoolroom.svg" alt="" width={44} height={44} />
          <div>Schoolroom</div>
        </NavLink>
        <div className="nav-caption">เมนูจัดการ</div>
        <nav aria-label="เมนูหลัก">
          <NavLink to="/dashboard"><DashboardOutlined /><span>ภาพรวม</span></NavLink>
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
        <main>
          <div className="page-heading">
            <div>
              <h1>{title}</h1>
              <p>
                {isDashboardPage ? "สรุปนักเรียน ห้องเรียน และการจัดห้องตามปีการศึกษา" : isClassroomPage
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
            <Route path="/dashboard" element={<Dashboard revision={revision} />} />
            <Route
              path="/students"
              element={<Students revision={revision} onChange={refresh} />}
            />
            <Route
              path="/classrooms"
              element={<Classrooms revision={revision} onChange={refresh} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
