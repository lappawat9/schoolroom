# Schoolroom · Backend

GraphQL API ของโปรเจกต์ส่วนตัว Schoolroom สำหรับจัดการนักเรียนและห้องเรียน ใช้ **NestJS + Apollo + TypeORM + MySQL + TypeScript**

- [GraphiQL ออนไลน์สำหรับดู schema และทดลอง API](https://schoolroom-api.vercel.app/api/graphql)
- GraphiQL ในเครื่อง: http://localhost:3000/api/graphql
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

Backend ใช้ ES Modules (`type: module` และ TypeScript `NodeNext`) เส้นทาง import ภายในจึงลงท้าย `.js` เพื่อให้ไฟล์หลัง build รันได้บน Node.js และ Vercel คำสั่ง `npm run dev` ใช้ `tsc-watch` คอมไพล์และเริ่มเซิร์ฟเวอร์ใหม่เมื่อแก้ไฟล์

```powershell
npm run dev
```

API และหน้า GraphiQL อยู่ที่ http://localhost:3000/api/graphql เปิด URL นี้ในเบราว์เซอร์เพื่อดู schema และทดลอง query/mutation ได้
หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## Query และ Mutation

- Query: `health`, `lookups`, `students`, `student`, `classrooms`, `classroom`, `classroomStudents`, `studentReport`
- Mutation นักเรียน: `createStudent`, `updateStudent`, `deleteStudent`
- Mutation ห้องเรียน: `createClassroom`, `updateClassroom`, `deleteClassroom`
- Mutation จัดห้อง: `assignStudent`, `removeStudentFromClassroom`
- ตัวกรอง `students`: `studentCode`, `name`, `gradeLevelId`, `page`, `pageSize`
- ตัวกรอง `classrooms`: `roomNumber`, `name`, `teacherName`, `page`, `pageSize`

```graphql
query {
  health
  lookups {
    prefixes { id name genderId }
    genders { id name }
    grades { id name }
    teachers { id name }
  }
  students(filter: { page: 1, pageSize: 10 }) {
    data {
      id studentCode firstName lastName
      classroom { id name academicYear }
    }
    total page pageSize
  }
}
```

ตัวอย่างเพิ่มนักเรียน ใช้ id ของข้อมูลหลักจาก `lookups` ในช่อง Variables:

```graphql
mutation CreateStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
    id studentCode firstName lastName
  }
}
```

```json
{
  "input": {
    "studentCode": "69056",
    "prefixId": 1,
    "firstName": "ต้นกล้า",
    "lastName": "พัฒนกิจ",
    "genderId": 1,
    "birthDate": "2015-05-15",
    "gradeLevelId": 5
  }
}
```

`assignStudent(classroomId: Int!, studentId: Int!)` เพิ่มหรือย้ายเข้าห้อง ส่วน `removeStudentFromClassroom` นำออกโดยเก็บนักเรียนไว้ `deleteStudent` และ `deleteClassroom` คืน Boolean หลัง soft delete สำเร็จ

นักเรียนอยู่ได้หนึ่งห้องต่อปีการศึกษา ใช้ soft delete เพื่อเก็บประวัติ หากเปลี่ยนปีของห้องแล้วชนกับห้องอื่นของนักเรียนในปีเดียวกัน จะคืน GraphQL error ที่มี `extensions.code` เป็น `CONFLICT` ข้อผิดพลาดในการทำงานอาจมี HTTP status 200 จึงต้องอ่าน `errors` ใน JSON ด้วย

Resolver แยกใน `students/student.resolver.ts` และ `classrooms/classroom.resolver.ts` ทำหน้าที่รับคำขอและเรียก Service ส่วน `*.input.ts` ตรวจข้อมูลเข้า และ `*.model.ts` กำหนดข้อมูลที่ขอผ่าน GraphQL ได้ Schema สร้างในหน่วยความจำด้วย `autoSchemaFile: true` จึงไม่ต้องเขียนไฟล์ระหว่างรันบน Vercel
รายงาน SQL นักเรียนอายุ 10–12 ปีพร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษาอยู่ใน [Report.sql](Report.sql)

## รายงานนักเรียน

ปุ่ม **ดาวน์โหลดรายงาน** บนหน้านักเรียนเลือกได้ทั้ง PDF และ Excel (.xlsx) ใช้ Query `studentReport` ดึงนักเรียนอายุ 10–12 ปีตาม `Report.sql` ทั้งชุด โดยไม่อิงตัวกรองหรือหน้าตารางปัจจุบัน นักเรียนหนึ่งคนมีได้หลายแถวตามปีการศึกษา และช่องห้องว่างหมายถึงยังไม่มีห้อง อายุคำนวณ ณ วันที่ MySQL ระบุใน `asOfDate`

`reports/report.resolver.ts` รับ Query และเรียก `ReportService.studentReport()` อ่านข้อมูลด้วย SQL เงื่อนไขเดียวกับ `Report.sql` โดยใช้วันที่จาก MySQL ชุดเดียวกัน ข้อมูลส่งผ่าน GraphQL ให้ Frontend สร้างไฟล์ จึงไม่มี endpoint ดาวน์โหลด REST เพิ่ม

```graphql
query {
  studentReport {
    asOfDate
    rows { studentCode fullName gender age roomNumber roomName academicYear }
  }
}
```

## ตรวจสอบและ deploy

```powershell
npm run build
npm start
```

Vercel ใช้ branch `back`, Root Directory เป็น root ของ branch และ Framework เป็น NestJS โดยมี entrypoint ที่ `src/main.ts`
ตั้ง environment variables บน Vercel แยกจาก `.env` ในเครื่อง
การ deploy ปัจจุบันใช้ Vercel CLI จากโฟลเดอร์ branch นี้; การ push Git อย่างเดียวยังไม่ deploy อัตโนมัติ
endpoint ออนไลน์คือ `https://schoolroom-api.vercel.app/api/graphql` และต้องตั้ง `VITE_API_URL` ฝั่ง Frontend ให้ตรงก่อน build ใหม่

## Push การเปลี่ยนแปลง

```powershell
git add .
git commit -m "Update classroom API"
git push origin back
```

branch นี้มีเฉพาะ Backend สำหรับการเปลี่ยนแปลงหน้าเว็บให้ใช้ branch `front`

โค้ด REST เดิมเก็บไว้ที่ branch [rest-back](https://github.com/lappawat9/schoolroom/tree/rest-back) ใช้คู่กับ Frontend ที่ branch `rest-front` การเปลี่ยนครั้งนี้ไม่เปลี่ยนโครงสร้างตาราง จึงใช้ฐานข้อมูลเดิมได้ทั้งสองรุ่น เก็บงานปัจจุบันให้เรียบร้อยและ `git fetch origin` ก่อนคืนโค้ด ใน branch `front` ใช้ `git restore --source origin/rest-front --staged --worktree .` แล้ว commit ส่วน branch `back` ใช้ `origin/rest-back` และ branch `main` ใช้ `origin/rest-main` วิธีนี้คืนไฟล์ทั้งชุด รวม module และ dependencies โดยเก็บประวัติเดิมไว้ จากนั้นรัน `npm ci` และ build ใหม่ ใช้ Frontend/Backend รุ่นเดียวกัน ตั้ง `VITE_API_URL=https://schoolroom-api.vercel.app/api` ก่อน build Frontend และ deploy ทั้งสองฝั่งอีกครั้ง
