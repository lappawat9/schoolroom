# Schoolroom · Frontend

ส่วนเว็บของโปรเจกต์ส่วนตัว Schoolroom สำหรับจัดการนักเรียนและห้องเรียน ใช้ **React + Vite + Ant Design + TypeScript**

- [ทดลองใช้งาน](https://schoolroom-web.vercel.app)
- [ภาพรวมโปรเจกต์](https://github.com/lappawat9/schoolroom)
- [Backend](https://github.com/lappawat9/schoolroom/tree/back)
- [Swagger](https://schoolroom-api.vercel.app/api/docs)

## เริ่มพัฒนา

ใช้ Node.js 24.x และ npm 11 ขึ้นไป

```powershell
git clone --branch front --single-branch https://github.com/lappawat9/schoolroom.git schoolroom-front
cd schoolroom-front
npm ci
Copy-Item .env.example .env
npm run dev
```

ตั้ง `VITE_API_URL` ใน `.env` เป็น `http://localhost:3000/api` เมื่อรัน Backend ในเครื่อง หรือ `https://schoolroom-api.vercel.app/api` เพื่อเชื่อม API ออนไลน์
เปิดเว็บที่ http://localhost:5173 หาก PowerShell บล็อก `npm.ps1` ใช้ `npm.cmd` แทน `npm`

## การใช้งาน

- หน้านักเรียน: เพิ่ม แก้ไข ลบ และค้นหาด้วยเลขประจำตัว ชื่อหรือนามสกุล และระดับชั้น
- หน้าห้องเรียน: จัดการห้อง ครูประจำชั้น และรายชื่อนักเรียน พร้อมเพิ่ม ย้าย และนำนักเรียนออกจากห้อง
- ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครูโหลดจาก API

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
