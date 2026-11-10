## วิธีการเข้าทดสอบเว็ปไซต์

- เปิดเว็บ Schoolroom(https://schoolroom-web.vercel.app)
- [ดู schema และทดลอง GraphQL ผ่าน GraphiQL](https://schoolroom-api.vercel.app/api/graphql)

โดย Frontend และ Backend deploy แยกโปรเจกต์บน Vercel

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
- ค้นชื่อเรียงชื่อที่ขึ้นต้นคำค้นก่อน ตามด้วยนามสกุลที่ขึ้นต้น และรายการที่มีคำค้นอยู่ข้างใน

## ใช้ node เวอร์ชั่นอะไร

ใช้ **Node.js 24.x** และ npm 11 ขึ้นไป

Backend:

```cmd
cd backend
npm ci
npm run dev
```

Frontend (อีก terminal):

```cmd
cd frontend
npm ci
npm run dev
```

คัดลอก `.env.example` เป็น `.env` ในแต่ละโฟลเดอร์ ใส่ค่าฐานข้อมูลฝั่ง Backend และตั้ง `VITE_API_URL=http://localhost:3000/api/graphql` ฝั่ง Frontend

เว็บในเครื่องอยู่ที่ http://localhost:5173 และ GraphiQL อยู่ที่ http://localhost:3000/api/graphql

## Database

Backend ใช้ฐานข้อมูลที่มีตาราง `students`, `classrooms`, `classroom_students`, `teachers`, `master_prefix`, `master_gender` และ `grade_levels` พร้อมข้อมูลอ้างอิงสำหรับ dropdown โดยปิด `synchronize` ไว้

นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา การลบใช้ soft delete และการเปลี่ยนปีของห้องจะปรับปีในรายการจัดห้องด้วย หากชนกับห้องอื่นของนักเรียนในปีเดียวกัน GraphQL จะคืน error รหัส `CONFLICT` เพื่อให้จัดห้องก่อน

## report

กด **ดาวน์โหลดรายงาน** เพื่อดูตัวอย่างก่อนส่งออก มีวันที่ข้อมูล จำนวนนักเรียนไม่ซ้ำ จำนวนแถว และตารางแบ่งหน้า PDF และ Excel ใช้ข้อมูลชุดเดียวกับตัวอย่าง หากต้องการข้อมูลล่าสุดให้กด **โหลดข้อมูลรายงานใหม่**

ปุ่ม **ดาวน์โหลดรายงาน** บนหน้าภาพรวมและหน้านักเรียนเลือกได้ทั้ง PDF และ Excel (.xlsx) ใช้ Query `studentReport` ดึงนักเรียนอายุ 10–12 ปีตาม `Report.sql` ทั้งชุด โดยไม่อิงตัวกรองหรือหน้าตารางปัจจุบัน นักเรียนหนึ่งคนมีได้หลายแถวตามปีการศึกษา และช่องห้องว่างหมายถึงยังไม่มีห้อง อายุคำนวณ ณ วันที่ MySQL ระบุใน `asOfDate`

## GraphQL

Frontend ส่ง Query / Mutation จาก `frontend/src/queries.ts` ผ่าน `api.ts` ไปที่ `/api/graphql` ฝั่ง Backend ใช้ Resolver แยกนักเรียนกับห้องเรียน แล้วเรียก Service และ TypeORM เพื่อจัดการ MySQL

- Query: `health`, `lookups`, `students`, `student`, `classrooms`, `classroom`, `classroomStudents`, `studentReport`, `studentClassroomHistory`, `dashboard`
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
- ตั้งค่าฐานข้อมูลใน Environment Variables ของ Backend และตั้ง `VITE_API_URL` ฝั่ง Frontend เป็น `https://schoolroom-api.vercel.app/api/graphql` ให้ตรงกับ endpoint ของ Backend
- รายละเอียด Query, Mutation และ Input ทั้งหมดดูได้จาก schema ใน GraphiQL
- การ deploy ปัจจุบันใช้ Vercel CLI จากโฟลเดอร์ของแต่ละ branch; การ push Git อย่างเดียวยังไม่ deploy อัตโนมัติ

## เวอร์ชัน REST API

branch `rest-main`, `rest-front`, `rest-back` เป็นรุ่น REST ที่รองรับฟังก์ชันล่าสุด รวมการเรียงผลค้นหาและดาวน์โหลด PDF/Excel ส่วน snapshot REST ดั้งเดิมเก็บไว้ที่ tag `rest-baseline-main`, `rest-baseline-front`, `rest-baseline-back`

เก็บโค้ด ไว้ที่ branch `rest-main`, `rest-front` และ `rest-back` สามารถเปิดอ่านหรือ clone แยกมารันได้ โดยใช้ฐานข้อมูลโครงสร้างเดิม

`git fetch origin` ก่อนคืนโค้ด ใน branch `front` ใช้ `git restore --source origin/rest-front --staged --worktree .` แล้ว commit ส่วน branch `back` ใช้ `origin/rest-back` และ branch `main` ใช้ `origin/rest-main` วิธีนี้คืนไฟล์ทั้งชุด รวม module และ dependencies โดยเก็บประวัติเดิมไว้ จากนั้นรัน `npm ci` และ build ใหม่ ใช้ Frontend/Backend รุ่นเดียวกัน ตั้ง `VITE_API_URL=https://schoolroom-api.vercel.app/api` ก่อน build Frontend และ deploy ทั้งสองฝั่งอีกครั้ง




หน้านักเรียนเลือกปีและกรองได้ทั้งทั้งหมด / จัดห้องแล้ว / ยังไม่จัดห้อง คอลัมน์ห้องเรียนแสดงห้องในปีที่เลือก หน้าห้องเรียนกรองปีได้หรือเว้นว่างเพื่อดูทุกปี URL เก็บปีและสถานะจัดห้องไว้ จึงโหลดหน้าใหม่หรือส่งลิงก์ต่อได้

Query `dashboard(academicYear: Int)` คืน `academicYear`, `academicYears`, `totalStudents`, `totalClassrooms`, `assignedStudents` และ `unassignedStudents` ตัวกรอง `students` รับ `academicYear` และ `unassigned` (true = ยังไม่จัดห้อง, false = จัดห้องแล้ว) ส่วน `classrooms` รับ `academicYear` ทุกปีรับจำนวนเต็ม พ.ศ. 2400–3000
