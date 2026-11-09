# Schoolroom

โปรเจกต์ส่วนตัวสำหรับจัดการข้อมูลนักเรียนและห้องเรียน พัฒนาด้วย React, Ant Design และ NestJS เชื่อมต่อ MySQL ผ่าน TypeORM

## ทดลองใช้งาน

- [เปิดเว็บ Schoolroom](https://schoolroom-web.vercel.app)
- [ดูและทดลอง REST API ผ่าน Swagger](https://schoolroom-api.vercel.app/api/docs)
- [OpenAPI JSON](https://schoolroom-api.vercel.app/api/docs-json)

## โค้ดแต่ละส่วน

| Branch | เนื้อหา |
|---|---|
| [front](https://github.com/lappawat9/schoolroom/tree/front) | Frontend เท่านั้น วาง React + Vite ไว้ที่ root ของ branch |
| [back](https://github.com/lappawat9/schoolroom/tree/back) | Backend เท่านั้น วาง NestJS และ `Report.sql` ไว้ที่ root ของ branch |
| main | ภาพรวมโปรเจกต์และโค้ดรวมในโฟลเดอร์ `frontend` / `backend` |

แต่ละ branch มี README สำหรับติดตั้งและพัฒนาแยกกัน โดย push Frontend ไปที่ `front` และ Backend ไปที่ `back`

## ความสามารถ

- เพิ่ม แก้ไข ลบ และค้นหานักเรียนตามเลขประจำตัว ชื่อ นามสกุล และระดับชั้น
- จัดการห้องเรียน ปีการศึกษา และครูประจำชั้น พร้อมค้นหาด้วยชื่อเต็มของครู
- เพิ่มนักเรียนเข้าห้อง ย้ายห้อง และนำออกจากห้อง โดยเก็บประวัติการจัดห้องไว้
- รายงาน SQL นักเรียนอายุ 10–12 ปี พร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษาใน [Report.sql](Report.sql)
- Swagger สำหรับดู request และทดลองเรียก API

## พัฒนาจาก main

ใช้ **Node.js 24.x** และ npm 11 ขึ้นไป คัดลอก `.env.example` เป็น `.env` ในแต่ละโฟลเดอร์ แล้วใส่ค่าการเชื่อมต่อของคุณ

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

เว็บในเครื่องอยู่ที่ http://localhost:5173 และ Swagger อยู่ที่ http://localhost:3000/api/docs
หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## ฐานข้อมูลและการจัดห้อง

Backend ใช้ฐานข้อมูลที่มีตาราง `students`, `classrooms`, `classroom_students`, `teachers`, `master_prefix`, `master_gender` และ `grade_levels` พร้อมข้อมูลอ้างอิงสำหรับ dropdown โดยปิด `synchronize` ไว้

นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา การลบใช้ soft delete และการเปลี่ยนปีของห้องจะปรับปีในรายการจัดห้องด้วย หากชนกับห้องอื่นของนักเรียนในปีเดียวกัน API จะตอบ 409 เพื่อให้จัดห้องก่อน

## ตรวจสอบและ deploy

- Backend: `npm run build` และ `npm test`
- Frontend: `npm run build`
- Tests ใช้ฐานข้อมูลในหน่วยความจำแยกจากข้อมูลที่เว็บใช้งาน
- Vercel แยกเป็นสองโปรเจกต์: `schoolroom-web` สำหรับ branch `front` และ `schoolroom-api` สำหรับ branch `back` ใช้ Root Directory เป็น root ของ branch
- ตั้งค่าฐานข้อมูลใน Environment Variables ของ Backend และตั้ง `VITE_API_URL` ฝั่ง Frontend ให้ชี้ไปที่ URL API

รายละเอียด endpoint และตัวกรองทั้งหมดดูได้จาก Swagger
