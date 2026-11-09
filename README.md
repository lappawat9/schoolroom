# Schoolroom · Backend

REST API ของโปรเจกต์ส่วนตัว Schoolroom สำหรับจัดการนักเรียนและห้องเรียน ใช้ **NestJS + TypeORM + MySQL + TypeScript**

- [Swagger สำหรับดูและทดลอง API](https://schoolroom-api.vercel.app/api/docs)
- [OpenAPI JSON](https://schoolroom-api.vercel.app/api/docs-json)
- [Frontend](https://schoolroom-web.vercel.app)
- [โค้ด Frontend](https://github.com/lappawat9/schoolroom/tree/front)
- [ภาพรวมโปรเจกต์](https://github.com/lappawat9/schoolroom)

## เริ่มพัฒนา

ใช้ Node.js 24.x, npm 11 ขึ้นไป และ MySQL

```powershell
git clone --branch back --single-branch https://github.com/lappawat9/schoolroom.git schoolroom-back
cd schoolroom-back
npm ci
Copy-Item .env.example .env
```

ใส่ค่าการเชื่อมต่อของคุณใน `.env`: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL` และ `DB_POOL_SIZE`
ตั้ง `FRONTEND_ORIGIN` ให้ตรงกับ origin ของเว็บ หลายค่าคั่นด้วย comma

Backend เชื่อม schema ที่มีตาราง `students`, `classrooms`, `classroom_students`, `teachers`, `master_prefix`, `master_gender` และ `grade_levels` พร้อมข้อมูลอ้างอิงสำหรับ dropdown โดยปิด `synchronize` ไว้

```powershell
npm run dev
```

API อยู่ที่ http://localhost:3000/api และ Swagger อยู่ที่ http://localhost:3000/api/docs
หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## API และข้อมูล

- `/api/students`: จัดการนักเรียน ค้นหาด้วย `studentCode`, `name`, `gradeLevelId`
- `/api/classrooms`: จัดการห้อง ค้นหาด้วย `roomNumber`, `name`, `teacherName`
- `/api/classrooms/:id/students/:studentId`: เพิ่มหรือย้ายเข้าห้องด้วย PUT และนำออกด้วย DELETE
- `/api/lookups`: ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครู
- `/api/health`: ตรวจการเชื่อมต่อ

นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา ใช้ soft delete เพื่อเก็บประวัติ หากเปลี่ยนปีของห้องแล้วชนกับห้องอื่นของนักเรียนในปีเดียวกัน API จะตอบ 409
รายงาน SQL นักเรียนอายุ 10–12 ปีพร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษาอยู่ใน [Report.sql](Report.sql)

## ตรวจสอบและ deploy

```powershell
npm run build
npm start
```

Vercel ใช้ branch `back`, Root Directory เป็น root ของ branch และ Framework เป็น NestJS โดยมี entrypoint ที่ `src/main.ts`
ตั้ง environment variables บน Vercel แยกจาก `.env` ในเครื่อง

## Push การเปลี่ยนแปลง

```powershell
git add .
git commit -m "Update classroom API"
git push origin back
```

branch นี้มีเฉพาะ Backend สำหรับการเปลี่ยนแปลงหน้าเว็บให้ใช้ branch `front`
