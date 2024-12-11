// ไฟล์นี้จัดการเกี่ยวกับฐานข้อมูลจำลองและการจัดการ session

// สร้างฐานข้อมูลจำลองโดยใช้ closure pattern
// - สร้าง array เก็บข้อมูลผู้ใช้เริ่มต้น 2 คนคือ Anonymous และ Admin
// - ใช้ wrapper function เพื่อป้องกันการเข้าถึง array โดยตรงจากภายนอก
// - return wrapper function ที่จะส่งคืนข้อมูล array
const database = () => {
  const data = [
    {
      username: "Anonymous",
      password: "null",
    },
    {
      username: "Admin",
      password: "null",
    },
  ];
  const wrapper = () => {
    return data;
  };
  return wrapper;
};
const data = database();

// ฟังก์ชันค้นหา session ID ในฐานข้อมูล
// - รับ parameter เป็น session ID ที่ต้องการค้นหา
// - ใช้ Promise และ setTimeout จำลองการทำงานแบบ async
// - ค้นหาผู้ใช้ที่มี session ID ตรงกับที่ระบุ
// - ส่งคืน session ID ถ้าพบ หรือ undefined ถ้าไม่พบ
const getSessionIDFromDatabase = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = data().find((element) => element.sessionID === id);
      resolve(user?.sessionID);
    }, 100);
  });
};

// ฟังก์ชันบันทึก session ID ลงฐานข้อมูล
// - รับ parameter เป็น username และ session ID ที่ต้องการบันทึก
// - ใช้ Promise และ setTimeout จำลองการทำงานแบบ async
// - ค้นหาผู้ใช้จาก username
// - ถ้าพบจะบันทึก session ID และ return true
// - ถ้าไม่พบจะ return error
const setSessionIDToDatabase = (username, id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = data().findIndex(
        (element) => element.username === username
      );
      if (index !== -1) {
        data()[index].sessionID = id;
        resolve(true);
      } else {
        reject(new Error("User not found"));
      }
    }, 100);
  });
};

// ฟังก์ชันลบ session ID ออกจากฐานข้อมูล
// - รับ parameter เป็น session ID ที่ต้องการลบ
// - ใช้ Promise และ setTimeout จำลองการทำงานแบบ async
// - ค้นหาผู้ใช้จาก session ID
// - ถ้าพบจะลบ session ID โดยเซ็ตเป็น null และ return true
// - ถ้าไม่พบจะ return false
const clearSessionFromDatabase = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = data().findIndex((element) => element.sessionID === id);
      if (index !== -1) {
        data()[index].sessionID = null;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

// ส่งออกฟังก์ชันทั้งหมดเพื่อให้ไฟล์อื่นเรียกใช้งานได้
module.exports = {
  getSessionIDFromDatabase,
  setSessionIDToDatabase,
  clearSessionFromDatabase,
};
