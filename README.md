# ระบบจัดการนักเรียนและห้องเรียน

React + Vite + Ant Design / NestJS REST API + TypeORM / MySQL

ใช้ **Node.js 24.x** และ npm 11 ขึ้นไป แยก Frontend และ Backend เป็นสองโปรเจกต์บน Vercel

## ลิงก์ใช้งาน

- Frontend: https://schoolroom-web.vercel.app
- Backend health: https://schoolroom-api.vercel.app/api/health
- Swagger: https://schoolroom-api.vercel.app/api/docs
- Source: https://github.com/lappawat9/schoolroom (private repository)

## รันในเครื่อง

Backend:

```powershell
cd backend
npm ci
npm run dev
```

Frontend (เปิดอีก terminal):

```powershell
cd frontend
npm ci
npm run dev
```

เปิด `http://localhost:5173` ส่วน API อยู่ที่ `http://localhost:3000/api`
หาก PowerShell บล็อก `npm.ps1` ให้ใช้ `npm.cmd` แทน `npm`

ค่าจริงของฐานข้อมูลอยู่ใน `backend/.env` และ API URL อยู่ใน `frontend/.env` ทั้งสองไฟล์ถูก ignore จาก Git
หาก clone ใหม่ ให้คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่าจริง
ตรวจการเชื่อมต่อได้ที่ `GET /api/health`

## Swagger สำหรับทดสอบ API

หลังรัน Backend เปิด **http://localhost:3000/api/docs** แล้วเลือก endpoint → **Try it out** → ใส่ข้อมูล → **Execute**

- เริ่มจาก `GET /api/lookups` เพื่อดู id คำนำหน้า เพศ ระดับชั้น และครู
- `POST` มีตัวอย่าง JSON ให้แก้ไขก่อนส่ง ส่วน `PATCH` ส่งเฉพาะฟิลด์ที่ต้องการแก้
- เพิ่มหรือย้ายเข้าห้องด้วย `PUT /api/classrooms/{id}/students/{studentId}` ไม่ต้องส่ง body
- OpenAPI JSON: `http://localhost:3000/api/docs-json` ใช้นำเข้า Postman ได้
- หลัง deploy ใช้ `https://<backend-domain>/api/docs` และ `/api/docs-json`

คำสั่งจาก Swagger ใช้ฐานข้อมูลที่ตั้งใน Backend เช่นเดียวกับ Frontend

## โครงสร้าง Backend

```text
src/
  students/
    student.controller.ts
    student.service.ts
    student.module.ts
    student.dto.ts
    student.entity.ts
  classrooms/
    classroom.controller.ts
    classroom.service.ts
    classroom.module.ts
    classroom.dto.ts
    classroom.entity.ts
    classroom-student.entity.ts
  common/
    lookup.controller.ts
    lookup.service.ts
    lookup.module.ts
    lookup.entity.ts
    query.dto.ts
  database/
    options.ts
    handle-database-error.ts
```

ใช้ 7 ตารางที่ฐานข้อมูลของโจทย์เตรียมไว้แล้ว ปิด `synchronize` และไม่มี migration สร้างตารางใหม่

- นักเรียนอ้างอิง `master_prefix`, `master_gender`, `grade_levels`
- ห้องเรียนอ้างอิง `teachers` และ `grade_levels`
- การจัดห้องบันทึกใน `classroom_students` นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา
- การย้ายห้องปิดรายการเดิมด้วย `deleted_at` แล้วเพิ่มรายการใหม่ เก็บประวัติไว้
- ลบนักเรียนและห้องเรียนแบบ soft delete ไม่ใช้ `DELETE` ลบแถวจริง
- ปีที่เข้าเรียนอ่านจากรหัสนักเรียนสองหลักแรก เช่น `69001` → 2569
- หน้านักเรียนแสดงห้องที่ยังใช้งานในปีการศึกษาล่าสุด

## API

ทุก path ขึ้นต้นด้วย `/api`

