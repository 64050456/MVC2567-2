const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// ตั้งค่า template engine เป็น EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware สำหรับอ่าน body จาก form
app.use(bodyParser.urlencoded({ extended: false }));

// เส้นทางสำหรับไฟล์ static (ถ้ามี)
app.use(express.static(path.join(__dirname, 'public')));

// ใช้งาน routes
app.use('/', productRoutes);

// เริ่มต้นเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
