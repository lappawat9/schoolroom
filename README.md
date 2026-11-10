# Schoolroom · REST Frontend

ส่วนเว็บของโปรเจกต์ส่วนตัว Schoolroom ใช้ React + Vite + Ant Design + TypeScript เรียก REST API ใน branch [rest-back](https://github.com/lappawat9/schoolroom/tree/rest-back)

## เริ่มพัฒนา

```powershell
git clone --branch rest-front --single-branch https://github.com/lappawat9/schoolroom.git schoolroom-rest-front
cd schoolroom-rest-front
npm ci
Copy-Item .env.example .env
npm run dev
```

ใช้ Node.js 24.x และตั้ง VITE_API_URL=http://localhost:3000/api เปิดเว็บที่ http://localhost:5173 หาก PowerShell บล็อก npm.ps1 ใช้ npm.cmd แทน npm

## การใช้งาน

- เพิ่ม แก้ไข ลบ ค้นหานักเรียนและห้องเรียน พร้อมแบ่งหน้า
- ค้นชื่อเรียงชื่อที่ขึ้นต้นคำค้นก่อน ตามด้วยนามสกุลที่ขึ้นต้นและข้อความที่มีคำค้นอยู่ข้างใน รองรับครูและสมาชิกในห้องด้วย
- จัดนักเรียนเข้าห้อง ย้ายห้อง นำออก และเก็บประวัติแยกปีการศึกษา
- ตรวจข้อมูลซ้ำ วันเกิด และการเปลี่ยนปีของห้องที่ทำให้นักเรียนมีสองห้องในปีเดียวกัน
- ดาวน์โหลดรายงานนักเรียนอายุ 10-12 ปีเป็น PDF ภาษาไทยและ Excel (.xlsx) ตามเงื่อนไขใน Report.sql

## ดาวน์โหลดรายงาน

ปุ่ม **ดาวน์โหลดรายงาน** อยู่บนหน้าภาพรวมและหน้านักเรียน เลือก PDF หรือ Excel ได้ รายงานดึงทุกแถวตามเงื่อนไขอายุ 10-12 ปีจากฐานข้อมูล ไม่จำกัดตามตัวกรองหรือหน้าตารางที่กำลังเปิด นักเรียนหนึ่งคนอาจมีหลายแถวตามปีการศึกษา ส่วนคนที่ไม่มีห้องจะแสดงช่องห้องว่าง

Frontend เรียก `GET /api/reports/students` แล้วสร้างไฟล์ในเบราว์เซอร์ด้วย report-pdf.ts และ report-excel.ts วันที่ asOfDate มาจาก MySQL และใช้วันที่เดียวกันคำนวณอายุ PDF ใช้ฟอนต์ Sarabun พร้อมใบอนุญาต OFL ใน public/fonts

## Build และ deploy

```powershell
npm run build
npm run preview
```

ใช้ Node.js 24.x บน Vercel แยกสองโปรเจกต์ โดยเลือก branch rest-front สำหรับ Vite และ rest-back สำหรับ NestJS ทั้งคู่ใช้ Root Directory เป็น root ของ branch

ตั้ง DB_* และ FRONTEND_ORIGIN บน Backend แล้วตั้ง VITE_API_URL ของ Frontend เป็น `https://<backend-domain>/api` ก่อน build โดยยังใช้ฐานข้อมูล schema เดิมและปิด synchronize ไว้

เว็บที่ schoolroom-web.vercel.app ปัจจุบันใช้ GraphQL สามารถ deploy รุ่น REST คู่นี้ไปโดเมนของคุณ หรือสลับทั้งสองโปรเจกต์กลับเป็น REST พร้อมเปลี่ยน env ให้ตรงรุ่นได้ โค้ด GraphQL อยู่ที่ main/front/back ส่วน REST ดั้งเดิมก่อนเพิ่มรายงานและการเรียงค้นหาเก็บไว้ที่ tag rest-baseline-main, rest-baseline-front, rest-baseline-back

เมื่อแก้ Frontend ให้ commit และ push ด้วย git push origin rest-front


## ตัวอย่างรายงานและประวัติห้องเรียน

กด **ดาวน์โหลดรายงาน** เพื่อดูตัวอย่างก่อนส่งออก มีวันที่ข้อมูล จำนวนนักเรียนไม่ซ้ำ จำนวนแถว และตารางแบ่งหน้า PDF และ Excel ใช้ข้อมูลชุดเดียวกับตัวอย่าง หากต้องการข้อมูลล่าสุดให้กด **โหลดข้อมูลรายงานใหม่**

กดชื่อนักเรียนหรือปุ่มประวัติเพื่อดูรายการจัดห้องแยกตามปีการศึกษา แสดงวันที่เพิ่ม วันที่สิ้นสุด สถานะปัจจุบัน และห้องที่ถูกลบ โดยอ่านทั้งรายการปกติและ soft delete จาก classroom_students

REST endpoint สำหรับประวัติคือ `GET /api/students/:id/classroom-history` มี response schema ใน Swagger

ประวัติแสดงเท่าที่ฐานข้อมูลเก็บไว้ ไม่มีข้อมูลผู้ดำเนินการหรือเหตุผลแยกว่าย้ายห้อง/นำออก/ลบห้อง จึงใช้คำว่า “สิ้นสุดการอยู่ห้อง” ชื่อห้องอ่านจากข้อมูลห้องที่มีอยู่ และปีการศึกษาใช้ค่าที่เก็บในรายการจัดห้อง หากแก้ข้อมูลเดิม ประวัติส่วนนี้อาจเปลี่ยนตาม ไม่ใช่ snapshot การแก้ไขทุกครั้ง

## ภาพรวมระบบ

หน้าแรก /dashboard แสดงจำนวนนักเรียนทั้งหมด ห้องเรียน และนักเรียนที่ยังไม่จัดห้อง พร้อมเลือกปีการศึกษาและกดการ์ดเพื่อเปิดรายชื่อที่ตรงกับตัวเลข มีสัดส่วนการจัดห้องและปุ่มเปิดตัวอย่างรายงานด้วย

ยอดนักเรียนทั้งหมดนับเฉพาะคนที่ยังใช้งานอยู่ในปัจจุบัน ส่วนห้องเรียนและสถานะจัดห้องอิงปีที่เลือก ไม่ใช่ยอดนักเรียนย้อนหลัง คนที่มีห้องเฉพาะปีอื่นยังถือว่ายังไม่จัดห้องในปีที่เลือก ห้องและรายการจัดห้องที่ถูก soft delete ไม่นับรวม ปีเริ่มต้นใช้ปี พ.ศ. ปัจจุบันจาก MySQL

หน้านักเรียนเลือกปีและกรองได้ทั้งทั้งหมด / จัดห้องแล้ว / ยังไม่จัดห้อง คอลัมน์ห้องเรียนแสดงห้องในปีที่เลือก หน้าห้องเรียนกรองปีได้หรือเว้นว่างเพื่อดูทุกปี URL เก็บปีและสถานะจัดห้องไว้ จึงโหลดหน้าใหม่หรือส่งลิงก์ต่อได้

`GET /api/dashboard?academicYear=2569` คืน `academicYear`, `academicYears`, `totalStudents`, `totalClassrooms`, `assignedStudents` และ `unassignedStudents` หากไม่ส่งปีใช้ `GET /api/dashboard` หน้านักเรียนใช้ `GET /api/students?academicYear=2569&unassigned=true` (false = จัดห้องแล้ว) ห้องเรียนใช้ `GET /api/classrooms?academicYear=2569` ทุกปีรับจำนวนเต็ม พ.ศ. 2400–3000 มีคำอธิบายใน Swagger
