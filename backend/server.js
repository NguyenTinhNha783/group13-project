require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user'); // route user
<<<<<<< HEAD
const sendEmail = require('./sendEmail');
=======
const sendEmail = require('./utils/sendEmail');
>>>>>>> 2ab4e8920067af3b26b4e972f3b1313c4ae18f61

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount route /users
app.use('/users', userRoutes);

// Trang gốc
app.get('/', (req, res) => {
  res.send('🚀 Server đang chạy! Truy cập /users để dùng API.');
});

// Kết nối MongoDB
mongoose.connect(
  'mongodb+srv://khang223039_db_user:LcnVp6VGUWSIEXAE@group13-project.iwftep5.mongodb.net/groupDB?retryWrites=true&w=majority&appName=group13-project'
)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// Khởi chạy server
const PORT = process.env.PORT || 3000;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`🌐 Server chạy tại http://localhost:${PORT}`));
=======
app.listen(PORT, () => console.log(`🌐 Server chạy tại http://localhost:${PORT}`));
>>>>>>> 2ab4e8920067af3b26b4e972f3b1313c4ae18f61
