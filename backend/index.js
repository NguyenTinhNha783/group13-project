const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user'); // ← import routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

mongoose.connect('mongodb+srv://khang223039_db_user:LcnVp6VGUWSIEXAE@group13-project.iwftep5.mongodb.net/groupDB?retryWrites=true&w=majority')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));
