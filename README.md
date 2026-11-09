## วิธีการเข้าทดสอบเว็ปไซต์

- เปิดเว็บ Schoolroom(https://schoolroom-web.vercel.app)
- ดูและทดลอง GraphQL ผ่าน GraphiQL ในเครื่อง: http://localhost:3000/api/graphql

เวอร์ชัน GraphQL นี้ยังไม่ได้ deploy เว็บไซต์ออนไลน์จึงยังเป็นเวอร์ชัน REST เดิม

## โค้ดแต่ละส่วน

 - front (https://github.com/lappawat9/schoolroom/tree/front) | Frontend เท่านั้น วาง React + Vite ไว้ที่ root ของ branch
 - back (https://github.com/lappawat9/schoolroom/tree/back) | Backend เท่านั้น วาง NestJS และ `Report.sql` ไว้ที่ root ของ branch
 - main  ภาพรวมโปรเจกต์และโค้ดรวมในโฟลเดอร์ `frontend` / `backend`

แต่ละ branch มี README สำหรับติดตั้งและพัฒนาแยกกัน โดย push Frontend ไว้ที่ `front` และ Backend ไว้ที่ `back` แล้วครับ

## ฟังค์ชั่นการทำงานหลักๆ

- เพิ่ม แก้ไข ลบ และค้นหานักเรียนตามเลขประจำตัว ชื่อ นามสกุล และระดับชั้น
- จัดการห้องเรียน ปีการศึกษา และครูประจำชั้น พร้อมค้นหาด้วยชื่อเต็มของครู
- เพิ่มนักเรียนเข้าห้อง ย้ายห้อง และนำออกจากห้อง โดยเก็บประวัติการจัดห้องไว้
- รายงาน SQL นักเรียนอายุ 10–12 ปี พร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษาใน [Report.sql](Report.sql)
- GraphiQL สำหรับดู schema และทดสอบ Query / Mutation

## ใช้ node เวอร์ชั่นอะไร

ใช้ **Node.js 24.x** และ npm 11 ขึ้นไป

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

คัดลอก `.env.example` เป็น `.env` ในแต่ละโฟลเดอร์ ใส่ค่าฐานข้อมูลฝั่ง Backend และตั้ง `VITE_API_URL=http://localhost:3000/api/graphql` ฝั่ง Frontend

เว็บในเครื่องอยู่ที่ http://localhost:5173 และ GraphiQL อยู่ที่ http://localhost:3000/api/graphql

## Database

Backend ใช้ฐานข้อมูลที่มีตาราง `students`, `classrooms`, `classroom_students`, `teachers`, `master_prefix`, `master_gender` และ `grade_levels` พร้อมข้อมูลอ้างอิงสำหรับ dropdown โดยปิด `synchronize` ไว้

นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา การลบใช้ soft delete และการเปลี่ยนปีของห้องจะปรับปีในรายการจัดห้องด้วย หากชนกับห้องอื่นของนักเรียนในปีเดียวกัน GraphQL จะคืน error รหัส `CONFLICT` เพื่อให้จัดห้องก่อน

## GraphQL

Frontend ส่ง Query / Mutation จาก `frontend/src/queries.ts` ผ่าน `api.ts` ไปที่ `/api/graphql` ฝั่ง Backend ใช้ Resolver แยกนักเรียนกับห้องเรียน แล้วเรียก Service และ TypeORM เพื่อจัดการ MySQL

- Query: `health`, `lookups`, `students`, `student`, `classrooms`, `classroom`, `classroomStudents`
- Mutation: `createStudent`, `updateStudent`, `deleteStudent`, `createClassroom`, `updateClassroom`, `deleteClassroom`, `assignStudent`, `removeStudentFromClassroom`
- `students` และ `classrooms` รับ `filter` ซึ่งรวม `page` และ `pageSize` ไว้ด้วย
- ข้อผิดพลาดอ่านจาก `errors` ใน response แม้ HTTP status เป็น 200

```graphql
query {
  health
  students(filter: { page: 1, pageSize: 10 }) {
    data { id studentCode firstName lastName }
    total page pageSize
  }
}
```

## Deploy

- Backend: `npm run build`
- Frontend: `npm run build`
- Vercel แยกเป็นสองโปรเจกต์: `schoolroom-web` สำหรับ branch `front` และ `schoolroom-api` สำหรับ branch `back` ใช้ Root Directory เป็น root ของ branch
- ตั้งค่าฐานข้อมูลใน Environment Variables ของ Backend และตั้ง `VITE_API_URL` ฝั่ง Frontend เป็น `https://schoolroom-api.vercel.app/api/graphql` หลัง deploy Backend รุ่น GraphQL แล้ว
- รายละเอียด Query, Mutation และ Input ทั้งหมดดูได้จาก schema ใน GraphiQL

## เวอร์ชัน REST API

เก็บโค้ดก่อนเปลี่ยนเป็น GraphQL ไว้ที่ branch `rest-main`, `rest-front` และ `rest-back` สามารถเปิดอ่านหรือ clone แยกมารันได้ โดยใช้ฐานข้อมูลโครงสร้างเดิม

หากต้องการย้อน branch ปัจจุบันกลับเป็น REST ให้ใช้ `git revert` กับ commit ที่เปลี่ยนเป็น GraphQL ของแต่ละ branch แล้ว push ตามปกติ ประวัติของ GraphQL จะยังอยู่ หาก deploy REST อีกครั้งให้ใช้ Frontend และ Backend รุ่นเดียวกัน และตั้ง `VITE_API_URL` กลับเป็น URL ที่ลงท้าย `/api`