| Method | Path | การใช้งาน |
|---|---|---|
| GET | `/lookups` | ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครู |
| GET | `/students` | ค้นหาด้วย `studentCode`, `name`, `gradeLevelId` |
| GET | `/students/:id` | ข้อมูลนักเรียนและห้องเรียน |
| POST | `/students` | เพิ่มนักเรียน |
| PATCH | `/students/:id` | แก้ไขนักเรียน |
| DELETE | `/students/:id` | soft delete นักเรียน |
| GET | `/classrooms` | ค้นหาด้วย `roomNumber`, `name`, `teacherName` |
| GET | `/classrooms/:id` | ข้อมูลห้องเรียน |
| POST | `/classrooms` | เพิ่มห้องเรียน |
| PATCH | `/classrooms/:id` | แก้ไขห้องเรียน |
| DELETE | `/classrooms/:id` | soft delete ห้องและรายการจัดห้อง เก็บนักเรียนไว้ |
| GET | `/classrooms/:id/students` | รายชื่อนักเรียนในห้อง |
| PUT | `/classrooms/:id/students/:studentId` | เพิ่มหรือย้ายนักเรียนเข้าห้อง |
| DELETE | `/classrooms/:id/students/:studentId` | นำนักเรียนออกจากห้อง |

List รองรับ `page`, `pageSize` (สูงสุด 100) และคืน `{ data, total, page, pageSize }`
Error ใช้ 400 ข้อมูลไม่ถูกต้อง, 404 ไม่พบข้อมูล และ 409 ข้อมูลซ้ำหรือสถานะห้องเปลี่ยนไป
ห้องที่มีประวัติจัดนักเรียนแล้วจะเปลี่ยนปีการศึกษาไม่ได้ ให้สร้างห้องใหม่สำหรับปีใหม่

ตัวอย่างเพิ่มนักเรียน:

```json
{
  "studentCode": "69056",
  "prefixId": 1,
  "firstName": "ทดสอบ",
  "lastName": "ระบบ",
  "genderId": 1,
  "birthDate": "2015-05-15",
  "gradeLevelId": 5
}
```

เลือก id จาก `/lookups` ไม่ต้องเพิ่มข้อมูลหลักเอง รายงานนักเรียนอายุเต็มปี 10–12 ปีพร้อมห้องล่าสุดอยู่ใน `Report.sql` และกรองรายการ soft delete แล้ว

## ตรวจสอบ

```powershell
cd backend
npm run build
npm test
cd ../frontend
npm run build
```

API tests ใช้ฐานข้อมูลในหน่วยความจำ ไม่แตะข้อมูลของโจทย์ ครอบคลุม CRUD ตัวกรอง ข้อมูลซ้ำ validation การย้ายห้องข้ามปีและ soft delete

## Deploy Vercel

สร้าง Vercel สองโปรเจกต์จาก repository เดียว แล้วเลือก Root Directory แยกกัน:

| ค่า | Frontend | Backend |
|---|---|---|
| Root Directory | `frontend` | `backend` |
| Framework | Vite | NestJS |
| Node.js | 24.x | 24.x |
| Build | `npm run build` | native NestJS detection |
| Output | `dist` | entrypoint `src/main.ts` |

1. เพิ่ม `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL`, `DB_POOL_SIZE` ใน Environment Variables ของ Backend ตาม `backend/.env`
2. ตั้ง `FRONTEND_ORIGIN` เป็น origin ของเว็บ เช่น `https://schoolroom-web.vercel.app` โดยไม่มี `/` ปิดท้าย หลาย origin คั่นด้วย comma
3. Deploy Backend แล้วตั้ง `VITE_API_URL=https://<backend-domain>/api` ในโปรเจกต์ Frontend จากนั้น deploy Frontend
4. ตรวจ `/api/health`, CRUD และเปิด `/students` กับ `/classrooms` โดยตรง

Vercel ไม่อ่าน `.env` ในเครื่อง ต้องตั้งค่าบน Dashboard แยกแต่ละโปรเจกต์ เมื่อเปลี่ยน `VITE_API_URL` ต้อง build Frontend ใหม่ รหัสผ่านอยู่เฉพาะ Backend และ MySQL ต้องยอมรับ connection จาก Vercel

Native NestJS บน Vercel: https://vercel.com/docs/frameworks/backend/nestjs

สิ่งที่ส่งงาน: source บน GitHub, URL Frontend, URL Backend, `Report.sql` และระบุ Node.js 24.x
