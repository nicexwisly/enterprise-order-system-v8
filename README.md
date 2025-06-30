# 🚀 Enterprise Order System V8 - Real Backend API

ระบบจัดการคำสั่งซื้อแบบ Enterprise พร้อม Backend API จริง รองรับ **Chrome 70** และ **Android 6.0.1**

## ✨ คุณสมบัติหลัก

### 🔧 Backend API
- ✅ **Node.js HTTP Server** - ไม่ใช้ framework เพื่อ compatibility
- ✅ **RESTful API** - GET, POST, PUT endpoints
- ✅ **In-memory Database** - พร้อมขยายเป็น MySQL/PostgreSQL
- ✅ **CORS Support** - รองรับ cross-origin requests
- ✅ **Real-time Updates** - Auto-refresh ทุก 15-30 วินาที

### 🎯 Frontend Features
- ✅ **Chrome 70 Compatible** - ใช้ ES5 JavaScript เท่านั้น
- ✅ **Android 6.0.1 Support** - ใช้ XMLHttpRequest แทน fetch
- ✅ **Legacy CSS** - ใช้ Flexbox แทน CSS Grid
- ✅ **Polyfills** - สำหรับ missing browser features
- ✅ **Auto-save Draft** - บันทึกข้อมูลฟอร์มอัตโนมัติ

### 📋 ระบบจัดการคำสั่งซื้อ
- ✅ **สร้างคำสั่งซื้อ** - ส่งไปยังแผนกจริงๆ
- ✅ **อัพเดทสถานะ** - New → In Process → Completed
- ✅ **ค้นหาและกรอง** - ตามแผนก, สถานะ, คำค้นหา
- ✅ **Export CSV** - ส่งออกข้อมูลเป็นไฟล์
- ✅ **Real-time Stats** - สถิติอัพเดทแบบ real-time

## 🚀 การติดตั้งและใช้งาน

