// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');

const app = express();

// ====== MIDDLEWARE ======
app.use(cors()); // Cho phép truy cập từ frontend khác domain
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ body

// ====== KẾT NỐI MONGODB ======
mongoose.connect('mongodb+srv://khang223039_db_user:LcnVp6VGUWSIEXAE@group13-project.iwftep5.mongodb.net/groupDB?retryWrites=true&w=majority&appName=group13-project')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ====== ROUTES ======
// Tất cả route liên quan tới người dùng sẽ bắt đầu bằng /api/users
app.use('/api/users', userRoutes);

// ====== TRANG GỐC ======
app.get('/', (req, res) => {
  res.send('🚀 Server đang chạy! Hãy truy cập /api/users để dùng API.');
});

// ====== KHỞI ĐỘNG SERVER ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server chạy tại http://localhost:${PORT}`));
