# Schoolroom · Frontend

ส่วนเว็บของโปรเจกต์ส่วนตัว Schoolroom สำหรับจัดการนักเรียนและห้องเรียน ใช้ **React + Vite + Ant Design + TypeScript**

- [ทดลองใช้งาน](https://schoolroom-web.vercel.app)
- [ภาพรวมโปรเจกต์](https://github.com/lappawat9/schoolroom)
- [Backend](https://github.com/lappawat9/schoolroom/tree/back)
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

ตั้ง `VITE_API_URL` ใน `.env` เป็น `http://localhost:3000/api/graphql` เมื่อรัน Backend ในเครื่อง หรือ `https://schoolroom-api.vercel.app/api/graphql` หลัง deploy Backend รุ่น GraphQL แล้ว
เปิดเว็บที่ http://localhost:5173 หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## การใช้งาน

- หน้านักเรียน: เพิ่ม แก้ไข ลบ และค้นหาด้วยเลขประจำตัว ชื่อหรือนามสกุล และระดับชั้น
- หน้าห้องเรียน: จัดการห้อง ครูประจำชั้น และรายชื่อนักเรียน พร้อมเพิ่ม ย้าย และนำนักเรียนออกจากห้อง
- ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครูโหลดจาก API

หน้าเว็บเรียก GraphQL ผ่าน `src/api.ts` โดยส่ง query และ variables เป็น JSON ไปที่ endpoint เดียว คำสั่งอ่านและแก้ไขข้อมูลอยู่ใน `src/queries.ts` ส่วน `useRemote` โหลดใหม่เมื่อ variables หรือ revision เปลี่ยน และแสดงข้อผิดพลาดจาก GraphQL แม้ HTTP status เป็น 200

## Build และ deploy

```powershell
npm run build
npm run preview
```

Vercel ใช้ branch `front`, Root Directory เป็น root ของ branch, Framework เป็น Vite และ Output Directory เป็น `dist`
ตั้ง `VITE_API_URL` ก่อน build และอนุญาต origin ของเว็บใน `FRONTEND_ORIGIN` ฝั่ง Backend

## Push การเปลี่ยนแปลง

```powershell
git add .
git commit -m "Update student management interface"
git push origin front
```

branch นี้มีเฉพาะ Frontend สำหรับการเปลี่ยนแปลง API ให้ใช้ branch `back`

โค้ด Frontend ก่อนเปลี่ยนเป็น GraphQL เก็บไว้ที่ branch [rest-front](https://github.com/lappawat9/schoolroom/tree/rest-front) ใช้คู่กับ Backend ที่ branch `rest-back` หากย้อนกลับด้วย `git revert` ให้คืนทั้งสองฝั่งและตั้ง `VITE_API_URL` ลงท้าย `/api` ก่อน build ใหม่
