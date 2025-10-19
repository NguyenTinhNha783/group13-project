const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
const cors = require('cors');  // ← THÊM DÒNG NÀY
const User = require('./models/User'); 
const app = express();

app.use(cors());               // ← THÊM DÒNG NÀY
app.use(express.json());

//  Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://khang223039_db_user:LcnVp6VGUWSIEXAE@group13-project.iwftep5.mongodb.net/groupDB?retryWrites=true&w=majority&appName=group13-project')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

//  API lấy toàn bộ user
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  API thêm user mới
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Trang gốc
app.get('/', (req, res) => {
  res.send('Server is running and operational! Use /users endpoint for API.'); 
});

app.listen(3000, () => {
  console.log('🚀 Server đang chạy tại http://localhost:3000');
});
=======
const app = express();

app.use(express.json());

const userRoutes = require('./routes/user');
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

>>>>>>> backend
