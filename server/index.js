// นำเข้า express framework และ express-session middleware
const express = require("express");
const session = require("express-session");
const port = 8080;

// สร้าง express application
const app = express();

// ตั้งค่า session middleware
app.use(
  session({
    secret: "secret", // รหัสลับสำหรับเข้ารหัส session
    resave: true, // บันทึก session ใหม่ทุกครั้งที่มีการเปลี่ยนแปลง
    saveUninitialized: true, // บันทึก session แม้จะยังไม่มีข้อมูล
  })
);

// เพิ่ม middleware สำหรับอ่านข้อมูลจากฟอร์ม
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});

// Route สำหรับหน้าลงทะเบียน ('/register')
// แสดงฟอร์มสำหรับกรอกอีเมลและรหัสผ่าน
app.get("/register", (req, res) => {
  res.send(`
    <form action="/register" method="post">
      <input type="email" name="email" placeholder="Email" autocomplete="off" />
      <input type="password" name="password" placeholder="Password" autocomplete="off" />
      <button type="submit">Register</button>
    </form>
  `);
});

// การลงทะเบียน http://localhost:8080/register
// Route สำหรับการลงทะเบียน - รับข้อมูลจากฟอร์มและบันทึกลงใน session
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  req.session.data = { email, password };
  res.redirect("/profile");
});

// Route สำหรับแสดงข้อมูลโปรไฟล์
app.get("/profile", (req, res) => {
  if (req.session.data) {
    res.json(req.session.data);
  } else {
    res.send("No data");
  }
});

// Route สำหรับหน้าแรก ('/')
app.get("/", (req, res, next) => {
  // ตรวจสอบว่ามีการนับจำนวนการเข้าชมหน้านี้แล้วหรือไม่
  if (req.session.view) {
    // ถ้ามีแล้ว เพิ่มจำนวนขึ้น 1
    req.session.view += 1;
  } else {
    // ถ้ายังไม่มี เริ่มนับที่ 1
    req.session.view = 1;
  }
  // ส่งข้อความแสดงจำนวนครั้งที่ผู้ใช้เข้าชมหน้านี้กลับไป
  res.send(`You have visited this page ${req.session.view} times`);
});

// เริ่มต้น server ที่ port 8080
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
