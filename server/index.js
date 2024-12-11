// ไฟล์นี้เป็นส่วนหลักของเว็บแอปพลิเคชัน Express ที่จัดการเกี่ยวกับการ login/logout และการเข้าถึงหน้าต่างๆ

// นำเข้า module ที่จำเป็น
// - express สำหรับสร้างเว็บเซิร์ฟเวอร์
// - express-session สำหรับจัดการ session
// - database.js สำหรับจัดการฐานข้อมูล
const express = require("express");
const session = require("express-session");
const db = require("./database");
const port = 8080;

// สร้าง express application
const app = express();

// เพิ่ม middleware สำหรับอ่านข้อมูลจากฟอร์ม HTML
app.use(express.urlencoded({ extended: true }));
/*
หากไม่มี express.urlencoded middleware จะเกิดปัญหาดังนี้:
1. เซิร์ฟเวอร์ไม่สามารถอ่านข้อมูลจากฟอร์ม HTML POST ได้
2. req.body จะเป็น undefined
3. เมื่อผู้ใช้ส่งฟอร์มลงทะเบียน อีเมลและรหัสผ่านจะไม่ถูกส่งไปยังเซิร์ฟเวอร์

เพราะว่า:
- express.urlencoded() เป็น middleware ที่แปลงข้อมูลฟอร์ม HTML ที่ส่งมาในรูปแบบ application/x-www-form-urlencoded ให้เป็นรูปแบบที่ JavaScript อ่านได้
- ตัวเลือก extended: true อนุญาตให้ส่งข้อมูลที่ซับซ้อน (เช่น nested objects) ผ่านฟอร์มได้
*/

// ตั้งค่า session middleware
app.use(
  session({
    secret: "secret", // คีย์ลับสำหรับเข้ารหัส session
    resave: true, // บันทึก session ทุกครั้งที่มีการเปลี่ยนแปลง
    saveUninitialized: true, // บันทึก session แม้จะยังไม่มีข้อมูล
    cookie: {
      maxAge: 10 * 1000, // อายุ cookie 10 วินาที
    },
  })
);

// middleware ตรวจสอบการยืนยันตัวตน
// - ตรวจสอบ session ID จากฐานข้อมูล
// - ถ้ามี session ID ให้ไปต่อ
// - ถ้าไม่มีส่งรหัส 403 forbidden กลับไป
const auth = async (req, res, next) => {
  const id = await db.getSessionIDFromDatabase(req.sessionID);
  if (id) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// จัดการ route หน้าแรก ('/')
// - ตรวจสอบ session ID จากฐานข้อมูล
// - ถ้ามี session ID และพบในฐานข้อมูล แสดงปุ่ม Logout
// - ถ้าไม่มี session ID หรือไม่พบในฐานข้อมูล แสดงปุ่ม Login
app.get("/", async (req, res, next) => {
  const id = await db.getSessionIDFromDatabase(req.sessionID);
  if (req.sessionID && id) {
    res.send(`
    <h1>Home Page</h1>
    <a href="/products">Products</a>
    <a href="/users">Users</a>
    <hr>
    <form action="/" method="post">
      <input type="hidden" name="status" value="logout" />
      <button type="submit">Logout</button>
    </form>
    `);
  } else {
    res.send(`
    <h1>Home Page</h1>
    <a href="/products">Products</a>
    <a href="/users">Users</a>
    <hr>
    <form action="/" method="post">
      <input type="hidden" name="status" value="login" />
      <button type="submit">Login</button>
    </form>
    `);
  }
});

// จัดการ route สำหรับ Login/Logout
// - รับ request POST จากฟอร์ม login/logout
// - ถ้าเป็น login บันทึก session ID ลงฐานข้อมูล
// - ถ้าเป็น logout ลบ session ID ออกจากฐานข้อมูล
// - redirect กลับไปหน้าแรกเมื่อเสร็จสิ้น
app.post("/", async (req, res, next) => {
  const status = req.body.status;
  try {
    if (status === "login") {
      await db.setSessionIDToDatabase("Anonymous", req.sessionID);
    } else {
      await db.clearSessionFromDatabase(req.sessionID);
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// จัดการ route แสดงหน้า Products
// - ต้องผ่านการตรวจสอบ auth ก่อน
// - แสดงหน้า Products พร้อมลิงก์กลับหน้าแรก
app.get("/products", auth, (req, res, next) => {
  res.send(`
    <h1>Products Page</h1>
    <hr>
    <a href="/">Back Home</a>
  `);
});

// จัดการ route แสดงหน้า Users
// - ต้องผ่านการตรวจสอบ auth ก่อน
// - แสดงหน้า Users พร้อมลิงก์กลับหน้าแรก
app.get("/users", auth, (req, res, next) => {
  res.send(`
    <h1>Users Page</h1>
    <hr>
    <a href="/">Back Home</a>
  `);
});

// จัดการ route แสดงหน้า User
// - ต้องผ่านการตรวจสอบ auth ก่อน
// - แสดงหน้า User พร้อมลิงก์กลับหน้าแรก
app.get("/user", auth, (req, res, next) => {
  res.send(`
    <h1>User Page</h1>
    <hr>
    <a href="/">Back Home</a>
  `);
});

// จัดการ route สำหรับหน้าที่ไม่พบ (404 Not Found)
// - ส่งรหัส 404 กลับไปเมื่อไม่พบหน้าที่ร้องขอ
app.use((req, res) => {
  res.sendStatus(404);
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 8080
// - แสดงข้อความยืนยันการทำงานของเซิร์ฟเวอร์
// - แสดง URL สำหรับเข้าถึงเว็บแอป
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