### 1. เริ่มต้น Server
\`\`\`bash
# Clone หรือ download โปรเจค
cd enterprise-order-system-v8

# เริ่มต้น server (ไม่ต้องติดตั้ง dependencies)
node server/api.js
\`\`\`

### 2. เปิดระบบ
\`\`\`
🌐 เปิดเบราว์เซอร์ไปที่: http://localhost:3000/legacy-real-index.html
\`\`\`

### 3. ทดสอบระบบ
1. **สร้างคำสั่งซื้อใหม่** - ไปที่หน้า "สร้างคำสั่งซื้อ"
2. **ดูในแผนก** - ไปที่ "แผนกปลา" หรือ "แผนกหมู"
3. **อัพเดทสถานะ** - คลิกปุ่ม "เปลี่ยนเป็น..."
4. **ดูการอัพเดท** - กลับไปหน้าหลักเพื่อดูสถิติใหม่

## 📁 โครงสร้างไฟล์

\`\`\`
enterprise-order-system-v8/
├── server/
│   └── api.js                     # Backend API Server
├── legacy-real-index.html         # หน้าหลัก (Real API)
├── legacy-real-submit-order.html  # สร้างคำสั่งซื้อ (Real API)
├── legacy-real-fish-orders.html   # แผนกปลา (Real API)
├── legacy-styles.css              # CSS สำหรับ Chrome 70
├── legacy-polyfills.js            # Polyfills สำหรับ Android 6.0.1
├── legacy-api-client.js           # API Client (XMLHttpRequest)
├── legacy-utils.js                # Utility functions
├── legacy-real-dashboard.js       # Dashboard logic (Real API)
├── legacy-real-submit-order.js    # Submit form logic (Real API)
├── legacy-real-fish-orders.js     # Fish orders logic (Real API)
└── package.json                   # Project metadata
\`\`\`

## 🔌 API Endpoints

### GET /api/orders
ดึงข้อมูลคำสั่งซื้อ
\`\`\`
Query Parameters:
- department: Fish | Pork | all
- status: New | In Process | Completed | all  
- search: ค้นหาในชื่อลูกค้า, รหัส, รายการสินค้า
\`\`\`

### POST /api/orders
สร้างคำสั่งซื้อใหม่
\`\`\`json
{
  "customer": "ชื่อลูกค้า",
  "department": "Fish | Pork", 
  "items": "รายการสินค้า",
  "pickupDate": "2024-01-15",
  "pickupTime": "10:00",
  "notes": "หมายเหตุ",
  "priority": "low | normal | high | urgent"
}
\`\`\`

### PUT /api/orders/:id/status
อัพเดทสถานะคำสั่งซื้อ
\`\`\`json
{
  "status": "New | In Process | Completed"
}
\`\`\`

### GET /api/stats
ดึงสถิติระบบ
\`\`\`json
{
  "total": 6,
  "new": 2, 
  "inProcess": 2,
  "completed": 2,
  "fish": 3,
  "pork": 3
}
\`\`\`

## 🔧 การทำงานของระบบ

### 1. สร้างคำสั่งซื้อ
- ผู้ใช้กรอกฟอร์มในหน้า "สร้างคำสั่งซื้อ"
- ระบบส่งข้อมูลไปยัง `POST /api/orders`
- Server สร้างคำสั่งซื้อใหม่และส่งไปยังแผนกที่เลือก
- แสดงข้อความยืนยันพร้อมรหัสคำสั่งซื้อ

### 2. จัดการในแผนก
- พนักงานแผนกเปิดหน้า "แผนกปลา" หรือ "แผนกหมู"
- ดูคำสั่งซื้อที่ส่งมาให้แผนก
- คลิกปุ่ม "เปลี่ยนเป็น..." เพื่ือัพเดทสถานะ
- ระบบส่งไปยัง `PUT /api/orders/:id/status`

### 3. ติดตามสถิติ
- หน้าหลักแสดงสถิติแบบ real-time
- Auto-refresh ทุก 30 วินาที
- ดึงข้อมูลจาก `GET /api/stats`

## 🌐 Browser Compatibility

### ✅ รองรับ
- **Chrome 70+** (2018)
- **Android 6.0.1** WebView (2015)
- **Firefox 60+** (2018)
- **Safari 12+** (2018)
- **Edge 44+** (2018)

### ❌ ไม่รองรับ
- Internet Explorer (ทุกเวอร์ชัน)
- Chrome 69 และต่ำกว่า
- Android 5.x และต่ำกว่า

## 🔒 Security Notes

- ระบบนี้เป็น Demo สำหรับ Development
- ไม่มี Authentication/Authorization
- ข้อมูลเก็บใน Memory (หายเมื่อ restart server)
- สำหรับ Production ควรเพิ่ม:
  - Database จริง (MySQL/PostgreSQL)
  - User authentication
  - Input validation
  - Rate limiting
  - HTTPS

## 🚀 การขยายระบบ

### Database Integration
\`\`\`javascript
// แทนที่ in-memory array ด้วย database
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'password',
  database: 'orders'
});
\`\`\`

### Authentication
\`\`\`javascript
// เพิ่ม JWT authentication
const jwt = require('jsonwebtoken');
// Middleware สำหรับตรวจสอบ token
\`\`\`

### WebSocket (สำหรับ modern browsers)
\`\`\`javascript
// เพิ่ม real-time updates ด้วย WebSocket
const WebSocket = require('ws');
\`\`\`

## 📞 การสนับสนุน

ระบบนี้ออกแบบมาเพื่อรองรับ Chrome 70 และ Android 6.0.1 โดยเฉพาะ

หากพบปัญหาการใช้งาน:
1. ตรวจสอบ Console ของเบราว์เซอร์
2. ดู Server logs ใน Terminal
3. ตรวจสอบ Network requests ใน DevTools

---

**🎯 V8 = ระบบจริง + รองรับ Chrome 70/Android 6.0.1 + Backend API + Real-time Updates**
