# ระบบจัดการนักเรียนและห้องเรียน

React + Vite + Ant Design / NestJS REST API + TypeORM / MySQL

ใช้ **Node.js 24.x** และ npm 11 ขึ้นไป

## ลิงก์

- Frontend: https://schoolroom-web.vercel.app
- Backend: https://schoolroom-api.vercel.app/api/health
- Swagger: https://schoolroom-api.vercel.app/api/docs
- Source: https://github.com/lappawat9/schoolroom
- รายงาน SQL: [Report.sql](Report.sql)

## รันในเครื่อง

สร้าง `backend/.env` และ `frontend/.env` ตามไฟล์ `.env.example` ของแต่ละโฟลเดอร์ แล้วใส่ข้อมูลฐานข้อมูลของโจทย์

Backend:

```powershell
cd backend
npm ci
npm run dev
```

Frontend (อีก terminal):

```powershell
cd frontend
npm ci
npm run dev
```

เปิด http://localhost:5173 และ Swagger ที่ http://localhost:3000/api/docs
หาก PowerShell บล็อก `npm.ps1` ให้ใช้ `npm.cmd` แทน `npm`

## การทำงาน

- Controller, service, DTO และ entity แยกใน `backend/src/students` กับ `backend/src/classrooms`
- ใช้ 7 ตารางเดิมของโจทย์ ปิด `synchronize` และไม่มี migration สร้างตารางใหม่
- นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา การย้ายห้องเก็บรายการเดิมไว้ด้วย `deleted_at`
- ลบนักเรียนและห้องเรียนแบบ soft delete ตาม schema ของฐานข้อมูล
- เปลี่ยนปีการศึกษาของห้องได้ โดยปรับปีในรายการจัดห้องด้วย หากนักเรียนมีห้องอื่นในปีใหม่อยู่แล้ว จะตอบ 409 ให้จัดห้องก่อน
- ปีที่เข้าเรียนคำนวณจากรหัสนักเรียนสองหลักแรก เช่น `69001` → 2569
- `Report.sql` แสดงนักเรียนอายุเต็มปี 10–12 ปี พร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษา รวมผู้ที่ยังไม่มีห้อง และไม่รวมรายการ soft delete

## ทดสอบ API

เปิด Swagger แล้วใช้ **Try it out → Execute** เริ่มจาก `GET /api/lookups` เพื่อดู id คำนำหน้า เพศ ระดับชั้น และครู
OpenAPI JSON อยู่ที่ `/api/docs-json`

| Method | Path | การใช้งาน |
|---|---|---|
| GET / POST | `/api/students` | ค้นหา / เพิ่มนักเรียน |
| GET / PATCH / DELETE | `/api/students/:id` | ดู / แก้ไข / ลบนักเรียน |
| GET / POST | `/api/classrooms` | ค้นหา / เพิ่มห้อง |
| GET / PATCH / DELETE | `/api/classrooms/:id` | ดู / แก้ไข / ลบห้อง |
| GET | `/api/classrooms/:id/students` | นักเรียนในห้อง |
| PUT / DELETE | `/api/classrooms/:id/students/:studentId` | เพิ่มหรือย้ายเข้าห้อง / นำออก |

ค้นหานักเรียนด้วย `studentCode`, `name`, `gradeLevelId` และค้นหาห้องด้วย `roomNumber`, `name`, `teacherName`
List รองรับ `page`, `pageSize` (สูงสุด 100) และคืน `{ data, total, page, pageSize }`

ตรวจ build และ tests:

```powershell
cd backend
npm run build
npm test
cd ../frontend
npm run build
```

Tests ใช้ฐานข้อมูลในหน่วยความจำ ไม่แตะข้อมูลของโจทย์

## Vercel

สองโปรเจกต์ใช้ repository เดียวกัน โดยตั้ง Root Directory เป็น `frontend` (Vite) และ `backend` (NestJS) ใช้ Node.js 24.x

- Backend: ตั้ง `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL`, `DB_POOL_SIZE` ตาม `.env` และตั้ง `FRONTEND_ORIGIN` เป็น URL ของ Frontend โดยไม่มี `/` ปิดท้าย
- Frontend: ตั้ง `VITE_API_URL=https://schoolroom-api.vercel.app/api` ก่อน build
- `.env` ถูก ignore จาก Git ต้องใส่ environment variables ใน Vercel Dashboard แยกแต่ละโปรเจกต์
