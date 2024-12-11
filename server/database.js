// สร้างฐานข้อมูลจำลองที่เก็บข้อมูลผู้ใช้
const database = () => {
  const data = [
    {
      username: "admin",
      password: "1234admin",
    },
    {
      username: "user1",
      password: "1234user1",
    },
  ];
  // Wrapper function เพื่อส่งคืนข้อมูล
  const wrapper = () => {
    return data;
  };
  return wrapper;
};
const data = database();

// ฟังก์ชันดึง Session ID จากฐานข้อมูล
const getSessionIDFromDatabase = (id) => {
  return new Promise((resolve, reject) => {
    // Fixed typo 'resole' to 'resolve'
    setTimeout(() => {
      const user = data.find((element) => element.sessionID === id);
      resolve(user?.sessionID);
    }, 100);
  });
};

// ฟังก์ชันบันทึก Session ID ลงฐานข้อมูล
const setSessionIDToDatabase = (username, id) => {
  setTimeout(() => {
    const index = data.findIndex((element) => element.username === username);
    if (index !== -1) {
      data[index].sessionID = id;
    }
  }, 100);
};

// ฟังก์ชันลบ Session ID ออกจากฐานข้อมูล
const clearSessionFromDatabase = (id) => {
  setTimeout(() => {
    const index = data.findIndex((element) => element.sessionID === id);
    if (index !== -1) {
      data[index]["sessionID"] = null;
    }
  }, 100);
};

// ส่งออกฟังก์ชันต่างๆ เพื่อใช้งาน
module.exports = {
  getSessionIDFromDatabase,
  setSessionIDToDatabase,
  clearSessionFromDatabase,
};
