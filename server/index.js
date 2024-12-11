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
