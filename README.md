# Schoolroom · Frontend

ส่วนเว็บของโปรเจกต์ส่วนตัว Schoolroom สำหรับจัดการนักเรียนและห้องเรียน ใช้ **React + Vite + Ant Design + TypeScript**

- [ทดลองใช้งาน](https://schoolroom-web.vercel.app)
- [ภาพรวมโปรเจกต์](https://github.com/lappawat9/schoolroom)
- [Backend](https://github.com/lappawat9/schoolroom/tree/back)
- [GraphQL และ GraphiQL ออนไลน์](https://schoolroom-api.vercel.app/api/graphql)
- GraphQL ในเครื่อง: http://localhost:3000/api/graphql

## เริ่มพัฒนา

ใช้ Node.js 24.x และ npm 11 ขึ้นไป

```powershell
git clone --branch front --single-branch https://github.com/lappawat9/schoolroom.git schoolroom-front
cd schoolroom-front
npm ci
Copy-Item .env.example .env
npm run dev
```

ตั้ง `VITE_API_URL` ใน `.env` เป็น `http://localhost:3000/api/graphql` เมื่อรัน Backend ในเครื่อง หรือ `https://schoolroom-api.vercel.app/api/graphql` สำหรับ Backend ออนไลน์
เปิดเว็บที่ http://localhost:5173 หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## การใช้งาน

- หน้านักเรียน: เพิ่ม แก้ไข ลบ และค้นหาด้วยเลขประจำตัว ชื่อหรือนามสกุล และระดับชั้น
- หน้าห้องเรียน: จัดการห้อง ครูประจำชั้น และรายชื่อนักเรียน พร้อมเพิ่ม ย้าย และนำนักเรียนออกจากห้อง
- ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครูโหลดจาก API

หน้าเว็บเรียก GraphQL ผ่าน `src/api.ts` โดยส่ง query และ variables เป็น JSON ไปที่ endpoint เดียว คำสั่งอ่านและแก้ไขข้อมูลอยู่ใน `src/queries.ts` ส่วน `useRemote` โหลดใหม่เมื่อ variables หรือ revision เปลี่ยน และแสดงข้อผิดพลาดจาก GraphQL แม้ HTTP status เป็น 200

## ดาวน์โหลดรายงาน

ปุ่ม **ดาวน์โหลดรายงาน** บนหน้านักเรียนเลือกได้ทั้ง PDF และ Excel (.xlsx) ใช้ Query `studentReport` ดึงนักเรียนอายุ 10–12 ปีตาม `Report.sql` ทั้งชุด โดยไม่อิงตัวกรองหรือหน้าตารางปัจจุบัน นักเรียนหนึ่งคนมีได้หลายแถวตามปีการศึกษา และช่องห้องว่างหมายถึงยังไม่มีห้อง อายุคำนวณ ณ วันที่ MySQL ระบุใน `asOfDate`

ไฟล์สร้างในเบราว์เซอร์ด้วย `report-pdf.ts` และ `report-excel.ts` โดยโหลดไลบรารีเฉพาะเมื่อเลือกดาวน์โหลด PDF ฝังฟอนต์ Sarabun จาก `public/fonts` พร้อมใบอนุญาต OFL; ไฟล์ฟอนต์ต้องเข้าถึงได้โดยไม่ถูก SPA rewrite

## Build และ deploy

```powershell
npm run build
npm run preview
```

Vercel ใช้ branch `front`, Root Directory เป็น root ของ branch, Framework เป็น Vite และ Output Directory เป็น `dist`
ตั้ง `VITE_API_URL` ก่อน build และอนุญาต origin ของเว็บใน `FRONTEND_ORIGIN` ฝั่ง Backend
การ deploy ปัจจุบันใช้ Vercel CLI จากโฟลเดอร์ branch นี้; การ push Git อย่างเดียวยังไม่ deploy อัตโนมัติ

## Push การเปลี่ยนแปลง

```powershell
git add .
git commit -m "Update student management interface"
git push origin front
```

branch นี้มีเฉพาะ Frontend สำหรับการเปลี่ยนแปลง API ให้ใช้ branch `back`

โค้ด Frontend รุ่น REST ที่รองรับฟังก์ชันล่าสุดอยู่ที่ branch [rest-front](https://github.com/lappawat9/schoolroom/tree/rest-front) ใช้คู่กับ Backend ที่ branch `rest-back`

เก็บงานปัจจุบันให้เรียบร้อยและ `git fetch origin` ก่อนคืนโค้ด ใน branch `front` ใช้ `git restore --source origin/rest-front --staged --worktree .` แล้ว commit ส่วน branch `back` ใช้ `origin/rest-back` และ branch `main` ใช้ `origin/rest-main` วิธีนี้คืนไฟล์ทั้งชุด รวม module และ dependencies โดยเก็บประวัติเดิมไว้ จากนั้นรัน `npm ci` และ build ใหม่ ใช้ Frontend/Backend รุ่นเดียวกัน ตั้ง `VITE_API_URL=https://schoolroom-api.vercel.app/api` ก่อน build Frontend และ deploy ทั้งสองฝั่งอีกครั้ง


branch `rest-main`, `rest-front`, `rest-back` เป็นรุ่น REST ที่รองรับฟังก์ชันล่าสุด รวมการเรียงผลค้นหาและดาวน์โหลด PDF/Excel ส่วน snapshot REST ดั้งเดิมเก็บไว้ที่ tag `rest-baseline-main`, `rest-baseline-front`, `rest-baseline-back`
