# Schoolroom · REST Backend

REST API ของโปรเจกต์ส่วนตัว Schoolroom ใช้ NestJS + TypeORM + MySQL + TypeScript ใช้คู่กับ Frontend ใน branch [rest-front](https://github.com/lappawat9/schoolroom/tree/rest-front)

## เริ่มพัฒนา

```powershell
git clone --branch rest-back --single-branch https://github.com/lappawat9/schoolroom.git schoolroom-rest-back
cd schoolroom-rest-back
npm ci
Copy-Item .env.example .env
npm run dev
```

ใช้ Node.js 24.x ตั้ง DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SSL, DB_POOL_SIZE และ FRONTEND_ORIGIN ตาม .env.example โดยไม่ commit ค่าจริง

## API

เปิด Swagger http://localhost:3000/api/docs เพื่อทดลองทุก endpoint หรือดู OpenAPI JSON ที่ http://localhost:3000/api/docs-json

| การทำงาน | Endpoint |
| --- | --- |
| ตรวจระบบและฐานข้อมูล | GET /api/health |
| ข้อมูลอ้างอิง | GET /api/lookups |
| ค้นหา / เพิ่มนักเรียน | GET / POST /api/students |
| ดู / แก้ไข / ลบนักเรียน | GET / PATCH / DELETE /api/students/:id |
| ค้นหา / เพิ่มห้อง | GET / POST /api/classrooms |
| ดู / แก้ไข / ลบห้อง | GET / PATCH / DELETE /api/classrooms/:id |
| นักเรียนในห้อง | GET /api/classrooms/:id/students |
| เพิ่มหรือย้ายเข้าห้อง / นำออก | PUT / DELETE /api/classrooms/:id/students/:studentId |
| ประวัติห้องเรียนของนักเรียน | GET /api/students/:id/classroom-history |
| รายงานอายุ 10-12 ปี | GET /api/reports/students |

GET students รองรับ studentCode, name, gradeLevelId, page และ pageSize ส่วน GET classrooms รองรับ roomNumber, name, teacherName, page และ pageSize โดย pageSize สูงสุด 100 ข้อผิดพลาดใช้ HTTP status 400/404/409 ตามกรณี

Controller และ Service ของ students/classrooms/reports แยกไฟล์กัน การลบเป็น soft delete และการจัดห้องใช้ transaction เพื่อให้เหลือหนึ่งห้องต่อปีการศึกษา

- เพิ่ม แก้ไข ลบ ค้นหานักเรียนและห้องเรียน พร้อมแบ่งหน้า
- ค้นชื่อเรียงชื่อที่ขึ้นต้นคำค้นก่อน ตามด้วยนามสกุลที่ขึ้นต้นและข้อความที่มีคำค้นอยู่ข้างใน รองรับครูและสมาชิกในห้องด้วย
- จัดนักเรียนเข้าห้อง ย้ายห้อง นำออก และเก็บประวัติแยกปีการศึกษา
- ตรวจข้อมูลซ้ำ วันเกิด และการเปลี่ยนปีของห้องที่ทำให้นักเรียนมีสองห้องในปีเดียวกัน
- ดาวน์โหลดรายงานนักเรียนอายุ 10-12 ปีเป็น PDF ภาษาไทยและ Excel (.xlsx) ตามเงื่อนไขใน Report.sql

## รายงาน

ปุ่ม **ดาวน์โหลดรายงาน** อยู่บนหน้านักเรียน เลือก PDF หรือ Excel ได้ รายงานดึงทุกแถวตามเงื่อนไขอายุ 10-12 ปีจากฐานข้อมูล ไม่จำกัดตามตัวกรองหรือหน้าตารางที่กำลังเปิด นักเรียนหนึ่งคนอาจมีหลายแถวตามปีการศึกษา ส่วนคนที่ไม่มีห้องจะแสดงช่องห้องว่าง

Frontend เรียก `GET /api/reports/students` แล้วสร้างไฟล์ในเบราว์เซอร์ด้วย report-pdf.ts และ report-excel.ts วันที่ asOfDate มาจาก MySQL และใช้วันที่เดียวกันคำนวณอายุ PDF ใช้ฟอนต์ Sarabun พร้อมใบอนุญาต OFL ใน public/fonts

ReportService ใช้ SQL เงื่อนไขเดียวกับ Report.sql คืน {asOfDate, rows} แต่ละแถวมี studentCode, fullName, gender, age, roomNumber, roomName และ academicYear โดยข้อมูลห้องเป็น null ได้

## Build และ deploy

```powershell
npm run build
npm start
```

ใช้ Node.js 24.x บน Vercel แยกสองโปรเจกต์ โดยเลือก branch rest-front สำหรับ Vite และ rest-back สำหรับ NestJS ทั้งคู่ใช้ Root Directory เป็น root ของ branch

ตั้ง DB_* และ FRONTEND_ORIGIN บน Backend แล้วตั้ง VITE_API_URL ของ Frontend เป็น `https://<backend-domain>/api` ก่อน build โดยยังใช้ฐานข้อมูล schema เดิมและปิด synchronize ไว้

เว็บที่ schoolroom-web.vercel.app ปัจจุบันใช้ GraphQL สามารถ deploy รุ่น REST คู่นี้ไปโดเมนของคุณ หรือสลับทั้งสองโปรเจกต์กลับเป็น REST พร้อมเปลี่ยน env ให้ตรงรุ่นได้ โค้ด GraphQL อยู่ที่ main/front/back ส่วน REST ดั้งเดิมก่อนเพิ่มรายงานและการเรียงค้นหาเก็บไว้ที่ tag rest-baseline-main, rest-baseline-front, rest-baseline-back

เมื่อแก้ Backend ให้ commit และ push ด้วย git push origin rest-back


## ตัวอย่างรายงานและประวัติห้องเรียน

กด **ดาวน์โหลดรายงาน** เพื่อดูตัวอย่างก่อนส่งออก มีวันที่ข้อมูล จำนวนนักเรียนไม่ซ้ำ จำนวนแถว และตารางแบ่งหน้า PDF และ Excel ใช้ข้อมูลชุดเดียวกับตัวอย่าง หากต้องการข้อมูลล่าสุดให้กด **โหลดข้อมูลรายงานใหม่**

กดชื่อนักเรียนหรือปุ่มประวัติเพื่อดูรายการจัดห้องแยกตามปีการศึกษา แสดงวันที่เพิ่ม วันที่สิ้นสุด สถานะปัจจุบัน และห้องที่ถูกลบ โดยอ่านทั้งรายการปกติและ soft delete จาก classroom_students

REST endpoint สำหรับประวัติคือ `GET /api/students/:id/classroom-history` มี response schema ใน Swagger

ประวัติแสดงเท่าที่ฐานข้อมูลเก็บไว้ ไม่มีข้อมูลผู้ดำเนินการหรือเหตุผลแยกว่าย้ายห้อง/นำออก/ลบห้อง จึงใช้คำว่า “สิ้นสุดการอยู่ห้อง” ชื่อห้องอ่านจากข้อมูลห้องที่มีอยู่ และปีการศึกษาใช้ค่าที่เก็บในรายการจัดห้อง หากแก้ข้อมูลเดิม ประวัติส่วนนี้อาจเปลี่ยนตาม ไม่ใช่ snapshot การแก้ไขทุกครั้ง
