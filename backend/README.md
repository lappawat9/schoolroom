# Schoolroom Backend

NestJS REST API + TypeORM + MySQL / TypeScript

ใช้ Node.js 24.x, รัน `npm ci`, คัดลอก `.env.example` เป็น `.env` และใส่ค่าฐานข้อมูลของโจทย์

- พัฒนา: `npm run dev`
- Build / production: `npm run build` แล้ว `npm start`
- ทดสอบ HTTP API: `npm test`
- Vercel: Root Directory `backend`, Framework `NestJS`, Node.js 24.x, entrypoint `src/main.ts`
- Health endpoint: `GET /api/health`
- Swagger: `http://localhost:3000/api/docs` (OpenAPI JSON: `/api/docs-json`)

ต้องกำหนด `FRONTEND_ORIGIN` เป็น origin ของ Frontend จริงเพื่อเปิด CORS
ใช้ schema เดิมของโจทย์และปิด `synchronize`; รหัสผ่านอยู่ใน environment เท่านั้น
คู่มือรวม, REST endpoints และข้อกำหนดการจัดห้องอยู่ที่ `../README.md`
